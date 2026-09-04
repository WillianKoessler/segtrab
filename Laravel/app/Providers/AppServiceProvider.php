<?php

namespace App\Providers;

use App\Application\Integrations\IntegrationManager;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            IntegrationManager::class,
            function() { return new IntegrationManager(); }
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        DB::connection()->getPdo();
    }
}
