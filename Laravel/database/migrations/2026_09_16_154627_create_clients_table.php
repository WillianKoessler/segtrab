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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->enum('doctype', [ "cpf", "cnpj", "caepf", "cno", "cei" ])->nullable(false);
            $table->string('document', 32)->nullable(false)->unique();
            
            $table->string('name')->nullable(false);
            $table->string('social_name')->nullable();

            $table->string('email')->nullable()->index();
            $table->string('phone', 32)->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->text('notes')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};


