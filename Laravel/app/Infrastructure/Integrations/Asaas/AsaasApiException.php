<?php

namespace App\Infrastructure\Integrations\Asaas;

use RuntimeException;
use Throwable;

class AsaasApiException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly ?int $upstreamStatus = null,
        public readonly array $upstreamBody = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }
}
