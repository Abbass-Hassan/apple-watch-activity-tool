<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CSVFileUploaded
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $filePath;

    /**
     * Create a new event instance.
     *
     * @param User $user
     * @param string $filePath
     */
    public function __construct(User $user, string $filePath)
    {
        $this->user = $user;
        $this->filePath = $filePath;
    }
}