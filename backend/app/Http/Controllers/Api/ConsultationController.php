<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\BusinessProfile;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    // Mengambil seluruh pengajuan konsultasi milik mahasiswa
    public function index(Request $request)
    {
        $consultations = Consultation::with('businessProfile')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat konsultasi berhasil diambil.',
            'data' => $consultations,
        ]);
    }

    // Mengirim pengajuan konsultasi
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_profile_id' => 'nullable|integer|exists:business_profiles,id',
            'topic' => 'required|string|max:255',
            'description' => 'required|string',
            'preferred_contact' => 'nullable|string|max:100',
            'contact_detail' => 'nullable|string|max:255',
        ]);

        // Pastikan profil bisnis merupakan milik pengguna yang login
        if (!empty($validated['business_profile_id'])) {
            $profile = BusinessProfile::where(
                'id',
                $validated['business_profile_id']
            )
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Profil bisnis tidak ditemukan.',
                ], 403);
            }
        }

        $consultation = Consultation::create([
            'user_id' => $request->user()->id,
            'business_profile_id' => $validated['business_profile_id'] ?? null,
            'topic' => $validated['topic'],
            'description' => $validated['description'],
            'preferred_contact' => $validated['preferred_contact'] ?? null,
            'contact_detail' => $validated['contact_detail'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan konsultasi berhasil dikirim.',
            'data' => $consultation,
        ], 201);
    }

    // Mengambil detail satu pengajuan konsultasi
    public function show(Request $request, $id)
    {
        $consultation = Consultation::with('businessProfile')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan konsultasi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $consultation,
        ]);
    }
}
