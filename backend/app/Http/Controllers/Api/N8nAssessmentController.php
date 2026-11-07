<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use App\Models\AssessmentStatistic;
use Illuminate\Http\Request;

class N8nAssessmentController extends Controller
{
    private function authorizeN8n(Request $request)
    {
        $secret = env('N8N_API_SECRET');

        if (
            empty($secret) ||
            !hash_equals($secret, (string) $request->header('X-N8N-SECRET'))
        ) {
            abort(401, 'Unauthorized access.');
        }
    }

    // Mengambil seluruh data assessment untuk dianalisis n8n
    public function getAssessmentData(Request $request)
    {
        $this->authorizeN8n($request);

        $assessments = BusinessAssessment::select(
            'id',
            'answers',
            'total_score',
            'score_percentage',
            'readiness_level',
            'aspect_scores',
            'created_at'
        )
        ->orderBy('created_at', 'asc')
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Data assessment berhasil diambil.',
            'total' => $assessments->count(),
            'data' => $assessments,
        ]);
    }

    // Menyimpan hasil analisis statistik dari n8n
    public function storeStatistics(Request $request)
    {
        $this->authorizeN8n($request);

        $validated = $request->validate([
            'total_assessments' => 'required|integer|min:0',
            'total_responses' => 'required|integer|min:0',
            'mean' => 'required|numeric',
            'standard_deviation' => 'required|numeric|min:0',
            'frequency' => 'required|array',
            'average_score_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $validated['calculated_at'] = now();

        $statistics = AssessmentStatistic::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hasil statistik berhasil disimpan.',
            'data' => $statistics,
        ], 201);
    }
}
