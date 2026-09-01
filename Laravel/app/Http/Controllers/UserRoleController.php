<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserRoleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('users.view'), 403);

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['data' => $roles]);
    }
}
