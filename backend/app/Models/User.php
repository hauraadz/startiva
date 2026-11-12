<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Consultation;
use App\Models\CounselorProfile;
use App\Models\BusinessAssessment;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Atribut yang dapat diisi secara mass assignment.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * Atribut yang disembunyikan dari response.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Tipe data atribut.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Relasi assessment yang dikerjakan mahasiswa.
     */
    public function businessAssessments()
    {
        return $this->hasMany(
            BusinessAssessment::class,
            'user_id'
        );
    }

    /**
     * Relasi konsultasi yang diajukan mahasiswa.
     */
    public function consultations()
    {
        return $this->hasMany(
            Consultation::class,
            'user_id'
        );
    }

    /**
     * Relasi konsultasi yang ditangani konselor.
     */
    public function handledConsultations()
    {
        return $this->hasMany(
            Consultation::class,
            'counselor_id'
        );
    }

    /**
     * Relasi profil konselor.
     */
    public function counselorProfile()
    {
        return $this->hasOne(
            CounselorProfile::class,
            'user_id'
        );
    }

    /**
     * Memeriksa apakah pengguna adalah mahasiswa.
     */
    public function isMahasiswa()
    {
        return $this->role === 'mahasiswa';
    }

    /**
     * Memeriksa apakah pengguna adalah konselor.
     */
    public function isKonselor()
    {
        return $this->role === 'konselor';
    }
}
