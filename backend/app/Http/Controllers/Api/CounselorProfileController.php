<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CounselorProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CounselorProfileController extends Controller
{
    /**
     * Menampilkan daftar konselor aktif.
     *
     * Digunakan mahasiswa untuk melihat konselor
     * yang tersedia di Startiva.
     */
    public function index()
    {
        $profiles = CounselorProfile::with([
            'user:id,name,email',
        ])
            ->where('status', 'active')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar konselor berhasil diambil.',
            'data' => $profiles,
        ], 200);
    }


    /**
     * Menampilkan profil konselor yang sedang login.
     */
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'konselor') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya konselor yang dapat melihat profil ini.',
            ], 403);
        }

        $profile = CounselorProfile::with([
            'user:id,name,email',
        ])
            ->where('user_id', $user->id)
            ->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profil konselor belum tersedia.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil konselor berhasil diambil.',
            'data' => $profile,
        ], 200);
    }


    /**
     * Membuat atau menyimpan profil konselor.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'konselor') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya konselor yang dapat membuat profil.',
            ], 403);
        }

        // Cari profil milik konselor yang sedang login.
        $existingProfile = CounselorProfile::where(
            'user_id',
            $user->id
        )->first();

        // Validasi student_id.
        $validated = $request->validate([
            'student_id' => [
                'required',
                'string',
                'max:50',
                Rule::unique('counselor_profiles', 'student_id')
                    ->ignore($existingProfile?->id),
            ],

            'phone' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'expertise' => 'nullable|string|max:255',
        ]);

        // Buat profil baru atau perbarui profil yang sudah ada.
        $profile = CounselorProfile::updateOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'student_id' => $validated['student_id'],
                'phone' => $validated['phone'] ?? null,
                'bio' => $validated['bio'] ?? null,
                'expertise' => $validated['expertise'] ?? null,
                'status' => 'active',
            ]
        );

        // Muat relasi pengguna.
        $profile->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Profil konselor berhasil disimpan.',
            'data' => $profile,
        ], $existingProfile ? 200 : 201);
    }


    /**
     * Memperbarui profil konselor.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'konselor') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya konselor yang dapat memperbarui profil.',
            ], 403);
        }

        $profile = CounselorProfile::where(
            'user_id',
            $user->id
        )->first();

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Profil konselor belum tersedia.',
            ], 404);
        }

        $validated = $request->validate([
            'student_id' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('counselor_profiles', 'student_id')
                    ->ignore($profile->id),
            ],

            'phone' => 'sometimes|nullable|string|max:20',
            'bio' => 'sometimes|nullable|string',
            'expertise' => 'sometimes|nullable|string|max:255',
        ]);

        $profile->update($validated);

        $profile->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Profil konselor berhasil diperbarui.',
            'data' => $profile,
        ], 200);
    }
}
