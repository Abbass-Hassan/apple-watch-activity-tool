<?php

namespace App\Services\Predictions;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TrendForecastService extends PredictionService
{
    /**
     * Forecast activity trends
     * 
     * @param User $user
     * @return array
     */
    public function forecastTrends(User $user): array
    {
        $activities = $this->getUserActivities($user, 30);
        
        if ($activities->count() < 7) {
            return []; // Not enough data
        }
        
        // Group by week to analyze weekly patterns
        $weeklyData = $this->aggregateWeeklyData($activities);
        
        // Calculate linear regression for each metric
        $trends = [];
        foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
            $trends[$metric] = $this->calculateLinearTrend($weeklyData, $metric);
        }
        
        // Generate forecasts for next week
        $forecasts = $this->generateForecasts($trends, $weeklyData);
        
        $description = $this->generateTrendDescription($trends, $forecasts);
        
        // Store the prediction
        $prediction = $this->storePrediction(
            $user,
            'trend',
            $description,
            [
                'trends' => $trends,
                'forecasts' => $forecasts,
                'weekly_data' => $weeklyData
            ]
        );
        
        return [
            'id' => $prediction->id,
            'date' => $prediction->prediction_date,
            'description' => $description,
            'trends' => $trends,
            'forecasts' => $forecasts
        ];
    }
    
    /**
     * Aggregate activity data by week
     *
     * @param Collection $activities
     * @return array
     */
    protected function aggregateWeeklyData(Collection $activities): array
    {
        $weeklyData = [];
        
        foreach ($activities as $activity) {
            $weekNumber = Carbon::parse($activity->date)->weekOfYear;
            
            if (!isset($weeklyData[$weekNumber])) {
                $weeklyData[$weekNumber] = [
                    'week' => $weekNumber,
                    'steps' => 0,
                    'distance_km' => 0,
                    'active_minutes' => 0,
                    'count' => 0
                ];
            }
            
            $weeklyData[$weekNumber]['steps'] += $activity->steps;
            $weeklyData[$weekNumber]['distance_km'] += $activity->distance_km;
            $weeklyData[$weekNumber]['active_minutes'] += $activity->active_minutes;
            $weeklyData[$weekNumber]['count']++;
        }
        
        // Calculate averages
        foreach ($weeklyData as &$week) {
            $week['steps'] /= $week['count'];
            $week['distance_km'] /= $week['count'];
            $week['active_minutes'] /= $week['count'];
        }
        
        // Sort by week number
        ksort($weeklyData);
        
        return array_values($weeklyData);
    }
    
    /**
     * Calculate linear trend using simple linear regression
     *
     * @param array $data
     * @param string $metric
     * @return array
     */
    protected function calculateLinearTrend(array $data, string $metric): array
    {
        $n = count($data);
        
        if ($n <= 1) {
            return [
                'slope' => 0,
                'direction' => 'stable',
                'percentage_change' => 0
            ];
        }
        
        $sumX = 0;
        $sumY = 0;
        $sumXY = 0;
        $sumX2 = 0;
        
        foreach ($data as $i => $week) {
            $x = $i; // Use index as x value
            $y = $week[$metric];
            
            $sumX += $x;
            $sumY += $y;
            $sumXY += ($x * $y);
            $sumX2 += ($x * $x);
        }
        
        // Calculate slope (m) of regression line
        $denominator = $n * $sumX2 - $sumX * $sumX;
        if ($denominator == 0) {
            $slope = 0;
        } else {
            $slope = ($n * $sumXY - $sumX * $sumY) / $denominator;
        }
        
        // Calculate percentage change over the period
        $firstValue = $data[0][$metric];
        $lastValue = $data[$n - 1][$metric];
        
        if ($firstValue == 0) {
            $percentageChange = 0;
        } else {
            $percentageChange = (($lastValue - $firstValue) / $firstValue) * 100;
        }
        
        // Determine trend direction
        if (abs($percentageChange) < 5) {
            $direction = 'stable';
        } else {
            $direction = $percentageChange > 0 ? 'increasing' : 'decreasing';
        }
        
        return [
            'slope' => $slope,
            'direction' => $direction,
            'percentage_change' => $percentageChange
        ];
    }
    
    /**
     * Generate forecasts for next week
     *
     * @param array $trends
     * @param array $weeklyData
     * @return array
     */
    protected function generateForecasts(array $trends, array $weeklyData): array
    {
        $forecasts = [];
        $lastWeek = end($weeklyData);
        
        foreach (['steps', 'distance_km', 'active_minutes'] as $metric) {
            $lastValue = $lastWeek[$metric];
            $slope = $trends[$metric]['slope'];
            
            // Simple forecast: last value + slope
            $forecast = $lastValue + $slope;
            
            // Ensure forecast is not negative
            $forecasts[$metric] = max(0, $forecast);
        }
        
        return $forecasts;
    }
    
    /**
     * Generate a human-readable description of the trends
     *
     * @param array $trends
     * @param array $forecasts
     * @return string
     */
    protected function generateTrendDescription(array $trends, array $forecasts): string
    {
        $descriptions = [];
        
        foreach ($trends as $metric => $trend) {
            $readableMetric = str_replace('_', ' ', $metric);
            $direction = $trend['direction'];
            $forecast = round($forecasts[$metric]);
            
            if ($direction === 'increasing') {
                $descriptions[] = "Your {$readableMetric} are trending upward. Next week's forecast: approximately {$forecast}.";
            } elseif ($direction === 'decreasing') {
                $descriptions[] = "Your {$readableMetric} are trending downward. Next week's forecast: approximately {$forecast}.";
            } else {
                $descriptions[] = "Your {$readableMetric} are stable. Next week's forecast: approximately {$forecast}.";
            }
        }
        
        return implode(' ', $descriptions);
    }
}