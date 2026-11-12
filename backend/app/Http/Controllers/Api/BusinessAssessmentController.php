<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BusinessAssessmentController extends Controller
{
    /**
     * Menyimpan hasil Student Well-being Assessment.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya mahasiswa yang dapat mengisi assessment.',
            ], 403);
        }

        $validated = $request->validate([
            'answers' => 'required|array|min:1',
            'aspect_scores' => 'nullable|array',
            'recommendations' => 'nullable|array',
        ]);

        // Mengambil seluruh skor jawaban dari skala 1-4.
        $scores = [];

        array_walk_recursive(
            $validated['answers'],
            function ($value) use (&$scores) {
                if (
                    is_numeric($value) &&
                    !is_bool($value)
                ) {
                    $scores[] = (int) $value;
                }
            }
        );

        if (empty($scores)) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ditemukan jawaban dengan skor yang valid.',
            ], 422);
        }

        // Memastikan setiap jawaban berada pada skala 1-4.
        foreach ($scores as $score) {
            if ($score < 1 || $score > 4) {
                return response()->json([
                    'success' => false,
                    'message' => 'Skor jawaban harus berada pada rentang 1 sampai 4.',
                ], 422);
            }
        }

        // Perhitungan skor.
        $totalScore = array_sum($scores);
        $totalQuestions = count($scores);

        $mean = $totalScore / $totalQuestions;

        // Normalisasi skala 1-4 menjadi indikator 0-100.
        // Bukan persentase kesehatan mental.
        $percentage = round(
            (($mean - 1) / 3) * 100,
            2
        );

        // Simpan hasil assessment.
        // readiness_level dipertahankan hanya untuk kompatibilitas
        // dengan kolom lama yang masih NOT NULL.
        // Nilainya bukan kategori atau interpretasi kondisi mahasiswa.
        $assessment = BusinessAssessment::create([
            'user_id' => $user->id,
            'answers' => $validated['answers'],
            'total_score' => $totalScore,
            'score_percentage' => $percentage,
            'readiness_level' => 'Refleksi mandiri',
            'aspect_scores' => $validated['aspect_scores'] ?? [],
            'recommendations' => $validated['recommendations'] ?? [],
        ]);

        // Kirim data assessment ke n8n.
        $n8nStatus = 'not_configured';

        $webhookUrl = config('services.startiva.assessment_webhook');

        if (!empty($webhookUrl)) {
            try {
                $response = Http::timeout(15)->post($webhookUrl, [
                    'event' => 'student_wellbeing_assessment_submitted',
                    'assessment_id' => $assessment->id,
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'answers' => $assessment->answers,
                    'total_questions' => $totalQuestions,
                    'total_score' => $totalScore,
                    'mean' => round($mean, 2),
                    'score_percentage' => $percentage,
                    'aspect_scores' => $assessment->aspect_scores,
                    'recommendations' => $assessment->recommendations,
                    'created_at' => $assessment->created_at,
                ]);

                if ($response->successful()) {
                    $n8nStatus = 'sent';
                } else {
                    $n8nStatus = 'failed';

                    Log::warning(
                        'n8n gagal menerima Student Well-being Assessment.',
                        [
                            'assessment_id' => $assessment->id,
                            'status' => $response->status(),
                        ]
                    );
                }
            } catch (\Throwable $e) {
                $n8nStatus = 'failed';

                Log::error(
                    'Gagal menghubungi webhook n8n.',
                    [
                        'assessment_id' => $assessment->id,
                        'error' => $e->getMessage(),
                    ]
                );
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Student Well-being Assessment berhasil disimpan.',
            'n8n_status' => $n8nStatus,
            'data' => [
                'id' => $assessment->id,
                'total_score' => $totalScore,
                'total_questions' => $totalQuestions,
                'mean' => round($mean, 2),
                'score_percentage' => $percentage,
                'answers' => $assessment->answers,
                'aspect_scores' => $assessment->aspect_scores,
                'recommendations' => $assessment->recommendations,
                'created_at' => $assessment->created_at,
            ],
        ], 201);
    }

    /**
     * Mengambil riwayat assessment mahasiswa.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Akses hanya untuk mahasiswa.',
            ], 403);
        }

        $assessments = BusinessAssessment::where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat Student Well-being Assessment berhasil diambil.',
            'data' => $assessments,
        ], 200);
    }

    /**
     * Mengambil hasil assessment terbaru.
     */
    public function latest(Request $request)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Akses hanya untuk mahasiswa.',
            ], 403);
        }

        $assessment = BusinessAssessment::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'message' => $assessment
                ? 'Hasil Student Well-being Assessment terbaru berhasil diambil.'
                : 'Mahasiswa belum mengisi assessment.',
            'data' => $assessment,
        ], 200);
    }
}
