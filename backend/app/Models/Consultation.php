<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_profile_id',
        'topic',
        'description',
        'preferred_contact',
        'contact_detail',
        'status',
        'consultation_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessProfile()
    {
        return $this->belongsTo(BusinessProfile::class);
    }
}
