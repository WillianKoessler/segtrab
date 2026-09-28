<?php

namespace App\Application\Integrations;

use App\Domain\Integrations\Contracts\IntegrationDriver;
use App\Models\IntegrationAccount;
use InvalidArgumentException;

final class IntegrationManager
{
    /**
     * Resolve the configured integration driver for a business capability.
     *
     * A database-backed integration account takes precedence over the
     * development/default configuration. This lets the Settings UI activate
     * a provider without modifying .env or application source code.
     */
    public function driver(string $capability): IntegrationDriver
    {
        $account = IntegrationAccount::query()
            ->where('capability', $capability)
            ->first();

        if ($account) {
            if (!$account->is_active) {
                throw new InvalidArgumentException(
                    "Integration for capability [{$capability}] is disabled."
                );
            }

            return $this->resolve($account->provider);
        }

        return $this->resolve(
            config("integrations.capabilities.{$capability}.driver")
        );
    }

    /**
     * Resolve a named integration driver directly.
     */
    public function named(string $driver): IntegrationDriver
    {
        return $this->resolve($driver);
    }

    /**
     * Return the currently effective driver key for a capability.
     */
    public function configuredDriver(string $capability): string
    {
        $account = IntegrationAccount::query()
            ->where('capability', $capability)
            ->first();

        if ($account) {
            return $account->provider;
        }

        return (string) config(
            "integrations.capabilities.{$capability}.driver"
        );
    }

    private function resolve(?string $driver): IntegrationDriver
    {
        if (!$driver) {
            throw new InvalidArgumentException(
                'No integration driver configured.'
            );
        }

        $class = config("integrations.drivers.{$driver}");

        if (!$class) {
            throw new InvalidArgumentException(
                "Integration driver [{$driver}] is not registered."
            );
        }

        $integration = app($class);

        if (!$integration instanceof IntegrationDriver) {
            throw new InvalidArgumentException(
                "Integration [{$driver}] must implement ".IntegrationDriver::class.'.'
            );
        }

        return $integration;
    }
}
