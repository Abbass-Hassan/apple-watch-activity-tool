<?php

namespace App\Listeners;

use App\Events\CSVFileUploaded;
use App\Services\PredictionManager;
use Illuminate\Contracts\Queue\ShouldQueue;

class UpdatePredictionsOnCSVUpload implements ShouldQueue
{
    protected $predictionManager;
    
    /**
     * Create the event listener.
     *
     * @param PredictionManager $predictionManager
     */
    public function __construct(PredictionManager $predictionManager)
    {
        $this->predictionManager = $predictionManager;
    }

    /**
     * Handle the event.
     *
     * @param CSVFileUploaded $event
     * @return void
     */
    public function handle(CSVFileUploaded $event): void
    {
        // Generate all predictions for the user who uploaded the CSV
        $this->predictionManager->generateAllPredictions($event->user);
    }
}