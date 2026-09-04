<?php

use App\Infrastructure\Integrations\Test\TestIntegration;

return [

    /*
    |--------------------------------------------------------------------------
    | Business capabilities
    |--------------------------------------------------------------------------
    |
    | The rest of the application depends on a capability, not on a vendor.
    | Changing "test" to "asaas", for example, should only change configuration
    | and the adapter registered for that capability.
    |
    */

    'capabilities' => [
        'finance' => [
            'driver' => env('FINANCE_INTEGRATION', 'test'),
        ],

        'sst' => [
            'driver' => env('SST_INTEGRATION', 'test'),
        ],

        'engineering' => [
            'driver' => env('ENGINEERING_INTEGRATION', 'test'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Drivers
    |--------------------------------------------------------------------------
    |
    | Register external providers here. The application does not reference
    | vendor SDKs or concrete providers directly.
    |
    */

    'drivers' => [
        'test' => TestIntegration::class,
        // 'asaas' => App\Infrastructure\Integrations\Asaas\AsaasIntegration::class,
        // 'conta_azul' => App\Infrastructure\Integrations\ContaAzul\ContaAzulIntegration::class,
        // 'eso' => App\Infrastructure\Integrations\ESO\ESOIntegration::class,
        // 'soc' => App\Infrastructure\Integrations\SOC\SocIntegration::class,
        // 'ho_facil' => App\Infrastructure\Integrations\HOFACIL\HoFacilIntegration::class,
        // 'asana' => App\Infrastructure\Integrations\Asana\AsanaIntegration::class,
    ],
];
