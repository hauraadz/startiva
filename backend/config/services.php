
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Groq AI
    |--------------------------------------------------------------------------
    */

    'groq' => [
        'api_key' => env('GROQ_API_KEY'),
        'base_url' => env(
            'GROQ_BASE_URL',
            'https://api.groq.com/openai/v1'
        ),
        'model' => env(
            'GROQ_MODEL',
            'llama-3.3-70b-versatile'
        ),
        'timeout' => env('GROQ_TIMEOUT', 120),
    ],

    /*
    |--------------------------------------------------------------------------
    | Startiva
    |--------------------------------------------------------------------------
    */

    'startiva' => [
        'counselor_registration_code' => env(
            'STARTIVA_COUNSELOR_REGISTRATION_CODE'
        ),

        // Secret untuk autentikasi request dari n8n ke Laravel
        'n8n_secret' => env('N8N_API_SECRET'),

        // URL Production Webhook n8n untuk menerima assessment
        'assessment_webhook' => env('N8N_ASSESSMENT_WEBHOOK'),
    ],

];
