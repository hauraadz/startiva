<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessAssessment extends Model
{
    use HasFactory;

    protected $table = 'business_assessments';

    protected $fillable = [
        'user_id',
        'answers',
        'total_score',
        'score_percentage',
        'readiness_level',
        'aspect_scores',
        'recommendations',
    ];

    protected $casts = [
        'answers' => 'array',
        'aspect_scores' => 'array',
        'recommendations' => 'array',
        'total_score' => 'float',
        'score_percentage' => 'float',
    ];

    /**
     * Relasi dengan pengguna yang mengisi assessment.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
