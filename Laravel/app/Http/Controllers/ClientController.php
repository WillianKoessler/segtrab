<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        abort_if(!$request->user()->can('clients.view'), 403);

        $clients = Client::query()
            ->with([])
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->string('search');

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('social_name', 'like', "%{$search}%")
                            ->orWhere('document', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }
            )
            ->orderBy('name')
            ->paginate($request->integer('per_page', 15))
            ->withQueryString();

        return ClientResource::collection($clients);
    }

    public function show(Client $client)
    {
        abort_if(!request()->user()->can('clients.view'), 403);
        return new ClientResource($client);
    }

    public function store(StoreClientRequest $request)
    {
        abort_if(!request()->user()->can('clients.create'), 403);
        $saveFn = function () use ($request) {
            $this->saveClient(new Client(), $request->validated());
        };
        $client = DB::transaction($saveFn);
        return (new ClientResource($client))->response()->setStatusCode(201);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        abort_if(!request()->user()->can('clients.update'), 403);
        $updateFn = function () use ($request, $client) {
            $this->saveClient($client, $request->validated());
        };
        $client = DB::transaction($updateFn);
        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        abort_if(!request()->user()->can('clients.delete'), 403);
        $client->delete();
        return null;
    }



    private function saveClient(Client $client, array $data)
    {
        $client->fill([
            'doctype' => $data['doctype'],
            'document' => $data['document'],
            'name' => $data['name'] ?? null,
            'social_name' => $data['social_name'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'notes' => $data['notes'] ?? null,
        ]);

        $client->save();

        return $client;
    }

    private function saveOneToOne(Client $client, string $relation, string $model, array $attributes)
    {
        if ($attributes === [])
            return;

        $client->{$relation}()->updateOrCreate(
            ['client_id' => $client->id],
            $attributes
        );
    }
}
