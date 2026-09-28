<?php

namespace App\Domain\Integrations\Contracts;

use App\Domain\Integrations\DTO\AccountBalance;

interface FinanceIntegration extends IntegrationDriver
{
    public function balance(): AccountBalance;
}
