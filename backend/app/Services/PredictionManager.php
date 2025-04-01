<?php

namespace App\Services;

use App\Models\User;
use App\Services\Predictions\AnomalyDetectionService;
use App\Services\Predictions\GoalPredictionService;
use App\Services\Predictions\InsightGenerationService;
use App\Services\Predictions\TrendForecastService;

class PredictionManager
{
    protected $goalPredictionService;
    protected $anomalyDetectionService;
    protected $trendForecastService;
    protected $insightGenerationService;
    
    /**
     * Create a new PredictionManager instance
     *
     * @param GoalPredictionService $goalPredictionService
     * @param AnomalyDetectionService $anomalyDetectionService
     * @param TrendForecastService $trendForecastService
     * @param InsightGenerationService $insightGenerationService
     */
    public function __construct(
        GoalPredictionService $goalPredictionService,
        AnomalyDetectionService $anomalyDetectionService,
        TrendForecastService $trendForecastService,
        InsightGenerationService $insightGenerationService
    ) {
        $this->goalPredictionService = $goalPredictionService;
        $this->anomalyDetectionService = $anomalyDetectionService;
        $this->trendForecastService = $trendForecastService;
        $this->insightGenerationService = $insightGenerationService;
    }
    
    /**
     * Generate all predictions for a user
     *
     * @param User $user
     * @return array
     */
    public function generateAllPredictions(User $user): array
    {
        return [
            'goal_predictions' => $this->goalPredictionService->generateGoalPredictions($user),
            'anomalies' => $this->anomalyDetectionService->detectAnomalies($user),
            'trends' => $this->trendForecastService->forecastTrends($user),
            'insights' => $this->insightGenerationService->generateInsights($user)
        ];
    }
    
    /**
     * Generate goal predictions for a user
     *
     * @param User $user
     * @return array
     */
    public function generateGoalPredictions(User $user): array
    {
        return $this->goalPredictionService->generateGoalPredictions($user);
    }
    
    /**
     * Detect anomalies for a user
     *
     * @param User $user
     * @return array
     */
    public function detectAnomalies(User $user): array
    {
        return $this->anomalyDetectionService->detectAnomalies($user);
    }
    
    /**
     * Forecast trends for a user
     *
     * @param User $user
     * @return array
     */
    public function forecastTrends(User $user): array
    {
        return $this->trendForecastService->forecastTrends($user);
    }
    
    /**
     * Generate insights for a user
     *
     * @param User $user
     * @return array
     */
    public function generateInsights(User $user): array
    {
        return $this->insightGenerationService->generateInsights($user);
    }
}