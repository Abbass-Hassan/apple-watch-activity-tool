<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'steps',
        'distance_km',
        'active_minutes'
    ];

    protected $casts = [
        'date' => 'date',
        'steps' => 'integer',
        'distance_km' => 'float',
        'active_minutes' => 'integer'
    ];

    /**
     * Get the user that owns the activity
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the predictions related to this activity date
     */
    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'user_id', 'user_id')
            ->where('prediction_date', $this->date);
    }
}
