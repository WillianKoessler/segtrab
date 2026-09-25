<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignId('client_id')->constrained()->restrictOnDelete();

            $table->string('name');
            $table->string('type', 32)->default('service')->index();
            $table->string('status', 32)->default('active')->index();

            $table->text('notes')->nullable();

            $table->date('starts_at')->nullable();
            $table->date('ends_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
