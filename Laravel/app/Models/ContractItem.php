<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractItem extends Model
{
    protected $fillable = [
        'contract_id',
        'name',
        'area',
        'notes',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}
