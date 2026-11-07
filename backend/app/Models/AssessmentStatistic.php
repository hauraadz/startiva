<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'total_assessments',
        'total_responses',
        'mean',
        'standard_deviation',
        'frequency',
        'average_score_percentage',
        'calculated_at',
    ];

    protected $casts = [
        'frequency' => 'array',
        'mean' => 'float',
        'standard_deviation' => 'float',
        'average_score_percentage' => 'float',
        'calculated_at' => 'datetime',
    ];
}
