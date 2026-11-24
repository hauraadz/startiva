<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GroqService
{
    /**
     * Mengirim pesan ke Groq AI.
     */
    public function chat(array $messages): string
    {
        $apiKey = config('services.groq.api_key');
        $baseUrl = config('services.groq.base_url');
        $model = config('services.groq.model');

        // Memeriksa API Key
        if (empty($apiKey)) {
            throw new RuntimeException(
                'Groq API Key belum dikonfigurasi.'
            );
        }

        // Memeriksa pesan
        if (empty($messages)) {
            throw new RuntimeException(
                'Pesan tidak boleh kosong.'
            );
        }

        // Mengirim permintaan ke Groq API
        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->timeout((int) config('services.groq.timeout', 120))
            ->post(
                rtrim($baseUrl, '/') . '/chat/completions',
                [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.7,
                    'max_completion_tokens' => 1024,
                ]
            );

        // Memeriksa respons API
        if ($response->failed()) {
            throw new RuntimeException(
                'Groq API gagal: ' . $response->body()
            );
        }

        $result = $response->json();

        // Mengambil jawaban AI
        $answer = data_get(
            $result,
            'choices.0.message.content'
        );

        if (!is_string($answer) || trim($answer) === '') {
            throw new RuntimeException(
                'Groq tidak memberikan jawaban yang valid.'
            );
        }

        return trim($answer);
    }
}
