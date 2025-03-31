<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('prediction_date');
            $table->enum('prediction_type', ['goal_achievement', 'anomaly', 'trend', 'insight']);
            $table->text('description');
            $table->json('prediction_data')->nullable();
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['user_id', 'prediction_date', 'prediction_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};
