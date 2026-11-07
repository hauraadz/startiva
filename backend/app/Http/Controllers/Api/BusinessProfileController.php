<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BusinessProfileController extends Controller
{
    // Mengambil profil bisnis mahasiswa
    public function show(Request $request)
    {
        $profile = $request->user()->businessProfile;

        return response()->json([
            'success' => true,
            'message' => 'Data profil bisnis berhasil diambil.',
            'data' => $profile,
        ]);
    }

    // Menyimpan atau memperbarui profil bisnis
    public function save(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'business_stage' => 'required|string|max:100',
            'business_category' => 'nullable|string|max:100',
            'business_idea' => 'nullable|string',
            'product_description' => 'nullable|string',
            'target_market' => 'nullable|string',
        ]);

        $profile = $request->user()->businessProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Profil bisnis berhasil disimpan.',
            'data' => $profile,
        ]);
    }
}
