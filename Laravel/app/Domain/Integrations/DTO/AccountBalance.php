<?php

namespace App\Domain\Integrations\DTO;

final readonly class AccountBalance
{
    public function __construct(
        public float $amount,
        public string $currency = 'BRL',
    ) {
    }

    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
        ];
    }
}
