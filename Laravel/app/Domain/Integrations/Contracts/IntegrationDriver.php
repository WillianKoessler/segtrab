<?php

namespace App\Domain\Integrations\Contracts;

use App\Domain\Integrations\DTO\IntegrationHealth;

interface IntegrationDriver
{
    public function key(): string;

    public function name(): string;

    /**
     * Check whether the integration is reachable and correctly configured.
     */
    public function health(): IntegrationHealth;
}
