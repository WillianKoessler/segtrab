<?php

use App\Http\Controllers\AccessControlController;
use App\Http\Controllers\Auth\TokenAuthenticationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api-json')->group(function () {
    Route::post('/login', [TokenAuthenticationController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [TokenAuthenticationController::class, 'destroy']);

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
