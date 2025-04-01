<?php

namespace App\Services\Predictions;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class InsightGenerationService extends PredictionService
{
    /**
     * Generate actionable insights
     * 
     * @param User $user
     * @return array
     */
    public function generateInsights(User $user): array
    {
        $activities = $this->getUserActivities($user, 30);
        
        if ($activities->count() < 7) {
            return []; // Not enough data
        }
        
        $insights = [];
        
        // Generate insights based on patterns
        $insights = array_merge(
            $insights,
            $this->analyzeWeekdayPatterns($activities),
            $this->analyzeConsistency($activities),
            $this->analyzeProgressTrends($activities)
        );
        
        // Select top 3 most relevant insights
        $selectedInsights = array_slice($insights, 0, 3);
        
        $description = $this->generateInsightDescription($selectedInsights);
        
        // Store the prediction
        $prediction = $this->storePrediction(
            $user,
            'insight',
            $description,
            [
                'insights' => $selectedInsights
            ]
        );
        
        return [
            'id' => $prediction->id,
            'date' => $prediction->prediction_date,
            'description' => $description,
            'insights' => $selectedInsights
        ];
    }
    
    /**
     * Analyze weekday vs weekend patterns
     *
     * @param Collection $activities
     * @return array
     */
    protected function analyzeWeekdayPatterns(Collection $activities): array
    {
        $weekdayActivities = $activities->filter(function ($activity) {
            $dayOfWeek = Carbon::parse($activity->date)->dayOfWeek;
            return $dayOfWeek >= 1 && $dayOfWeek <= 5; // Monday to Friday
        });
        
        $weekendActivities = $activities->filter(function ($activity) {
            $dayOfWeek = Carbon::parse($activity->date)->dayOfWeek;
            return $dayOfWeek === 0 || $dayOfWeek === 6; // Sunday or Saturday
        });
        
        $weekdayAverages = $this->calculateAverages($weekdayActivities);
        $weekendAverages = $this->calculateAverages($weekendActivities);
        
        $insights = [];
        
        // Compare weekday to weekend activity
        foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
            $weekdayAvg = $weekdayAverages[$metric];
            $weekendAvg = $weekendAverages[$metric];
            $readableMetric = str_replace('_', ' ', $metric);
            
            if ($weekendAvg < $weekdayAvg * 0.7) {
                $insights[] = [
                    'type' => 'weekday_pattern',
                    'message' => "Your {$readableMetric} are significantly lower on weekends. Consider planning active weekend activities to maintain consistency.",
                    'data' => [
                        'weekday_average' => $weekdayAvg,
                        'weekend_average' => $weekendAvg
                    ]
                ];
            } elseif ($weekendAvg > $weekdayAvg * 1.3) {
                $insights[] = [
                    'type' => 'weekday_pattern',
                    'message' => "You're much more active on weekends than weekdays. Try to incorporate more activity into your work days.",
                    'data' => [
                        'weekday_average' => $weekdayAvg,
                        'weekend_average' => $weekendAvg
                    ]
                ];
            }
        }
        
        return $insights;
    }
    
    /**
     * Analyze activity consistency
     *
     * @param Collection $activities
     * @return array
     */
    protected function analyzeConsistency(Collection $activities): array
    {
        $insights = [];
        $averages = $this->calculateAverages($activities);
        $stdDeviations = $this->calculateStdDeviations($activities, $averages);
        
        // Check for high variability
        foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
            $average = $averages[$metric];
            $stdDev = $stdDeviations[$metric];
            $readableMetric = str_replace('_', ' ', $metric);
            
            // Calculate coefficient of variation (CV)
            $cv = $average > 0 ? ($stdDev / $average) : 0;
            
            if ($cv > 0.5) {
                $insights[] = [
                    'type' => 'consistency',
                    'message' => "Your {$readableMetric} vary significantly from day to day. Aim for more consistent activity levels throughout the week.",
                    'data' => [
                        'average' => $average,
                        'std_deviation' => $stdDev,
                        'variation_coefficient' => $cv
                    ]
                ];
            } elseif ($cv < 0.2 && $average < $this->getDefaultGoal($metric) * 0.7) {
                $insights[] = [
                    'type' => 'consistency',
                    'message' => "You're consistently below target for {$readableMetric}. Try gradually increasing your daily activity.",
                    'data' => [
                        'average' => $average,
                        'recommended' => $this->getDefaultGoal($metric),
                        'variation_coefficient' => $cv
                    ]
                ];
            } elseif ($cv < 0.2 && $average >= $this->getDefaultGoal($metric)) {
                $insights[] = [
                    'type' => 'consistency',
                    'message' => "Great job maintaining consistent {$readableMetric}! You're consistently meeting or exceeding goals.",
                    'data' => [
                        'average' => $average,
                        'recommended' => $this->getDefaultGoal($metric),
                        'variation_coefficient' => $cv
                    ]
                ];
            }
        }
        
        return $insights;
    }
    
    /**
     * Analyze progress trends
     *
     * @param Collection $activities
     * @return array
     */
    protected function analyzeProgressTrends(Collection $activities): array
    {
        $insights = [];
        
        // Compare recent activity (last 7 days) to previous period (8-14 days ago)
        $sortedActivities = $activities->sortByDesc('date');
        $recentActivities = $sortedActivities->take(7);
        $previousActivities = $sortedActivities->slice(7, 7);
        
        $recentAverages = $this->calculateAverages($recentActivities);
        $previousAverages = $this->calculateAverages($previousActivities);
        
        foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
            $recentAvg = $recentAverages[$metric];
            $previousAvg = $previousAverages[$metric];
            $readableMetric = str_replace('_', ' ', $metric);
            
            if ($previousAvg > 0) {
                $changePercent = (($recentAvg - $previousAvg) / $previousAvg) * 100;
                
                if ($changePercent >= 20) {
                    $insights[] = [
                        'type' => 'progress',
                        'message' => "Great improvement! Your {$readableMetric} have increased by " . round($changePercent) . "% compared to the previous week.",
                        'data' => [
                            'recent_average' => $recentAvg,
                            'previous_average' => $previousAvg,
                            'change_percent' => $changePercent
                        ]
                    ];
                } elseif ($changePercent <= -20) {
                    $insights[] = [
                        'type' => 'progress',
                        'message' => "Your {$readableMetric} have decreased by " . round(abs($changePercent)) . "% compared to the previous week. Try to get back on track!",
                        'data' => [
                            'recent_average' => $recentAvg,
                            'previous_average' => $previousAvg,
                            'change_percent' => $changePercent
                        ]
                    ];
                }
            }
        }
        
        return $insights;
    }
    
    /**
     * Get default goal for a metric
     *
     * @param string $metric
     * @return int|float
     */
    protected function getDefaultGoal(string $metric)
    {
        $goals = [
            'steps' => 10000,
            'distance_km' => 5,
            'active_minutes' => 30
        ];
        
        return $goals[$metric] ?? 0;
    }
    
    /**
     * Generate a human-readable description of the insights
     *
     * @param array $insights
     * @return string
     */
    protected function generateInsightDescription(array $insights): string
    {
        if (empty($insights)) {
            return "Not enough data yet to generate personalized insights.";
        }
        
        $messages = array_column($insights, 'message');
        return implode(' ', $messages);
    }
}