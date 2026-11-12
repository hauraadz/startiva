
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\CounselorProfileController;
use App\Http\Controllers\Api\N8nAssessmentController;
use App\Http\Controllers\Api\AssessmentStatisticController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\BusinessAssessmentController;


// =====================================================
// TEST KONEKSI API
// =====================================================

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Startiva berhasil terhubung!',
    ]);
});


// =====================================================
// AUTHENTICATION
// =====================================================

Route::post('/register', [
    AuthController::class,
    'register',
]);

Route::post('/register/counselor', [
    AuthController::class,
    'registerCounselor',
]);

Route::post('/login', [
    AuthController::class,
    'login',
]);


// =====================================================
// PROTECTED ROUTES
// =====================================================

Route::middleware('auth:sanctum')->group(function () {

    // =================================================
    // USER PROFILE & LOGOUT
    // =================================================

    Route::get('/user', [
        AuthController::class,
        'profile',
    ]);

    Route::post('/logout', [
        AuthController::class,
        'logout',
    ]);


    // =================================================
    // MAHASISWA
    // =================================================

    Route::middleware('role:mahasiswa')
        ->prefix('mahasiswa')
        ->group(function () {

            // DASHBOARD

            Route::get('/dashboard', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'Dashboard Mahasiswa Startiva.',
                ]);
            });


            // -----------------------------------------
            // STUDENT WELL-BEING ASSESSMENT
            // -----------------------------------------

            Route::post('/assessment', [
                BusinessAssessmentController::class,
                'store',
            ]);

            Route::get('/assessment', [
                BusinessAssessmentController::class,
                'index',
            ]);

            Route::get('/assessment/latest', [
                BusinessAssessmentController::class,
                'latest',
            ]);


            // -----------------------------------------
            // STARTIVA AI - HERMES
            // -----------------------------------------

            Route::post('/ai/chat', [
                AIController::class,
                'chat',
            ]);


            // -----------------------------------------
            // KONSULTASI MAHASISWA
            // -----------------------------------------

            Route::post('/consultations', [
                ConsultationController::class,
                'store',
            ]);

            Route::get('/consultations', [
                ConsultationController::class,
                'index',
            ]);

            Route::get('/consultations/{id}', [
                ConsultationController::class,
                'show',
            ])->whereNumber('id');


            // -----------------------------------------
            // DAFTAR KONSELOR
            // -----------------------------------------

            Route::get('/counselors', [
                CounselorProfileController::class,
                'index',
            ]);

        });


    // =================================================
    // KONSELOR
    // =================================================

    Route::middleware('role:konselor')
        ->prefix('konselor')
        ->group(function () {

            // DASHBOARD

            Route::get('/dashboard', function () {
                return response()->json([
                    'success' => true,
                    'message' => 'Dashboard Konselor Startiva.',
                ]);
            });


            // -----------------------------------------
            // PROFIL KONSELOR
            // -----------------------------------------

            Route::get('/profile', [
                CounselorProfileController::class,
                'show',
            ]);

            Route::post('/profile', [
                CounselorProfileController::class,
                'store',
            ]);

            Route::put('/profile', [
                CounselorProfileController::class,
                'update',
            ]);


            // -----------------------------------------
            // PENGELOLAAN KONSULTASI
            // -----------------------------------------

            Route::get('/consultations', [
                ConsultationController::class,
                'index',
            ]);

            Route::get('/consultations/{id}', [
                ConsultationController::class,
                'show',
            ])->whereNumber('id');

            Route::put('/consultations/{id}/status', [
                ConsultationController::class,
                'updateStatus',
            ])->whereNumber('id');


            // -----------------------------------------
            // STATISTIK STUDENT WELL-BEING
            // -----------------------------------------

            Route::get('/assessment-statistics/latest', [
                AssessmentStatisticController::class,
                'latest',
            ]);

        });

});


// =====================================================
// INTEGRASI N8N
// =====================================================

Route::get('/n8n/assessment-data', [
    N8nAssessmentController::class,
    'getAssessmentData',
]);

Route::post('/n8n/assessment-statistics', [
    N8nAssessmentController::class,
    'storeStatistics',
]);
