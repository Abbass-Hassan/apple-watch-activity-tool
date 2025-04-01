<?php
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::post('/activities/upload', [ActivityController::class, 'upload']);
    Route::get('/activities/date', [ActivityController::class, 'getByDate']);

    // Prediction routes
    Route::get('/predictions', [PredictionController::class, 'generateAll']);
    Route::get('/predictions/goals', [PredictionController::class, 'getGoalPredictions']);
    Route::get('/predictions/anomalies', [PredictionController::class, 'getAnomalies']);
    Route::get('/predictions/trends', [PredictionController::class, 'getTrends']);
    Route::get('/predictions/insights', [PredictionController::class, 'getInsights']);
});