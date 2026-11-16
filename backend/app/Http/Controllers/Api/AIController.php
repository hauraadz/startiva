<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BusinessAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    /**
     * STARTIVA AI CHAT
     *
     * POST /api/mahasiswa/ai/chat
     *
     * AI menggunakan Hermes Gateway.
     * Hanya dapat digunakan oleh mahasiswa.
     */
    public function chat(Request $request)
    {
        Log::info('STARTIVA AI: Request masuk.');

        // =============================================
        // 1. VALIDASI REQUEST
        // =============================================

        $validated = $request->validate([
            'message' => 'required|string|max:3000',
            'history' => 'nullable|array|max:20',
            'history.*.role' => 'required|in:user,assistant',
            'history.*.content' => 'required|string|max:3000',
        ]);

        // =============================================
        // 2. VALIDASI PENGGUNA
        // =============================================

        $user = $request->user();

        if (!$user || $user->role !== 'mahasiswa') {
            return response()->json([
                'success' => false,
                'message' => 'Fitur Startiva AI hanya tersedia untuk mahasiswa.',
            ], 403);
        }

        // =============================================
        // 3. KONFIGURASI HERMES GATEWAY
        // =============================================

        $apiUrl = trim((string) config('services.hermes.url'));
        $apiKey = trim((string) config('services.hermes.key'));

        $model = config(
            'services.hermes.model',
            'hermes-agent'
        );

        $timeout = (int) config(
            'services.hermes.timeout',
            120
        );

        if (empty($apiUrl) || empty($apiKey)) {
            Log::error('STARTIVA AI: Konfigurasi Hermes tidak tersedia.', [
                'has_url' => !empty($apiUrl),
                'has_key' => !empty($apiKey),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Konfigurasi Hermes belum tersedia.',
            ], 500);
        }

        if (!filter_var($apiUrl, FILTER_VALIDATE_URL)) {
            Log::error('STARTIVA AI: Format URL Hermes tidak valid.');

            return response()->json([
                'success' => false,
                'message' => 'URL Hermes Gateway tidak valid.',
            ], 500);
        }

        if (empty($model)) {
            return response()->json([
                'success' => false,
                'message' => 'Model Hermes belum dikonfigurasi.',
            ], 500);
        }

        $endpoint = rtrim($apiUrl, '/') . '/v1/chat/completions';

        // =============================================
        // 4. MENGAMBIL ASSESSMENT TERBARU
        // =============================================

        try {
            $latestAssessment = BusinessAssessment::query()
                ->where('user_id', $user->id)
                ->whereNotNull('aspect_scores')
                ->latest()
                ->first();

        } catch (\Throwable $e) {
            Log::error('STARTIVA AI: Gagal mengambil assessment.', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Data assessment belum dapat diakses.',
            ], 500);
        }

        // =============================================
        // 5. MENYUSUN KONTEKS ASSESSMENT
        // =============================================

        $assessmentContext = null;

        if ($latestAssessment) {
            $assessmentContext = [
                'tanggal_assessment' => $latestAssessment->created_at,
                'jawaban' => $latestAssessment->answers,
                'total_skor' => $latestAssessment->total_score,
                'indikator_normalisasi' => $latestAssessment->score_percentage,
                'skor_per_aspek' => $latestAssessment->aspect_scores,
                'rekomendasi' => $latestAssessment->recommendations,
            ];
        }

        $context = [
            'nama_mahasiswa' => $user->name,
            'hasil_student_wellbeing_assessment' => $assessmentContext,
            'status_assessment' => $latestAssessment
                ? 'Sudah mengisi assessment'
                : 'Belum mengisi assessment',
        ];

        $contextJson = json_encode(
            $context,
            JSON_PRETTY_PRINT |
            JSON_UNESCAPED_UNICODE |
            JSON_UNESCAPED_SLASHES
        );

        if ($contextJson === false) {
            $contextJson = '{}';
        }

        // =============================================
        // 6. SYSTEM PROMPT STARTIVA AI
        // =============================================

        $systemPrompt = <<<PROMPT
Kamu adalah Startiva AI, teman pendamping mahasiswa
di platform Konselor Sebaya bernama Startiva.

PERAN UTAMA:

Kamu merupakan asisten AI yang membantu mahasiswa mendapatkan
dukungan awal, memahami kondisi dirinya, dan menemukan langkah
bantuan yang sesuai.

Kamu bukan psikolog, psikiater, dokter, atau pengganti konselor manusia.

DATA MAHASISWA:

{$contextJson}

TUJUAN STARTIVA AI:

1. Menjadi teman percakapan yang ramah dan suportif.
2. Membantu mahasiswa mengungkapkan perasaan dan kesulitannya.
3. Membantu mahasiswa memahami hasil Student Well-being Assessment.
4. Memberikan dukungan awal yang sesuai.
5. Membantu mahasiswa mengenali kebutuhan pendampingan.
6. Mengarahkan mahasiswa kepada konselor sebaya manusia jika diperlukan.

ATURAN MEMAHAMI ASSESSMENT:

- Gunakan hasil assessment terbaru yang tersedia.
- Assessment terdiri dari lima aspek:
  Kondisi Akademik, Kondisi Emosional, Hubungan Sosial,
  Pengelolaan Diri, dan Kebutuhan Dukungan.
- Jelaskan hasil berdasarkan data yang benar-benar diberikan.
- Jangan mengarang skor, jawaban, atau rekomendasi.
- Skor yang lebih tinggi menunjukkan tingkat persetujuan
  yang lebih tinggi terhadap pernyataan kesulitan atau kebutuhan dukungan.
- Skor bukan ukuran diagnosis atau kondisi kesehatan mental.
- Jangan menyebut indikator normalisasi sebagai persentase kesehatan mental.
- Jangan membuat kesimpulan psikologis hanya dari angka assessment.
- Jika mahasiswa belum mengisi assessment, jelaskan bahwa belum ada
  hasil yang dapat digunakan sebagai konteks.
- Jika data suatu aspek tidak tersedia, sampaikan keterbatasan tersebut.

ATURAN PENDAMPINGAN:

- Dengarkan cerita mahasiswa tanpa menghakimi.
- Gunakan bahasa Indonesia yang ramah, natural, dan mudah dipahami.
- Tunjukkan empati tanpa berpura-pura memiliki pengalaman manusia.
- Berikan respons yang relevan dengan cerita mahasiswa.
- Ajukan pertanyaan lanjutan jika diperlukan.
- Berikan saran sederhana dan realistis.
- Jangan memaksakan solusi kepada mahasiswa.
- Jangan membuat mahasiswa merasa bersalah atas kondisinya.

BATASAN AI:

- Jangan memberikan diagnosis gangguan mental.
- Jangan meresepkan obat atau memberikan instruksi pengobatan.
- Jangan mengklaim hasil assessment sebagai diagnosis.
- Jangan mengaku sebagai konselor manusia.
- Jangan menggantikan pendampingan profesional.
- Jangan menjamin kerahasiaan mutlak yang tidak dapat kamu pastikan.

PENGARAHAN KE KONSELOR MANUSIA:

- Jika mahasiswa membutuhkan pendampingan lebih lanjut,
  sarankan fitur konsultasi dengan konselor sebaya di Startiva.
- Jelaskan bahwa konselor manusia dapat memberikan pendampingan langsung.
- Jangan mengarang nama, nomor telepon, jadwal, atau ketersediaan konselor.
- Jangan mengatakan konsultasi sudah dibuat jika mahasiswa
  belum mengirim pengajuan melalui fitur konsultasi.

KONDISI DARURAT:

Jika mahasiswa menyampaikan keinginan menyakiti diri sendiri,
bunuh diri, atau membahayakan orang lain:

- Tanggapi dengan empati dan serius.
- Jangan menghakimi atau meremehkan kondisinya.
- Dorong mahasiswa segera menghubungi orang tepercaya
  yang dapat mendampinginya secara langsung.
- Sarankan mencari bantuan profesional atau layanan darurat setempat.
- Jika terdapat bahaya langsung, arahkan mahasiswa untuk segera
  pergi ke IGD atau menghubungi layanan darurat.
- Jangan hanya mengandalkan percakapan dengan AI.

GAYA KOMUNIKASI:

- Gunakan bahasa Indonesia.
- Ramah, hangat, suportif, dan tidak kaku.
- Hindari istilah medis yang tidak diperlukan.
- Jangan selalu memberikan daftar panjang.
- Sesuaikan panjang jawaban dengan kebutuhan mahasiswa.
- Jangan mengulang sapaan secara berlebihan.

IDENTITAS:

Nama kamu adalah Startiva AI.
Kamu adalah pendamping AI di Startiva yang membantu mahasiswa
mendapatkan dukungan awal dan terhubung dengan konselor manusia.
PROMPT;

        // =============================================
        // 7. MENYUSUN PESAN HERMES
        // =============================================

        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt,
            ],
        ];

        foreach ($validated['history'] ?? [] as $item) {
            $messages[] = [
                'role' => $item['role'],
                'content' => $item['content'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $validated['message'],
        ];

        // =============================================
        // 8. MENGHUBUNGI HERMES GATEWAY
        // =============================================

        try {
            Log::info('STARTIVA AI: Menghubungi Hermes Gateway.', [
                'has_assessment' => $latestAssessment !== null,
                'model' => $model,
                'endpoint' => $endpoint,
            ]);

            $response = Http::acceptJson()
                ->withToken($apiKey)
                ->timeout($timeout)
                ->post($endpoint, [
                    'model' => $model,
                    'messages' => $messages,
                    'stream' => false,
                ]);

            // =============================================
            // 9. MENANGANI HTTP ERROR
            // =============================================

            if (!$response->successful()) {
                Log::error('STARTIVA AI: Hermes HTTP Error.', [
                    'status' => $response->status(),
                    'response' => substr($response->body(), 0, 3000),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Startiva AI gagal memproses pesan.',
                    'detail' => 'HTTP ' . $response->status(),
                ], 502);
            }

            // =============================================
            // 10. MEMBACA RESPONSE HERMES
            // =============================================

            $result = $response->json();

            if (!is_array($result)) {
                Log::error('STARTIVA AI: Format respons Hermes tidak valid.');

                return response()->json([
                    'success' => false,
                    'message' => 'Format respons AI tidak valid.',
                ], 502);
            }

            $answer = data_get(
                $result,
                'choices.0.message.content'
            );

            // Mendukung content dalam bentuk array.
            if (is_array($answer)) {
                $answer = collect($answer)
                    ->map(function ($item) {
                        if (is_string($item)) {
                            return $item;
                        }

                        return is_array($item)
                            ? ($item['text'] ?? '')
                            : '';
                    })
                    ->filter()
                    ->implode("\n");
            }

            // =============================================
            // 11. VALIDASI JAWABAN AI
            // =============================================

            if (
                !is_string($answer) ||
                trim($answer) === ''
            ) {
                Log::error('STARTIVA AI: Respons Hermes kosong.', [
                    'response_keys' => array_keys($result),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Startiva AI belum dapat memberikan jawaban.',
                ], 502);
            }

            // =============================================
            // 12. RESPONSE BERHASIL
            // =============================================

            Log::info('STARTIVA AI: Respons berhasil diterima.');

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil diproses.',
                'reply' => trim($answer),
                'has_assessment' => $latestAssessment !== null,
            ], 200);

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('STARTIVA AI: Koneksi Hermes gagal.', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat terhubung ke Hermes Gateway.',
            ], 502);

        } catch (\Throwable $e) {
            Log::error('STARTIVA AI: Terjadi kesalahan.', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memproses pesan AI.',
            ], 500);
        }
    }
}
