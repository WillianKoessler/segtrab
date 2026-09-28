<?php

namespace App\Infrastructure\Integrations\Asaas;

use App\Domain\Integrations\Contracts\FinanceIntegration;
use App\Domain\Integrations\DTO\AccountBalance;
use App\Domain\Integrations\DTO\IntegrationHealth;
use App\Models\IntegrationAccount;

final class AsaasIntegration implements FinanceIntegration
{
    public function key(): string
    {
        return 'asaas';
    }

    public function name(): string
    {
        return 'Asaas';
    }

    public function health(): IntegrationHealth
    {
        $startedAt = microtime(true);

        try {
            $this->balance();

            $latencyMs = (int) round(
                (microtime(true) - $startedAt) * 1000
            );

            return new IntegrationHealth(
                status: 'ok',
                message: 'Conexão com o Asaas estabelecida.',
                latencyMs: $latencyMs,
                details: [
                    'environment' => $this->account()->environment,
                ],
            );
        } catch (AsaasApiException $exception) {
            $latencyMs = (int) round(
                (microtime(true) - $startedAt) * 1000
            );

            return new IntegrationHealth(
                status: 'error',
                message: $exception->getMessage(),
                latencyMs: $latencyMs,
                details: [
                    'upstream_status' => $exception->upstreamStatus,
                ],
            );
        }
    }

    public function balance(): AccountBalance
    {
        $data = $this->client()->get('/finance/balance');

        return new AccountBalance(
            amount: (float) ($data['balance'] ?? 0),
            currency: 'BRL',
        );
    }

    private function client(): AsaasClient
    {
        return new AsaasClient($this->account());
    }

    private function account(): IntegrationAccount
    {
        $account = IntegrationAccount::query()
            ->where('capability', 'finance')
            ->where('provider', 'asaas')
            ->where('is_active', true)
            ->first();

        if (!$account) {
            throw new AsaasApiException(
                'A conta do Asaas não está configurada ou está desativada.'
            );
        }

        return $account;
    }
}
