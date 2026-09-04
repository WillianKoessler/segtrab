<?php

namespace App\Domain\Integrations\DTO;

final readonly class IntegrationHealth
{
    public function __construct(
        public string $status,
        public string $message,
        public ?int $latencyMs = null,
        public array $details = [],
    ) {
    }

    public function ok(): bool
    {
        return $this->status === 'ok';
    }

    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'message' => $this->message,
            'latency_ms' => $this->latencyMs,
            'details' => $this->details,
        ];
    }
}
