<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Store the uploaded file
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return string|false File path or false on failure
     */
    public function storeFile(UploadedFile $file, string $directory = 'activity_data')
    {
        // Generate a unique name
        $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        // Store the file
        $path = $file->storeAs($directory, $fileName, 'public');
        
        return $path ?: false;
    }

    /**
     * Get the full path to the file
     *
     * @param string $path
     * @return string
     */
    public function getFilePath(string $path)
    {
        return Storage::disk('public')->path($path);
    }

    /**
     * Check if file is CSV
     *
     * @param UploadedFile $file
     * @return bool
     */
    public function isCSV(UploadedFile $file)
    {
        return $file->getClientOriginalExtension() === 'csv' || 
               $file->getMimeType() === 'text/csv' ||
               $file->getMimeType() === 'application/csv' ||
               $file->getMimeType() === 'application/vnd.ms-excel';
    }
}