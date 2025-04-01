<?php

namespace App\Providers;

use App\Services\CSVProcessingService;
use App\Services\FileUploadService;
use App\Services\PredictionManager;
use App\Services\Predictions\AnomalyDetectionService;
use App\Services\Predictions\GoalPredictionService;
use App\Services\Predictions\InsightGenerationService;
use App\Services\Predictions\PredictionService;
use App\Services\Predictions\TrendForecastService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // File services
        $this->app->singleton(FileUploadService::class, function ($app) {
            return new FileUploadService();
        });

        $this->app->singleton(CSVProcessingService::class, function ($app) {
            return new CSVProcessingService();
        });
        
        // Prediction services
        $this->app->singleton(PredictionService::class, function ($app) {
            return new PredictionService();
        });
        
        $this->app->singleton(GoalPredictionService::class, function ($app) {
            return new GoalPredictionService();
        });
        
        $this->app->singleton(AnomalyDetectionService::class, function ($app) {
            return new AnomalyDetectionService();
        });
        
        $this->app->singleton(TrendForecastService::class, function ($app) {
            return new TrendForecastService();
        });
        
        $this->app->singleton(InsightGenerationService::class, function ($app) {
            return new InsightGenerationService();
        });
        
        $this->app->singleton(PredictionManager::class, function ($app) {
            return new PredictionManager(
                $app->make(GoalPredictionService::class),
                $app->make(AnomalyDetectionService::class),
                $app->make(TrendForecastService::class),
                $app->make(InsightGenerationService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}