<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use App\Models\AssessmentStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class N8nAssessmentController extends Controller
{
    /**
     * MEMERIKSA AUTENTIKASI N8N
     *
     * n8n wajib mengirim header:
     * X-N8N-SECRET
     */
    private function authorizeN8n(Request $request)
    {
        $secret = config('services.startiva.n8n_secret');

        $providedSecret = (string) $request->header('X-N8N-SECRET');

        if (
            empty($secret) ||
            empty($providedSecret) ||
            !hash_equals((string) $secret, $providedSecret)
        ) {
            Log::warning(
                'Percobaan akses endpoint n8n tanpa autentikasi.'
            );

            abort(401, 'Unauthorized access.');
        }
    }


    /**
     * MENGAMBIL DATA STUDENT WELL-BEING ASSESSMENT
     *
     * Endpoint:
     * GET /api/n8n/assessment-data
     */
    public function getAssessmentData(Request $request)
    {
        $this->authorizeN8n($request);

        $assessments = BusinessAssessment::query()
            ->select([
                'id',
                'user_id',
                'answers',
                'aspect_scores',
                'recommendations',
                'created_at',
            ])
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data Student Well-being Assessment berhasil diambil.',
            'total' => $assessments->count(),
            'data' => $assessments,
        ], 200);
    }


    /**
     * MENYIMPAN HASIL STATISTIK STUDENT WELL-BEING ASSESSMENT
     *
     * Endpoint:
     * POST /api/n8n/assessment-statistics
     */
    public function storeStatistics(Request $request)
    {
        $this->authorizeN8n($request);

        // =============================================
        // VALIDASI DATA STATISTIK
        // =============================================

        $validated = $request->validate([
            'total_assessments' => 'required|integer|min:0',

            'total_responses' => 'required|integer|min:0',

            'mean' => 'required|numeric|min:1|max:4',

            'standard_deviation' => 'required|numeric|min:0|max:3',

            'frequency' => 'required|array',

            'frequency.*' => 'required|integer|min:0',

            'average_score_percentage' => 'required|numeric|min:0|max:100',
        ]);

        // =============================================
        // VALIDASI KONSISTENSI DATA
        // =============================================

        if (
            $validated['total_assessments'] === 0 &&
            $validated['total_responses'] > 0
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah respons tidak boleh lebih dari nol jika belum ada assessment.',
            ], 422);
        }

        // =============================================
        // SIMPAN STATISTIK
        // =============================================

        $validated['calculated_at'] = now();

        $statistics = AssessmentStatistic::create($validated);

        Log::info(
            'Statistik Student Well-being Assessment berhasil diterima dari n8n.',
            [
                'statistics_id' => $statistics->id,
                'total_assessments' => $statistics->total_assessments,
                'total_responses' => $statistics->total_responses,
                'mean' => $statistics->mean,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Statistik Student Well-being Assessment berhasil disimpan.',
            'data' => $statistics,
        ], 201);
    }
}
