<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\CSVProcessingService;
use App\Services\FileUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ActivityController extends Controller
{
    protected $fileUploadService;
    protected $csvProcessingService;

    /**
     * Create a new controller instance
     *
     * @param FileUploadService $fileUploadService
     * @param CSVProcessingService $csvProcessingService
     */
    public function __construct(
        FileUploadService $fileUploadService,
        CSVProcessingService $csvProcessingService
    ) {
        $this->fileUploadService = $fileUploadService;
        $this->csvProcessingService = $csvProcessingService;
    }

    /**
     * Get user activities
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Activity::where('user_id', Auth::id());
        
        // Apply date filter if provided
        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }
        
        // Get paginated results
        $activities = $query->orderBy('date', 'desc')->paginate(15);
        
        return response()->json($activities);
    }

    /**
     * Upload CSV file
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');

        // Check if file is CSV
        if (!$this->fileUploadService->isCSV($file)) {
            return response()->json([
                'message' => 'Uploaded file must be a CSV file'
            ], 422);
        }

        // Store the file
        $path = $this->fileUploadService->storeFile($file);
        if (!$path) {
            return response()->json([
                'message' => 'Failed to upload file'
            ], 500);
        }

        // Process the CSV
        $filePath = $this->fileUploadService->getFilePath($path);
        $results = $this->csvProcessingService->processCSV($filePath, Auth::user());

        return response()->json([
            'message' => 'File processed successfully',
            'file_path' => $path,
            'results' => $results
        ]);
    }

    /**
     * Get activity by date
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByDate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $activity = Activity::where('user_id', Auth::id())
            ->where('date', $request->date)
            ->first();

        if (!$activity) {
            return response()->json([
                'message' => 'No activity data found for this date'
            ], 404);
        }

        return response()->json($activity);
    }
}