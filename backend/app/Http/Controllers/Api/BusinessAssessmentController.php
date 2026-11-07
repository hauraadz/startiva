<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use Illuminate\Http\Request;

class BusinessAssessmentController extends Controller
{
    // Menyimpan hasil assessment
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

        return response()->json([
            'success' => true,
            'message' => 'Hasil assessment berhasil disimpan.',
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
