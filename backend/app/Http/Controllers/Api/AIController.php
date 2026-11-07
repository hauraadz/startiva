<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function chat(Request $request)
    {
        // Memastikan request masuk ke controller
        Log::info('STARTIVA AI: Request masuk ke AIController');

        $validated = $request->validate([
            'message' => 'required|string|max:3000',
            'history' => 'nullable|array|max:20',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string|max:3000',
        ]);

        $apiUrl = config('services.hermes.url');
        $apiKey = config('services.hermes.key');

        // Memeriksa konfigurasi Hermes
        if (!$apiUrl || !$apiKey) {
            Log::error('STARTIVA AI: Konfigurasi Hermes tidak tersedia.');

            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi Hermes belum tersedia.'
            ], 500);
        }

        // Mengambil pengguna yang sedang login
        $user = $request->user();

        // Mengambil profil bisnis pengguna
        $businessProfile = $user->businessProfile;

        // Mengambil assessment terbaru milik pengguna
        $latestAssessment = $user->businessAssessments()
            ->latest()
            ->first();

        // Menyusun informasi profil bisnis
        $profileContext = $businessProfile ? [
            'nama_bisnis' => $businessProfile->business_name,
            'tahap_bisnis' => $businessProfile->business_stage,
            'kategori_bisnis' => $businessProfile->business_category,
            'ide_bisnis' => $businessProfile->business_idea,
            'deskripsi_produk' => $businessProfile->product_description,
            'target_pasar' => $businessProfile->target_market,
        ] : null;

        // Menyusun informasi assessment terbaru
        $assessmentContext = $latestAssessment ? [
            'tanggal_assessment' => $latestAssessment->created_at,
            'jawaban' => $latestAssessment->answers,
            'total_skor' => $latestAssessment->total_score,
            'persentase_kesiapan' => $latestAssessment->score_percentage,
            'tingkat_kesiapan' => $latestAssessment->readiness_level,
            'skor_per_aspek' => $latestAssessment->aspect_scores,
            'rekomendasi_assessment' => $latestAssessment->recommendations,
        ] : null;

        // Menggabungkan seluruh konteks bisnis
        $businessContext = [
            'profil_bisnis' => $profileContext,
            'hasil_assessment_terbaru' => $assessmentContext,
        ];

        // Mengubah konteks menjadi JSON
        $businessContextJson = json_encode(
            $businessContext,
            JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        );

        if ($businessContextJson === false) {
            $businessContextJson = '{}';
        }

        // System prompt Startiva AI
        $systemPrompt = <<<PROMPT
Kamu adalah Startiva AI Business Assistant, asisten bisnis digital
yang membantu mahasiswa mengembangkan ide dan kesiapan bisnis.

TUJUAN UTAMA:
Membantu mahasiswa memahami kondisi bisnisnya, mengembangkan ide,
meningkatkan kesiapan bisnis, dan menentukan langkah pengembangan
yang sesuai dengan kebutuhannya.

DATA BISNIS PENGGUNA:
{$businessContextJson}

TUGASMU:
1. Membantu pengguna memahami hasil Business Assessment.
2. Menjelaskan tingkat kesiapan bisnis berdasarkan hasil assessment.
3. Mengidentifikasi kekuatan dan kelemahan bisnis.
4. Memberikan saran pengembangan ide dan produk.
5. Membantu menentukan target pasar.
6. Menyusun strategi pemasaran yang sesuai.
7. Memberikan rekomendasi pengembangan model bisnis.
8. Membantu menyusun langkah pengembangan bisnis secara bertahap.

ATURAN PENTING:
- Gunakan data bisnis pengguna sebagai konteks utama jawaban.
- Sesuaikan rekomendasi dengan tahap dan kategori bisnis pengguna.
- Jika pengguna bertanya tentang hasil assessment, gunakan data
  assessment terbaru yang tersedia.
- Jelaskan skor dan persentase sesuai data yang diberikan.
- Jangan mengubah, menebak, atau mengarang hasil assessment.
- Jangan menganggap data yang tidak tersedia sebagai fakta.
- Jika profil bisnis belum tersedia, tanyakan informasi yang diperlukan.
- Jika assessment belum tersedia, jelaskan bahwa pengguna belum
  memiliki hasil assessment yang dapat dijadikan acuan.
- Berikan rekomendasi yang praktis, realistis, dan sesuai kemampuan
  mahasiswa.
- Jelaskan alasan di balik setiap rekomendasi.
- Gunakan bahasa Indonesia yang ramah, jelas, dan mudah dipahami.
- Gunakan poin-poin atau tahapan jika membantu memperjelas jawaban.
- Hindari jawaban terlalu panjang untuk pertanyaan sederhana.

GAYA KOMUNIKASI:
Bersikaplah seperti konsultan bisnis yang ramah, suportif,
profesional, dan membantu mahasiswa belajar mengembangkan bisnisnya.
PROMPT;

        // Menyusun pesan untuk Hermes
        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt
            ]
        ];

        // Memasukkan riwayat percakapan
        foreach ($validated['history'] ?? [] as $item) {
            $messages[] = [
                'role' => $item['role'],
                'content' => $item['content']
            ];
        }

        // Memasukkan pesan terbaru
        $messages[] = [
            'role' => 'user',
            'content' => $validated['message']
        ];

        try {
            Log::info('STARTIVA AI: Menghubungi Hermes Gateway', [
                'url' => $apiUrl,
                'model' => 'hermes-agent',
                'has_business_profile' => $businessProfile !== null,
                'has_assessment' => $latestAssessment !== null,
            ]);

            $response = Http::acceptJson()
                ->withToken($apiKey)
                ->timeout(120)
                ->post(
                    rtrim($apiUrl, '/') . '/v1/chat/completions',
                    [
                        'model' => 'hermes-agent',
                        'messages' => $messages,
                        'stream' => false
                    ]
                );

            $result = $response->json();

            // Menangani HTTP error dari Hermes
            if (!$response->successful()) {
                Log::error('STARTIVA AI: Hermes HTTP Error', [
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Hermes gagal memproses pesan.',
                    'detail' => 'HTTP ' . $response->status()
                ], 502);
            }

            // Mengambil jawaban dari Hermes
            $answer = data_get(
                $result,
                'choices.0.message.content'
            );

            // Menangani content berbentuk array
            if (is_array($answer)) {
                $answer = collect($answer)
                    ->map(function ($item) {
                        return is_array($item)
                            ? ($item['text'] ?? '')
                            : '';
                    })
                    ->filter()
                    ->implode("\n");
            }

            // Memastikan respons tidak kosong
            if (!is_string($answer) || trim($answer) === '') {
                Log::error('STARTIVA AI: Respons Hermes kosong', [
                    'response' => $result ?? $response->body()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Hermes memberikan respons kosong.',
                    'detail' => 'Periksa konfigurasi provider AI Hermes.'
                ], 502);
            }

            Log::info('STARTIVA AI: Respons berhasil diterima.');

            return response()->json([
                'success' => true,
                'reply' => trim($answer)
            ]);

        } catch (\Throwable $e) {
            Log::error('STARTIVA AI: Koneksi Hermes gagal', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat terhubung ke Hermes Gateway.'
            ], 500);
        }
    }
}