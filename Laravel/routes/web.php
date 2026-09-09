<?php

use Illuminate\Support\Facades\Route;

Route::middleware('cache.headers:no_store;no_cache')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/phpinfo', function () {
            phpinfo();
        });
        Route::view("/aep", "aep");
    });

    // The React SPA shell must be reachable without a Laravel session or bearer token.
    // React performs the actual authentication gate and redirects to /app/login.
    Route::view("/app", "app")->name('home');
    Route::view('/app/{any}', 'app')->where('any', '.*');

    Route::get('/', function () {
        if (!APP_DEVMODE && !str_ends_with(request()->getHost(), ".localhost")) {
            return view('soon');
        }
        return view('public/index');
    })->name('public');
});
