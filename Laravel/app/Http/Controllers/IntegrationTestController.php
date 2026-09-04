<?php

namespace App\Http\Controllers;

use App\Application\Integrations\IntegrationManager;
use Illuminate\Http\JsonResponse;

final class IntegrationTestController extends Controller
{
    public function show(
        IntegrationManager $integrations
    ): JsonResponse {
        $capabilities = [
            'finance',
            'sst',
            'engineering',
        ];

        $data = [];

        foreach ($capabilities as $capability) {
            $driver = $integrations->driver($capability);
            $health = $driver->health();

            $data[$capability] = [
                'driver' => $integrations->configuredDriver($capability),
                'key' => $driver->key(),
                'name' => $driver->name(),
                'health' => $health->toArray(),
            ];
        }

        return response()->json([
            'status' => 'ok',
            'data' => $data,
        ]);
    }
}
