
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessProfileController;
use App\Http\Controllers\Api\BusinessAssessmentController;

// Test koneksi API
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Startiva berhasil terhubung!'
    ]);
});

// Authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // User
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Business Profile
    Route::get('/business-profile', [BusinessProfileController::class, 'show']);
    Route::post('/business-profile', [BusinessProfileController::class, 'save']);

    // Business Assessment
    Route::post('/business-assessment', [BusinessAssessmentController::class, 'store']);
    Route::get('/business-assessment', [BusinessAssessmentController::class, 'index']);
    Route::get('/business-assessment/latest', [BusinessAssessmentController::class, 'latest']);

});
