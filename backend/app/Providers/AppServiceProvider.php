<?php

namespace App\Providers;

use App\Services\CSVProcessingService;
use App\Services\FileUploadService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(FileUploadService::class, function ($app) {
            return new FileUploadService();
        });

        $this->app->singleton(CSVProcessingService::class, function ($app) {
            return new CSVProcessingService();
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