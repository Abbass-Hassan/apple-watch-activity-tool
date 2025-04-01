<?php

namespace App\Http\Controllers;

use App\Services\PredictionManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PredictionController extends Controller
{
    protected $predictionManager;
    
    /**
     * Create a new controller instance
     *
     * @param PredictionManager $predictionManager
     */
    public function __construct(PredictionManager $predictionManager)
    {
        $this->predictionManager = $predictionManager;
    }
    
    /**
     * Generate all predictions for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateAll()
    {
        $user = Auth::user();
        $predictions = $this->predictionManager->generateAllPredictions($user);
        
        return response()->json([
            'message' => 'Predictions generated successfully',
            'predictions' => $predictions
        ]);
    }
    
    /**
     * Get goal predictions
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getGoalPredictions()
    {
        $user = Auth::user();
        $predictions = $this->predictionManager->generateGoalPredictions($user);
        
        return response()->json($predictions);
    }
    
    /**
     * Get anomaly detections
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAnomalies()
    {
        $user = Auth::user();
        $anomalies = $this->predictionManager->detectAnomalies($user);
        
        return response()->json($anomalies);
    }
    
    /**
     * Get trend forecasts
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTrends()
    {
        $user = Auth::user();
        $trends = $this->predictionManager->forecastTrends($user);
        
        return response()->json($trends);
    }
    
    /**
     * Get insights
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInsights()
    {
        $user = Auth::user();
        $insights = $this->predictionManager->generateInsights($user);
        
        return response()->json($insights);
    }
}