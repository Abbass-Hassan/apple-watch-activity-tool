<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CSVProcessingService
{
    /**
     * Process CSV file and save data to database
     *
     * @param string $filePath
     * @param User $user
     * @return array
     */
    public function processCSV(string $filePath, User $user)
    {
        $results = [
            'processed' => 0,
            'skipped' => 0,
            'errors' => []
        ];

        // Open the file
        $handle = fopen($filePath, 'r');
        if (!$handle) {
            $results['errors'][] = 'Could not open file';
            return $results;
        }

        // Read the header row
        $header = fgetcsv($handle);
        if (!$header) {
            $results['errors'][] = 'CSV file is empty or has invalid format';
            fclose($handle);
            return $results;
        }

        // Validate header structure
        $expectedHeaders = ['user_id', 'date', 'steps', 'distance_km', 'active_minutes'];
        $missingHeaders = array_diff($expectedHeaders, array_map('strtolower', $header));
        
        if (count($missingHeaders) > 0) {
            $results['errors'][] = 'Missing required columns: ' . implode(', ', $missingHeaders);
            fclose($handle);
            return $results;
        }

        // Map column names to header indices
        $headerMap = [];
        foreach ($header as $index => $columnName) {
            $headerMap[strtolower($columnName)] = $index;
        }

        // Process each row
        $rowNumber = 1; // Starting with 1 for the header row
        while (($row = fgetcsv($handle)) !== false) {
            $rowNumber++;

            // Skip empty rows
            if (count(array_filter($row)) === 0) {
                $results['skipped']++;
                continue;
            }

            // Build data array
            $data = [
                'user_id' => $user->id, // Override user_id with authenticated user
                'date' => $row[$headerMap['date']],
                'steps' => $row[$headerMap['steps']],
                'distance_km' => $row[$headerMap['distance_km']],
                'active_minutes' => $row[$headerMap['active_minutes']]
            ];

            // Validate data
            $validator = Validator::make($data, [
                'user_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'steps' => 'required|integer|min:0',
                'distance_km' => 'required|numeric|min:0',
                'active_minutes' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                $results['errors'][] = "Row {$rowNumber}: " . implode(', ', $validator->errors()->all());
                $results['skipped']++;
                continue;
            }

            try {
                // Check if data for this date already exists
                $existingActivity = Activity::where('user_id', $user->id)
                    ->where('date', Carbon::parse($data['date'])->format('Y-m-d'))
                    ->first();

                if ($existingActivity) {
                    // Update existing record
                    $existingActivity->update($data);
                } else {
                    // Create new record
                    Activity::create($data);
                }
                
                $results['processed']++;
            } catch (\Exception $e) {
                Log::error('Error processing CSV row: ' . $e->getMessage());
                $results['errors'][] = "Row {$rowNumber}: Processing error - " . $e->getMessage();
                $results['skipped']++;
            }
        }

        fclose($handle);
        return $results;
    }
}