<?php

namespace App\Services\Predictions;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class GoalPredictionService extends PredictionService
{
    // Default goals if not set by user
    protected $defaultGoals = [
        'steps' => 10000,
        'active_minutes' => 30,
        'distance_km' => 5
    ];

    /**
     * Generate goal achievement predictions
     * 
     * @param User $user
     * @return array
     */
    public function generateGoalPredictions(User $user): array
    {
        $activities = $this->getUserActivities($user, 14); // Use last 14 days
        
        if ($activities->isEmpty()) {
            return [];
        }

        $averages = $this->calculateAverages($activities);
        
        // Get the last 7 days trend
        $lastWeekActivities = $activities->sortByDesc('date')->take(7);
        $lastWeekAverages = $this->calculateAverages($lastWeekActivities);
        
        // Calculate likelihood of meeting goals
        $predictions = [
            'steps' => $this->predictGoalAchievement('steps', $averages['steps'], $lastWeekAverages['steps']),
            'distance_km' => $this->predictGoalAchievement('distance_km', $averages['distance_km'], $lastWeekAverages['distance_km']),
            'active_minutes' => $this->predictGoalAchievement('active_minutes', $averages['active_minutes'], $lastWeekAverages['active_minutes'])
        ];
        
        // Store the predictions
        $description = $this->generateGoalPredictionDescription($predictions);
        $prediction = $this->storePrediction(
            $user,
            'goal_achievement',
            $description,
            [
                'predictions' => $predictions,
                'averages' => $averages,
                'recent_averages' => $lastWeekAverages
            ]
        );
        
        return [
            'id' => $prediction->id,
            'date' => $prediction->prediction_date,
            'description' => $description,
            'predictions' => $predictions
        ];
    }
    
    /**
     * Predict the likelihood of achieving a goal
     *
     * @param string $metric
     * @param float $average
     * @param float $recentAverage
     * @return array
     */
    protected function predictGoalAchievement(string $metric, float $average, float $recentAverage): array
    {
        $goal = $this->defaultGoals[$metric];
        
        // Simple algorithm: if recent average is higher than goal, likely to achieve
        // If recent trend is improving, add bonus to likelihood
        $basePercentage = min(100, ($recentAverage / $goal) * 100);
        
        // Check if trend is improving
        $trendImproving = $recentAverage > $average;
        $trendFactor = $trendImproving ? 10 : 0;
        
        // Calculate final likelihood (capped at 100%)
        $likelihood = min(100, $basePercentage + $trendFactor);
        
        return [
            'goal' => $goal,
            'current_average' => $recentAverage,
            'likelihood' => $likelihood,
            'trend' => $trendImproving ? 'improving' : 'stable_or_declining'
        ];
    }
    
    /**
     * Generate a human-readable description of the goal predictions
     *
     * @param array $predictions
     * @return string
     */
    protected function generateGoalPredictionDescription(array $predictions): string
    {
        $descriptions = [];
        
        foreach ($predictions as $metric => $prediction) {
            $likelihood = $prediction['likelihood'];
            $readableMetric = str_replace('_', ' ', $metric);
            
            if ($likelihood >= 80) {
                $descriptions[] = "You're very likely to meet your {$readableMetric} goal.";
            } elseif ($likelihood >= 50) {
                $descriptions[] = "You have a good chance of meeting your {$readableMetric} goal.";
            } else {
                $descriptions[] = "You may have difficulty meeting your {$readableMetric} goal.";
            }
        }
        
        return implode(' ', $descriptions);
    }
}