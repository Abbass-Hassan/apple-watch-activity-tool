<?php

namespace App\Services\Predictions;

use App\Models\Activity;
use App\Models\Prediction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class PredictionService
{
    /**
     * Generate all predictions for a user
     *
     * @param User $user
     * @return array
     */
    public function generateAllPredictions(User $user): array
    {
        $results = [
            'goal_predictions' => $this->generateGoalPredictions($user),
            'anomalies' => $this->detectAnomalies($user),
            'trends' => $this->forecastTrends($user),
            'insights' => $this->generateInsights($user)
        ];

        return $results;
    }

    /**
     * Get user's activities for analysis
     *
     * @param User $user
     * @param int $days Number of days of data to retrieve
     * @return Collection
     */
    protected function getUserActivities(User $user, int $days = 30): Collection
    {
        $startDate = Carbon::now()->subDays($days);
        
        return Activity::where('user_id', $user->id)
            ->where('date', '>=', $startDate)
            ->orderBy('date')
            ->get();
    }

    /**
     * Store a prediction in the database
     *
     * @param User $user
     * @param string $type
     * @param string $description
     * @param array $data
     * @param Carbon|string|null $date
     * @return Prediction
     */
    protected function storePrediction(
        User $user, 
        string $type, 
        string $description, 
        array $data = [], 
        $date = null
    ): Prediction {
        // Use today's date if none provided
        if (!$date) {
            $date = Carbon::today();
        } elseif (is_string($date)) {
            $date = Carbon::parse($date);
        }

        // Check if a prediction of this type already exists for this date
        $prediction = Prediction::where('user_id', $user->id)
            ->where('prediction_date', $date->format('Y-m-d'))
            ->where('prediction_type', $type)
            ->first();

        if ($prediction) {
            // Update existing prediction
            $prediction->update([
                'description' => $description,
                'prediction_data' => $data
            ]);
        } else {
            // Create new prediction
            $prediction = Prediction::create([
                'user_id' => $user->id,
                'prediction_date' => $date->format('Y-m-d'),
                'prediction_type' => $type,
                'description' => $description,
                'prediction_data' => $data
            ]);
        }

        return $prediction;
    }

    /**
     * Calculate average values for each metric
     *
     * @param Collection $activities
     * @return array
     */
    protected function calculateAverages(Collection $activities): array
    {
        if ($activities->isEmpty()) {
            return [
                'steps' => 0,
                'distance_km' => 0,
                'active_minutes' => 0
            ];
        }

        return [
            'steps' => $activities->avg('steps'),
            'distance_km' => $activities->avg('distance_km'),
            'active_minutes' => $activities->avg('active_minutes')
        ];
    }

    /**
     * Calculate standard deviations for each metric
     *
     * @param Collection $activities
     * @param array $averages
     * @return array
     */
    protected function calculateStdDeviations(Collection $activities, array $averages): array
    {
        if ($activities->isEmpty() || $activities->count() < 2) {
            return [
                'steps' => 0,
                'distance_km' => 0,
                'active_minutes' => 0
            ];
        }

        $count = $activities->count();
        $squaredDiffs = [
            'steps' => 0,
            'distance_km' => 0,
            'active_minutes' => 0
        ];

        foreach ($activities as $activity) {
            $squaredDiffs['steps'] += pow($activity->steps - $averages['steps'], 2);
            $squaredDiffs['distance_km'] += pow($activity->distance_km - $averages['distance_km'], 2);
            $squaredDiffs['active_minutes'] += pow($activity->active_minutes - $averages['active_minutes'], 2);
        }

        return [
            'steps' => sqrt($squaredDiffs['steps'] / $count),
            'distance_km' => sqrt($squaredDiffs['distance_km'] / $count),
            'active_minutes' => sqrt($squaredDiffs['active_minutes'] / $count)
        ];
    }

    /**
     * Generate goal achievement predictions
     * 
     * @param User $user
     * @return array
     */
    public function generateGoalPredictions(User $user): array
    {
        // Implementation will be in specialized service
        return [];
    }

    /**
     * Detect anomalies in activity data
     * 
     * @param User $user
     * @return array
     */
    public function detectAnomalies(User $user): array
    {
        // Implementation will be in specialized service
        return [];
    }

    /**
     * Forecast activity trends
     * 
     * @param User $user
     * @return array
     */
    public function forecastTrends(User $user): array
    {
        // Implementation will be in specialized service
        return [];
    }

    /**
     * Generate actionable insights
     * 
     * @param User $user
     * @return array
     */
    public function generateInsights(User $user): array
    {
        // Implementation will be in specialized service
        return [];
    }
}