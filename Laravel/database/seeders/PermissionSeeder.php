<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',

            'permissions.view',
            'permissions.create',
            'permissions.update',
            'permissions.delete',
        ];

        foreach($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        $superAdmin = Role::findOrCreate('Super Administrador', 'web');
        $administrator = Role::findOrCreate('Administrador', 'web');
        $user = Role::findOrCreate('Usuário', 'web');

        $superAdmin->syncPermissions($permissions);

        $administrator->syncPermissions([
            'users.view',
            'users.create',
            'users.update',
        ]);

        $user->syncPermissions([
            'users.view',
        ]);
    }
}
