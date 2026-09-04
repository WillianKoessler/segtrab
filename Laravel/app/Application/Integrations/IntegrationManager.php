<?php

namespace App\Application\Integrations;

use App\Domain\Integrations\Contracts\IntegrationDriver;
use InvalidArgumentException;

final class IntegrationManager
{
    /**
     * Resolve the configured integration driver for a business capability.
     *
     * Examples:
     *   finance
     *   sst
     *   engineering
     */
    public function driver(string $capability): IntegrationDriver
    {
        $driver = config("integrations.capabilities.{$capability}.driver");

        if (!$driver) {
            throw new InvalidArgumentException(
                "No integration driver configured for [{$capability}]."
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

    /**
     * Resolve a named integration driver directly.
     */
    public function named(string $driver): IntegrationDriver
    {
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

    /**
     * Return the configured driver key for a capability.
     */
    public function configuredDriver(string $capability): string
    {
        return (string) config(
            "integrations.capabilities.{$capability}.driver"
        );
    }
}
