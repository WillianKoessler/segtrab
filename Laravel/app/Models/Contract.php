<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use HasUlids;
    use SoftDeletes;

    protected $fillable = [
        'client_id',

        'name',
        'type',
        'status',
        'notes',

        'starts_at',
        'ends_at',
    ];

    protected function casts()
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function items()
    {
        return $this->hasMany(ContractItem::class);
    }
}
