<?php

namespace App\Http\Controllers;

use App\Domain\Integrations\Contracts\FinanceIntegration;
use App\Http\Requests\UpdateAsaasIntegrationRequest;
use App\Infrastructure\Integrations\Asaas\AsaasApiException;
use App\Application\Integrations\IntegrationManager;
use App\Models\IntegrationAccount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class AsaasIntegrationController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('integrations.view'), 403);

        $account = $this->account();

        return response()->json([
            'data' => [
                'provider' => 'asaas',
                'capability' => 'finance',
                'configured' => $account !== null,
                'api_key_configured' => $account?->credential('api_key') !== null,
                'environment' => $account?->environment ?? 'sandbox',
                'is_active' => $account?->is_active ?? false,
            ],
        ]);
    }

    public function update(UpdateAsaasIntegrationRequest $request): JsonResponse
    {
        $data = $request->validated();
        $account = $this->account();

        $apiKey = $data['api_key'] ?? null;

        if (!$account && !$apiKey) {
            abort(422, 'A chave de API é obrigatória na primeira configuração.');
        }

        $expectedPrefix = $data['environment'] === 'production'
            ? '$aact_prod_'
            : '$aact_hmlg_';

        if ($apiKey !== null) {
            abort_unless(
                str_starts_with($apiKey, $expectedPrefix),
                422,
                "A chave informada não corresponde ao ambiente {$data['environment']}."
            );
        } else if ($account) {
            $currentApiKey = $account->credential('api_key');

            abort_unless(
                $currentApiKey && str_starts_with($currentApiKey, $expectedPrefix),
                422,
                "A chave atual não corresponde ao ambiente {$data['environment']}. Informe uma nova chave de API."
            );
        }

        DB::transaction(function () use ($data, $apiKey, $account) {
            $credentials = $account?->credentials ?? [];

            if ($apiKey !== null) {
                $credentials['api_key'] = $apiKey;
            }

            $attributes = [
                'capability' => 'finance',
                'provider' => 'asaas',
                'environment' => $data['environment'],
                'credentials' => $credentials,
                'is_active' => $data['is_active'] ?? true,
            ];

            if ($account) {
                $account->update($attributes);
            } else {
                IntegrationAccount::create($attributes);
            }
        });

        return $this->show($request);
    }

    public function balance(
        Request $request,
        IntegrationManager $integrations,
    ): JsonResponse {
        abort_unless($request->user()->can('integrations.view'), 403);

        try {
            $integration = $integrations->driver('finance');

            abort_unless(
                $integration instanceof FinanceIntegration,
                422,
                'O provedor financeiro configurado não oferece a operação de saldo.'
            );

            return response()->json([
                'data' => $integration->balance()->toArray(),
            ]);
        } catch (AsaasApiException $exception) {
            $status = $exception->upstreamStatus === 401 ? 422 : 502;

            return response()->json([
                'status' => 'failed',
                'data' => $exception->getMessage(),
            ], $status);
        } catch (InvalidArgumentException $exception) {
            return response()->json([
                'status' => 'failed',
                'data' => $exception->getMessage(),
            ], 422);
        }
    }

    private function account(): ?IntegrationAccount
    {
        return IntegrationAccount::query()
            ->where('capability', 'finance')
            ->where('provider', 'asaas')
            ->first();
    }
}
