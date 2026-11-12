<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    /**
     * Mengambil daftar konsultasi berdasarkan role.
     *
     * Mahasiswa:
     * Hanya melihat konsultasi miliknya.
     *
     * Konselor:
     * Melihat pengajuan pending dari semua mahasiswa
     * dan konsultasi yang sudah ditugaskan kepadanya.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Consultation::with([
            'user:id,name,email',
            'counselor:id,name,email',
        ]);

        if ($user->role === 'mahasiswa') {

            $query->where('user_id', $user->id);

        } elseif ($user->role === 'konselor') {

            $query->where(function ($q) use ($user) {
                $q->where('status', 'pending')
                    ->orWhere('counselor_id', $user->id);
            });

        } else {

            return response()->json([
                'success' => false,
                'message' => 'Role tidak memiliki akses.',
            ], 403);
        }

        $consultations = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Data konsultasi berhasil diambil.',
            'data' => $consultations,
        ], 200);
    }


    /**
     * Mahasiswa mengajukan konseling.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya mahasiswa yang dapat mengajukan konseling.',
            ], 403);
        }

        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'description' => 'required|string',
            'preferred_contact' => 'nullable|string|max:100',
            'contact_detail' => 'nullable|string|max:255',
        ]);

        $consultation = Consultation::create([
            'user_id' => $user->id,
            'counselor_id' => null,
            'topic' => $validated['topic'],
            'description' => $validated['description'],
            'preferred_contact' => $validated['preferred_contact'] ?? null,
            'contact_detail' => $validated['contact_detail'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan konseling berhasil dikirim.',
            'data' => $consultation->load([
                'user:id,name,email',
                'counselor:id,name,email',
            ]),
        ], 201);
    }


    /**
     * Mengambil detail pengajuan konsultasi.
     *
     * Mahasiswa:
     * Hanya dapat melihat konsultasi miliknya.
     *
     * Konselor:
     * Dapat melihat pengajuan pending dan konsultasi
     * yang sudah ditugaskan kepadanya.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $query = Consultation::with([
            'user:id,name,email',
            'counselor:id,name,email',
        ]);

        if ($user->role === 'mahasiswa') {

            $query->where('user_id', $user->id);

        } elseif ($user->role === 'konselor') {

            $query->where(function ($q) use ($user) {
                $q->where('status', 'pending')
                    ->orWhere('counselor_id', $user->id);
            });

        } else {

            return response()->json([
                'success' => false,
                'message' => 'Role tidak memiliki akses.',
            ], 403);
        }

        $consultation = $query->find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan konseling tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail konseling berhasil diambil.',
            'data' => $consultation,
        ], 200);
    }


    /**
     * Konselor menerima, menolak, atau menyelesaikan konsultasi.
     *
     * Alur status:
     * pending -> accepted
     * pending -> rejected
     * accepted -> completed
     */
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'konselor') {
            return response()->json([
                'success' => false,
                'message' => 'Hanya konselor yang dapat memproses pengajuan.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:accepted,rejected,completed',
        ]);

        $consultation = Consultation::find($id);

        if (!$consultation) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan konseling tidak ditemukan.',
            ], 404);
        }

        // Pastikan pengajuan tidak ditangani konselor lain.
        if (
            $consultation->counselor_id !== null &&
            (int) $consultation->counselor_id !== (int) $user->id
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Pengajuan ini sudah ditangani konselor lain.',
            ], 403);
        }

        $newStatus = $validated['status'];
        $currentStatus = $consultation->status;

        // Aturan perubahan status konsultasi.
        $allowedTransitions = [
            'pending' => ['accepted', 'rejected'],
            'accepted' => ['completed'],
            'rejected' => [],
            'completed' => [],
        ];

        if (
            !isset($allowedTransitions[$currentStatus]) ||
            !in_array(
                $newStatus,
                $allowedTransitions[$currentStatus],
                true
            )
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Perubahan status konseling tidak diperbolehkan.',
            ], 422);
        }

        // Simpan konselor yang menangani pengajuan.
        $consultation->counselor_id = $user->id;
        $consultation->status = $newStatus;
        $consultation->save();

        return response()->json([
            'success' => true,
            'message' => 'Status konseling berhasil diperbarui.',
            'data' => $consultation->load([
                'user:id,name,email',
                'counselor:id,name,email',
            ]),
        ], 200);
    }
}
