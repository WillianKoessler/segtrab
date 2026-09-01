<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\SessionAuthenticationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\AccessControlController;

Route::prefix('api')->middleware('api-json')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [SessionAuthenticationController::class, 'destroy'])->middleware('auth');
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::delete('/users/{user}', [UserController::class, 'delete']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::patch('/users/{user}/status', [UserRoleController::class, 'status']);
        Route::get('/user-roles', [UserRoleController::class, 'index']);

        Route::get('/roles', [AccessControlController::class, 'roles']);
        Route::post('/roles', [AccessControlController::class, 'storeRole']);
        Route::get('/roles/{role}', [AccessControlController::class, 'showRole']);
        Route::put('/roles/{role}', [AccessControlController::class, 'updateRole']);
        Route::delete('/roles/{role}', [AccessControlController::class, 'destroyRole']);

        Route::get('/permissions', [AccessControlController::class, 'permissions']);
        Route::post('/permissions', [AccessControlController::class, 'storePermission']);
        Route::get('/permissions/{permission}', [AccessControlController::class, 'showPermission']);
        Route::put('/permissions/{permission}', [AccessControlController::class, 'updatePermission']);
        Route::delete('/permissions/{permission}', [AccessControlController::class, 'destroyPermission']);
    });
});

Route::middleware('cache.headers:no_store;no_cache')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/phpinfo', function () {
            phpinfo();
        });
        Route::view("/aep", "aep");
        Route::view("/app", "app")->name('home');
        Route::view('/app/{any}', 'app')->where('any', '.*');
    });

    Route::view('/login', 'login')->name('login');
    Route::get('/', function () {
        if (!APP_DEVMODE && !str_ends_with(request()->getHost(), ".localhost")) {
            return view('soon');
        }
        return view('public/index');
    })->name('public');
    // Route::view('/', 'public/index')->name('public');
});

Route::post('/login', [SessionAuthenticationController::class, 'login'])->middleware('guest');
