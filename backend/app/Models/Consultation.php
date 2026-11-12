<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'counselor_id',
        'topic',
        'description',
        'preferred_contact',
        'contact_detail',
        'status',
        'consultation_notes',
    ];

    /**
     * Relasi konsultasi dengan mahasiswa.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi konsultasi dengan konselor.
     */
    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }
}
