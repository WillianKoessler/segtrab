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
        $permissions = Permission::all(['name']);
        $superAdmin = Role::findOrCreate('Super Administrador', 'web');
        $superAdmin->syncPermissions($permissions);
    }
}
