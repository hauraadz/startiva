<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    /**
     * REGISTRASI MAHASISWA
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'mahasiswa',
        ]);

        $token = $user->createToken('startiva-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi mahasiswa berhasil!',
            'user' => $user->makeHidden([
                'password',
                'remember_token',
            ]),
            'token' => $token,
        ], 201);
    }


    /**
     * REGISTRASI KONSELOR
     *
     * Registrasi menggunakan kode khusus
     * yang disimpan di file .env.
     */
    public function registerCounselor(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'registration_code' => 'required|string',
        ]);

        // Mengambil kode registrasi dari konfigurasi.
        $registrationCode = config(
            'services.startiva.counselor_registration_code'
        );

        // Memastikan kode registrasi sesuai.
        if (
            empty($registrationCode) ||
            !hash_equals(
                (string) $registrationCode,
                (string) $validated['registration_code']
            )
        ) {
            throw ValidationException::withMessages([
                'registration_code' => [
                    'Kode registrasi konselor tidak valid.',
                ],
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'konselor',
        ]);

        $token = $user->createToken('startiva-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registrasi konselor berhasil!',
            'user' => $user->makeHidden([
                'password',
                'remember_token',
            ]),
            'token' => $token,
        ], 201);
    }


    /**
     * LOGIN MAHASISWA DAN KONSELOR
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where(
            'email',
            $validated['email']
        )->first();

        if (
            !$user ||
            !Hash::check(
                $validated['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'Email atau password salah.',
                ],
            ]);
        }

        $token = $user->createToken('startiva-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'user' => $user->makeHidden([
                'password',
                'remember_token',
            ]),
            'token' => $token,
        ], 200);
    }


    /**
     * MENGAMBIL PROFIL PENGGUNA
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'konselor') {
            $user->load('counselorProfile');
        }

        return response()->json([
            'success' => true,
            'message' => 'Profil pengguna berhasil diambil.',
            'user' => $user->makeHidden([
                'password',
                'remember_token',
            ]),
        ], 200);
    }


    /**
     * LOGOUT PENGGUNA
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        $token = $user->currentAccessToken();

        if ($token instanceof PersonalAccessToken) {
            $token->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil!',
        ], 200);
    }
}
