<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'doctype',
        'document',

        'name',
        'social_name',

        'email',
        'phone',
        'is_active',
        'notes',
    ];

    protected function casts()
    {
        return [
            'is_active' => 'boolean'
        ];
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
