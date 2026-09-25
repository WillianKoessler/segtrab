<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class ClientPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (
            [
                'clients.view',
                'clients.create',
                'clients.update',
                'clients.delete',
            ] as $permission
        ) {
            Permission::findOrCreate($permission, 'web');
        }
    }
}
