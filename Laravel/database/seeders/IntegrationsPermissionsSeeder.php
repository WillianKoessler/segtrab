<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class IntegrationsPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (
            [
                'integrations.view',
                'integrations.manage',
            ] as $permission
        ) {
            Permission::findOrCreate($permission, 'web');
        }
    }
}
