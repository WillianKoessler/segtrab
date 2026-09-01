<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\User;

class AccessControlController extends Controller
{
    public function roles(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('roles.view'), 403);

        $roles = Role::query()
            ->where('guard_name', 'web')
            ->select(['id', 'name', 'guard_name'])
            ->with(['permissions:id,name'])
            ->withCount(['permissions'])
            // ->withCount([
                // 'users' => function ($query) {
                //     return $query->where('model_type', \App\Models\User::class);
                // }

                // 'users' => fn($query) => $query->where('model_type', \App\Models\User::class),
            // ])

            ->selectSub(
                DB::table('model_has_roles')
                    ->whereColumn('model_has_roles.role_id', 'roles.id')
                    ->where('model_type', User::class)
                    ->selectRaw('count(*)'),
                'users_count'
            )
            ->orderBy('name')
            ->get();

        return response()->json($roles);
    }

    public function permissions(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('permissions.view'), 403);

        $permissions = Permission::query()
            ->where('guard_name', 'web')
            ->withCount('roles')
            ->orderBy('name')
            ->get(['id', 'name', 'guard_name']);

        return response()->json($permissions);
    }

    public function storeRole(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('roles.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[^\\r\\n]+$/', 'unique:roles,name,NULL,id,guard_name,web'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        $permissionIds = $this->allowedPermissionIds($request, $data['permission_ids'] ?? []);

        $role = DB::transaction(function () use ($data, $permissionIds) {
            $role = Role::create([
                'name' => trim($data['name']),
                'guard_name' => 'web',
            ]);

            $role->syncPermissions(Permission::query()
                ->where('guard_name', 'web')
                ->whereIn('id', $permissionIds)
                ->get());

            return $role->load('permissions:id,name');
        });

        return response()->json([$role], 201);
    }

    public function showRole(Request $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.view'), 403);
        $this->ensureWebRole($role);

        return response()->json([$role->load('permissions:id,name')->loadCount('users')]);
    }

    public function updateRole(Request $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.update'), 403);
        $this->ensureWebRole($role);

        if ($role->name === 'Super Administrador' && !$request->user()->hasRole('Super Administrador')) {
            abort(403, 'Somente o Super Administrador pode alterar o grupo Super Administrador.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[^\\r\\n]+$/', 'unique:roles,name,' . $role->id . ',id,guard_name,web'],
            'permission_ids' => ['sometimes', 'array'],
            'permission_ids.*' => ['integer', 'distinct', 'exists:permissions,id'],
        ]);

        $permissionIds = $this->allowedPermissionIds($request, $data['permission_ids'] ?? []);

        DB::transaction(function () use ($request, $role, $data, $permissionIds) {
            if ($role->name === 'Super Administrador' && trim($data['name']) !== 'Super Administrador') {
                abort(422, 'O grupo Super Administrador não pode ser renomeado.');
            }

            $role->update(['name' => trim($data['name'])]);
            $role->syncPermissions(Permission::query()
                ->where('guard_name', 'web')
                ->whereIn('id', $permissionIds)
                ->get());
        });

        return response()->json([$role->fresh()->load('permissions:id,name')->loadCount('users')]);
    }

    public function destroyRole(Request $request, Role $role): JsonResponse
    {
        abort_unless($request->user()->can('roles.delete'), 403);
        $this->ensureWebRole($role);

        if ($role->name === 'Super Administrador') {
            abort(422, 'O grupo Super Administrador não pode ser removido.');
        }

        if ($role->users()->exists()) {
            abort(422, 'Remova este grupo dos usuários antes de excluí-lo.');
        }

        $role->delete();

        return response()->json([true]);
    }

    public function storePermission(Request $request): JsonResponse
    {
        abort_unless($request->user()->can('permissions.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9][a-z0-9_-]*(?:\\.[a-z0-9][a-z0-9_-]*)+$/', 'unique:permissions,name,NULL,id,guard_name,web'],
        ]);

        $permission = Permission::create([
            'name' => Str::lower(trim($data['name'])),
            'guard_name' => 'web',
        ]);

        return response()->json([$permission], 201);
    }

    public function showPermission(Request $request, Permission $permission): JsonResponse
    {
        abort_unless($request->user()->can('permissions.view'), 403);
        $this->ensureWebPermission($permission);

        return response()->json([$permission->loadCount('roles')]);
    }

    public function updatePermission(Request $request, Permission $permission): JsonResponse
    {
        abort_unless($request->user()->can('permissions.update'), 403);
        $this->ensureWebPermission($permission);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9][a-z0-9_-]*(?:\\.[a-z0-9][a-z0-9_-]*)+$/', 'unique:permissions,name,' . $permission->id . ',id,guard_name,web'],
        ]);

        $permission->update(['name' => Str::lower(trim($data['name']))]);

        return response()->json([$permission->fresh()->loadCount('roles')]);
    }

    public function destroyPermission(Request $request, Permission $permission): JsonResponse
    {
        abort_unless($request->user()->can('permissions.delete'), 403);
        $this->ensureWebPermission($permission);

        if ($permission->name === 'permissions.delete') {
            abort(422, 'A permissão permissions.delete não pode ser removida.');
        }

        if ($permission->roles()->exists()) {
            abort(422, 'Remova esta permissão dos grupos antes de excluí-la.');
        }

        $permission->delete();

        return response()->json([true]);
    }

    private function allowedPermissionIds(Request $request, array $permissionIds): array
    {
        $permissionIds = array_values(array_unique(array_map('intval', $permissionIds)));

        if ($request->user()->hasRole('Super Administrador')) {
            return $permissionIds;
        }

        $allowed = $request->user()
            ->getAllPermissions()
            ->where('guard_name', 'web')
            ->pluck('id')
            ->map(fn($id) => (int) $id)
            ->all();

        $invalid = array_values(array_diff($permissionIds, $allowed));
        abort_if($invalid !== [], 422, 'Você só pode atribuir permissões que já possui.');

        return $permissionIds;
    }

    private function ensureWebRole(Role $role): void
    {
        abort_if($role->guard_name !== 'web', 404);
    }

    private function ensureWebPermission(Permission $permission): void
    {
        abort_if($permission->guard_name !== 'web', 404);
    }
}
