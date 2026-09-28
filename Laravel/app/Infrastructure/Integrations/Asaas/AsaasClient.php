<?php

namespace App\Infrastructure\Integrations\Asaas;

use App\Models\IntegrationAccount;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

final class AsaasClient
{
    private PendingRequest $http;

    public function __construct(
        private readonly IntegrationAccount $account,
    ) {
        $config = config('integrations.providers.asaas');

        $baseUrl = $account->environment === 'production'
            ? $config['production_url']
            : $config['sandbox_url'];

        $apiKey = $account->credential('api_key');

        if (!$apiKey) {
            throw new AsaasApiException(
                'A chave de API do Asaas não está configurada.'
            );
        }

        $this->http = Http::baseUrl($baseUrl)
            ->acceptJson()
            ->withHeaders([
                'Content-Type' => 'application/json',
                'User-Agent' => $config['user_agent'],
                'access_token' => $apiKey,
            ])
            ->connectTimeout($config['connect_timeout'])
            ->timeout($config['timeout']);
    }

    public function get(string $path, array $query = []): array
    {
        try {
            $response = $this->http->get($path, $query);
        } catch (ConnectionException $exception) {
            throw new AsaasApiException(
                'Não foi possível conectar ao Asaas.',
                previous: $exception,
            );
        }

        if ($response->successful()) {
            return $response->json() ?? [];
        }

        $body = $response->json();

        throw new AsaasApiException(
            $this->messageForStatus($response->status()),
            $response->status(),
            is_array($body) ? $body : [],
        );
    }

    private function messageForStatus(int $status): string
    {
        return match ($status) {
            401 => 'A chave de API do Asaas é inválida ou não pertence ao ambiente configurado.',
            403 => 'O Asaas recusou a operação para a conta configurada.',
            429 => 'O limite de requisições do Asaas foi atingido. Tente novamente mais tarde.',
            default => "O Asaas respondeu com HTTP {$status}.",
        };
    }
}
