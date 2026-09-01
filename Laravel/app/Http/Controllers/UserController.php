<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserStatusRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        abort_unless(
            $request->user()->can('users.view'),
            403
        );

        $users = User::query()
            ->with('roles')
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {
                    $search = $request->string('search');

                    $query->where(function ($query) use ($search) {
                        $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                }
            )
            ->orderBy('name')
            ->paginate(
                $request->integer('per_page', 15)
            )
            ->withQueryString();

        return UserResource::collection($users);
    }

    public function show(User $user): UserResource
    {
        abort_unless(
            request()->user()->can('users.view'),
            403
        );
        $user->load('roles');
        return new UserResource($user);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->string('name'),
            'email' => $request->string('email'),
            'password' => $request->string('password'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        $user->assignRole($request->input('role'));

        $user->load('roles');

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $data = [
            'name' => $request->string('name'),
            'email' => $request->string('email'),
        ];

        if ($request->filled('password'))
            $data['password'] = $request->string('password');

        $user->update($data);

        $user->syncRoles([$request->input('role')]);

        $user->load('roles');

        return new UserResource($user);
    }

    public function status(UpdateUserStatusRequest $request, User $user): UserResource
    {
        abort_if($user->is($request->user()), 422, __("user.cannot.self_disable"));

        $user->update(['is_active' => $request->boolean('is_active')]);

        return new UserResource($user->fresh()->load('roles'));
    }

    public function delete(DeleteUserRequest $request, User $user): JsonResponse
    {
        abort_if($user->is($request->user()), 422, __('user.cannot.self_delete'));

        /**
         * @todo Add a "marked-for-delete" flag, and a periodic system to delete marked objects.
         * This should look on dependencies where the object is utilized and switch it with a placeholder, maybe the object's id/uuid
        */

        return response()->json($user->delete());
    }
}
