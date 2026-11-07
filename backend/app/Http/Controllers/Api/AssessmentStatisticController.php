<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssessmentStatistic;

class AssessmentStatisticController extends Controller
{
    public function latest()
    {
        $statistics = AssessmentStatistic::latest('calculated_at')
            ->first();

        if (!$statistics) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada data statistik.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Data statistik berhasil diambil.',
            'data' => $statistics,
        ]);
    }
}
