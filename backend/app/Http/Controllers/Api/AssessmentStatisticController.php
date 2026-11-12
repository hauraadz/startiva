<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssessmentStatistic;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AssessmentStatisticController extends Controller
{
    /**
     * Mengambil statistik RICE Assessment terbaru.
     *
     * Endpoint:
     * GET /api/konselor/assessment-statistics/latest
     *
     * Akses:
     * Konselor yang sudah login.
     */
    public function latest(): JsonResponse
    {
        $user = Auth::user();

        // =============================================
        // VALIDASI LOGIN
        // =============================================

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Silakan login terlebih dahulu.',
                'data' => null,
            ], 401);
        }

        // =============================================
        // VALIDASI ROLE
        // =============================================

        if ($user->role !== 'konselor') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya konselor yang dapat melihat statistik assessment.',
                'data' => null,
            ], 403);
        }

        // =============================================
        // MENGAMBIL STATISTIK TERBARU
        // =============================================

        $statistics = AssessmentStatistic::query()
            ->orderByDesc('calculated_at')
            ->orderByDesc('id')
            ->first();

        // =============================================
        // JIKA BELUM ADA DATA
        // =============================================

        if (!$statistics) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada data statistik RICE Assessment.',
                'data' => null,
            ], 404);
        }

        // =============================================
        // RESPONSE STATISTIK
        // =============================================

        return response()->json([
            'success' => true,
            'message' => 'Data statistik RICE Assessment berhasil diambil.',

            'data' => [
                'id' => $statistics->id,

                'total_assessments' => $statistics->total_assessments,

                'total_responses' => $statistics->total_responses,

                'mean' => $statistics->mean,

                'standard_deviation' => $statistics->standard_deviation,

                'frequency' => $statistics->frequency,

                'average_score_percentage' => $statistics->average_score_percentage,

                'calculated_at' => $statistics->calculated_at,
            ],
        ], 200);
    }
}
