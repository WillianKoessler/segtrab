<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IntegrationAccount extends Model
{
    protected $fillable = [
        'capability',
        'provider',
        'name',
        'environment',
        'credentials',
        'is_active',
    ];

    protected $hidden = [
        'credentials',
    ];

    protected function casts(): array
    {
        return [
            'credentials' => 'encrypted:array',
            'is_active' => 'boolean',
        ];
    }

    public function credential(string $key, mixed $default = null): mixed
    {
        return data_get($this->credentials, $key, $default);
    }
}
