<?php

namespace App\Services\Predictions;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AnomalyDetectionService extends PredictionService
{
    // Threshold for detecting anomalies (in standard deviations)
    protected $anomalyThreshold = 2.0;
    
    /**
     * Detect anomalies in activity data
     * 
     * @param User $user
     * @return array
     */
    public function detectAnomalies(User $user): array
    {
        $activities = $this->getUserActivities($user, 30);
        
        if ($activities->count() < 7) {
            return []; // Not enough data
        }
        
        $averages = $this->calculateAverages($activities);
        $stdDeviations = $this->calculateStdDeviations($activities, $averages);
        
        $anomalies = [];
        $anomalyDetails = [];
        
        // Check last 7 days for anomalies
        $recentActivities = $activities->sortByDesc('date')->take(7);
        
        foreach ($recentActivities as $activity) {
            $activityAnomalies = [];
            
            // Check each metric for anomalies
            foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
                $zScore = $this->calculateZScore($activity[$metric], $averages[$metric], $stdDeviations[$metric]);
                
                if (abs($zScore) >= $this->anomalyThreshold) {
                    $direction = $zScore > 0 ? 'higher' : 'lower';
                    $activityAnomalies[$metric] = [
                        'value' => $activity[$metric],
                        'average' => $averages[$metric],
                        'z_score' => $zScore,
                        'direction' => $direction
                    ];
                }
            }
            
            if (!empty($activityAnomalies)) {
                $anomalies[] = $activity->date;
                $anomalyDetails[$activity->date] = $activityAnomalies;
            }
        }
        
        if (empty($anomalies)) {
            $description = "No unusual activity patterns detected in the past week.";
        } else {
            $description = $this->generateAnomalyDescription($anomalyDetails);
        }
        
        // Store the prediction
        $prediction = $this->storePrediction(
            $user,
            'anomaly',
            $description,
            [
                'anomalies' => $anomalyDetails,
                'averages' => $averages,
                'std_deviations' => $stdDeviations
            ]
        );
        
        return [
            'id' => $prediction->id,
            'date' => $prediction->prediction_date,
            'description' => $description,
            'anomalies' => $anomalyDetails
        ];
    }
    
    /**
     * Calculate Z-score
     *
     * @param float $value
     * @param float $average
     * @param float $stdDeviation
     * @return float
     */
    protected function calculateZScore(float $value, float $average, float $stdDeviation): float
    {
        if ($stdDeviation == 0) {
            return 0;
        }
        
        return ($value - $average) / $stdDeviation;
    }
    
    /**
     * Generate a human-readable description of the anomalies
     *
     * @param array $anomalyDetails
     * @return string
     */
    protected function generateAnomalyDescription(array $anomalyDetails): string
    {
        $count = count($anomalyDetails);
        
        if ($count == 0) {
            return "No unusual activity patterns detected.";
        }
        
        if ($count == 1) {
            $date = array_key_first($anomalyDetails);
            $formattedDate = Carbon::parse($date)->format('F j');
            return "Unusual activity detected on {$formattedDate}.";
        }
        
        return "Unusual activity patterns detected on {$count} days in the past week.";
    }
}