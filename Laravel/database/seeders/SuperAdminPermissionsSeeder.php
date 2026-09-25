<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SuperAdminPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reducer = function ($item) { return $item->name; };
        $permissions = Permission::all(['name'])->all();
        $permissions = array_map($reducer, $permissions);

        $superAdmin = Role::findOrCreate('Super Administrador', 'web');
        $superAdmin->syncPermissions($permissions);
    }
}
