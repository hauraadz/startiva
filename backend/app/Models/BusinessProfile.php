<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_stage',
        'business_category',
        'business_idea',
        'product_description',
        'target_market',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}