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
    | Hermes AI Gateway
    |--------------------------------------------------------------------------
    */

    'hermes' => [
        'url' => env('HERMES_API_URL'),
        'key' => env('HERMES_API_KEY'),
        'model' => env('HERMES_MODEL', 'hermes-agent'),
        'timeout' => env('HERMES_TIMEOUT', 120),
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

        'n8n_secret' => env('N8N_API_SECRET'),
    ],

];
