
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Startiva API',
        'status' => 'active',
        'message' => 'API Startiva berhasil dijalankan.',
    ]);
});
