<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAsaasIntegrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('integrations.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'environment' => [
                'required',
                Rule::in(['sandbox', 'production']),
            ],
            'api_key' => [
                'nullable',
                'string',
                'max:255',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }
}
