<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            'doctype' => $this->doctype,
            'document' => $this->document,
            'name' => $this->name,
            'social_name' => $this->social_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_active' => $this->is_active,
            'notes' => $this->notes,
            'contrats' => ContractResource::collection(
                $this->whenLoaded('contracts')
            ),
        ];
    }
}
