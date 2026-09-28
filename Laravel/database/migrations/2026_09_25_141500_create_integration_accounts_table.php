<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integration_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('capability', 64);
            $table->string('provider', 64);
            $table->string('name')->nullable();
            $table->string('environment', 32)->default('sandbox');
            $table->text('credentials');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(
                ['capability', 'provider'],
                'integration_accounts_capability_provider_unique'
            );

            $table->index(['capability', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integration_accounts');
    }
};
