<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CounselorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'student_id',
        'phone',
        'bio',
        'expertise',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
