<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BusinessAssessmentController extends Controller
{
    // Menyimpan hasil assessment dan mengirim data ke n8n
    public function store(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'aspect_scores' => 'nullable|array',
            'recommendations' => 'nullable|array',
        ]);

        // Mengambil seluruh nilai jawaban
        $scores = [];

        array_walk_recursive($validated['answers'], function ($value) use (&$scores) {
            if (is_numeric($value)) {
                $scores[] = (int) $value;
            }
        });

        if (count($scores) === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Jawaban assessment belum valid.'
            ], 422);
        }

        // Menghitung skor di sisi server
        $totalScore = array_sum($scores);
        $maxScore = count($scores) * 4;

        $percentage = round(($totalScore / $maxScore) * 100, 2);

        if ($percentage >= 80) {
            $readinessLevel = 'Sangat Siap';
        } elseif ($percentage >= 65) {
            $readinessLevel = 'Siap';
        } elseif ($percentage >= 45) {
            $readinessLevel = 'Cukup Siap';
        } else {
            $readinessLevel = 'Belum Siap';
        }

        // Menyimpan hasil ke database
        $assessment = $request->user()
            ->businessAssessments()
            ->create([
                'answers' => $validated['answers'],
                'total_score' => $totalScore,
                'score_percentage' => $percentage,
                'readiness_level' => $readinessLevel,
                'aspect_scores' => $validated['aspect_scores'] ?? null,
                'recommendations' => $validated['recommendations'] ?? null,
            ]);

        // Mengirim hasil assessment ke n8n
        $n8nStatus = 'not_configured';

        $webhookUrl = env('N8N_ASSESSMENT_WEBHOOK');

        if ($webhookUrl) {
            try {
                $response = Http::timeout(15)->post($webhookUrl, [
                    'assessment_id' => $assessment->id,
                    'user_id' => $request->user()->id,
                    'answers' => $validated['answers'],
                    'total_score' => $totalScore,
                    'max_score' => $maxScore,
                    'score_percentage' => $percentage,
                    'readiness_level' => $readinessLevel,
                    'aspect_scores' => $validated['aspect_scores'] ?? [],
                    'recommendations' => $validated['recommendations'] ?? [],
                    'created_at' => $assessment->created_at,
                ]);

                $n8nStatus = $response->successful()
                    ? 'sent'
                    : 'failed';

                if (!$response->successful()) {
                    Log::warning('n8n gagal menerima assessment.', [
                        'assessment_id' => $assessment->id,
                        'response' => $response->body(),
                    ]);
                }
            } catch (\Throwable $e) {
                $n8nStatus = 'failed';

                Log::error('Gagal menghubungi n8n.', [
                    'assessment_id' => $assessment->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Hasil assessment berhasil disimpan.',
            'n8n_status' => $n8nStatus,
            'data' => $assessment,
        ], 201);
    }

    // Mengambil riwayat assessment
    public function index(Request $request)
    {
        $assessments = $request->user()
            ->businessAssessments()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat assessment berhasil diambil.',
            'data' => $assessments,
        ]);
    }

    // Mengambil hasil assessment terbaru
    public function latest(Request $request)
    {
        $assessment = $request->user()
            ->businessAssessments()
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Hasil assessment terbaru berhasil diambil.',
            'data' => $assessment,
        ]);
    }
}
