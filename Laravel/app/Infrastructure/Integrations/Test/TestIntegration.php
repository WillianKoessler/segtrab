<?php

namespace App\Infrastructure\Integrations\Test;

use App\Domain\Integrations\Contracts\IntegrationDriver;
use App\Domain\Integrations\DTO\IntegrationHealth;

final class TestIntegration implements IntegrationDriver
{
    public function key(): string
    {
        return 'test';
    }

    public function name(): string
    {
        return 'Segtrab Test Integration';
    }

    public function health(): IntegrationHealth
    {
        $startedAt = microtime(true);

        // This deliberately performs no external request.
        // It validates that the integration layer can resolve and execute
        // a concrete driver without depending on a third-party system.

        $latencyMs = (int) round(
            (microtime(true) - $startedAt) * 1000
        );

        return new IntegrationHealth(
            status: 'ok',
            message: 'Test integration is available.',
            latencyMs: $latencyMs,
            details: [
                'driver' => $this->key(),
                'environment' => app()->environment(),
            ],
        );
    }
}
