<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'prediction_date',
        'prediction_type',
        'description',
        'prediction_data'
    ];

    protected $casts = [
        'prediction_date' => 'date',
        'prediction_data' => 'array'
    ];

    /**
     * Get the user that owns the prediction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}