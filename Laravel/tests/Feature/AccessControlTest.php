<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_create_and_update_a_group(): void
    {
        $admin = User::factory()->create();
        $superAdmin = Role::findOrCreate('Super Administrador', 'web');
        $admin->assignRole($superAdmin);
        foreach (['roles.view', 'roles.create', 'roles.update', 'roles.delete', 'users.view', 'permissions.view', 'permissions.create', 'permissions.update', 'permissions.delete', 'clients.view'] as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }
        $superAdmin->syncPermissions(Permission::all());
        $permission = Permission::where('name', 'clients.view')->firstOrFail();

        $this->actingAs($admin)
            ->postJson('/api/roles', [
                'name' => 'Financeiro',
                'permission_ids' => [$permission->id],
            ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Financeiro');

        $role = Role::where('name', 'Financeiro')->firstOrFail();
        $this->assertTrue($role->hasPermissionTo('clients.view'));

        $this->actingAs($admin)
            ->putJson('/api/roles/' . $role->id, [
                'name' => 'Financeiro Senior',
                'permission_ids' => [],
            ])
            ->assertOk();

        $this->assertDatabaseHas('roles', ['name' => 'Financeiro Senior']);
        $this->assertFalse($role->fresh()->hasPermissionTo('clients.view'));
    }

    public function test_non_super_admin_cannot_grant_a_permission_they_do_not_have(): void
    {
        $admin = User::factory()->create();
        $role = Role::create(['name' => 'Administrador', 'guard_name' => 'web']);
        $admin->assignRole($role);
        Permission::create(['name' => 'roles.create', 'guard_name' => 'web']);
        $role->givePermissionTo('roles.create');

        $privileged = Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);

        $this->actingAs($admin)
            ->postJson('/api/roles', [
                'name' => 'Dangerous',
                'permission_ids' => [$privileged->id],
            ])
            ->assertStatus(422);
    }

    public function test_super_admin_cannot_be_deleted(): void
    {
        $admin = User::factory()->create();
        $superAdmin = Role::findOrCreate('Super Administrador', 'web');
        Permission::create(['name' => 'roles.delete', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo('roles.delete');
        $admin->assignRole($superAdmin);

        $this->actingAs($admin)
            ->deleteJson('/api/roles/' . $superAdmin->id)
            ->assertStatus(422);

        $this->assertDatabaseHas('roles', ['id' => $superAdmin->id]);
    }
}
