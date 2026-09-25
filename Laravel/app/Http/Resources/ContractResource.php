<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'name' => $this->name,
            'type' => $this->type,
            'status' => $this->status,
            'notes' => $this->notes,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'items' => ContractItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
