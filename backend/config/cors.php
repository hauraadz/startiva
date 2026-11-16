
<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'register',
        'login',
        'logout',
        'test',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://sparkling-energy-production-6a0e15ff.up.railway.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
