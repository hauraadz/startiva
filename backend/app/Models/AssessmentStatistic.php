<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssessmentStatistic extends Model
{
    use HasFactory;

    protected $table = 'assessment_statistics';

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
        'total_assessments' => 'integer',
        'total_responses' => 'integer',
        'mean' => 'float',
        'standard_deviation' => 'float',
        'frequency' => 'array',
        'average_score_percentage' => 'float',
        'calculated_at' => 'datetime',
    ];
}
