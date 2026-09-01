import { useEffect, useState } from "react";
import { MoreHorizontal, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createPermission,
    createRole,
    deletePermission,
    deleteRole,
    getPermissions,
    getRoles,
    updatePermission,
    updateRole,
} from "../../../../js/api/accessControl";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/ui/alert-dialog";

function PermissionDialog({ dialog, onClose, onSaved }) {
    const editing = Boolean(dialog?.permission);
    const [name, setName] = useState(dialog?.permission?.name ?? "");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(dialog?.permission?.name ?? "");
    }, [dialog]);

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const saved = editing
                ? await updatePermission(dialog.permission.id, { name })
                : await createPermission({ name });
            onSaved(saved);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={dialog !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editing ? "Editar permissão" : "Nova permissão"}</DialogTitle>
                    <DialogDescription>
                        {editing ? "Altere o identificador da permissão." : "Crie uma capacidade que poderá ser atribuída aos grupos."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <label htmlFor="permission-name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="permission-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="clients.view"
                            required
                        />
                        <p className="text-xs text-muted-foreground">Use o formato módulo.ação, por exemplo users.view.</p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function RoleDialog({ dialog, permissions, onClose, onSaved }) {
    const editing = Boolean(dialog?.role);
    const [name, setName] = useState(dialog?.role?.name ?? "");
    const [selected, setSelected] = useState(new Set((dialog?.role?.permissions ?? []).map((permission) => permission.id)));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(dialog?.role?.name ?? "");
        setSelected(new Set((dialog?.role?.permissions ?? []).map((permission) => permission.id)));
    }, [dialog]);

    const toggle = (id) => setSelected((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        try {
            const payload = { name, permission_ids: [...selected] };
            const saved = editing
                ? await updateRole(dialog.role.id, payload)
                : await createRole(payload);
            onSaved(saved);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={dialog !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editing ? "Editar grupo" : "Novo grupo"}</DialogTitle>
                    <DialogDescription>Defina o nome do grupo e as permissões que os usuários desse grupo receberão.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <label htmlFor="role-name" className="text-sm font-medium">Nome</label>
                        <Input id="role-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Financeiro" required />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Permissões</label>
                            <Badge variant="secondary">{selected.size} selecionadas</Badge>
                        </div>
                        <div className="grid max-h-80 grid-cols-1 gap-2 overflow-y-auto rounded-lg border p-3 sm:grid-cols-2">
                            {permissions.map((permission, idx) => (
                                <label key={`${permission.id}.${idx}`} className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 hover:bg-muted/50">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(permission.id)}
                                        onChange={() => toggle(permission.id)}
                                        className="size-4 accent-primary"
                                    />
                                    <span className="text-sm">{permission.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar grupo"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function AccessControlPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleDialog, setRoleDialog] = useState(null);
    const [permissionDialog, setPermissionDialog] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const nextRoles = await getRoles();
            setRoles(nextRoles);

            const nextPermissions = await getPermissions();
            setPermissions(nextPermissions);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const saveRole = (saved) => {
        setRoles((current) => current.some((role) => role.id === saved.id)
            ? current.map((role) => role.id === saved.id ? saved : role)
            : [...current, saved].sort((a, b) => a.name?.localeCompare(b.name)));
        setRoleDialog(null);
        toast.success("Grupo salvo");
    };

    const savePermission = (saved) => {
        setPermissions((current) => current.some((permission) => permission.id === saved.id)
            ? current.map((permission) => permission.id === saved.id ? saved : permission)
            : [...current, saved].sort((a, b) => a.name?.localeCompare(b.name)));
        setPermissionDialog(null);
        toast.success("Permissão salva");
    };

    const remove = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.type === "role") {
                await deleteRole(deleteTarget.item.id);
                setRoles((current) => current.filter((role) => role.id !== deleteTarget.item.id));
                toast.success("Grupo removido");
            } else {
                await deletePermission(deleteTarget.item.id);
                setPermissions((current) => current.filter((permission) => permission.id !== deleteTarget.item.id));
                setRoles((current) => current.map((role) => ({
                    ...role,
                    permissions: role.permissions?.filter((permission) => permission.id !== deleteTarget.item.id),
                })));
                toast.success("Permissão removida");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <section className="grid gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Grupos e permissões</h1>
                    <p className="text-sm text-muted-foreground">Defina quais capacidades cada grupo de usuários possui.</p>
                </div>
            </div>

            <Tabs defaultValue="roles" className="w-full">
                <TabsList>
                    <TabsTrigger value="roles">Grupos</TabsTrigger>
                    <TabsTrigger value="permissions">Permissões</TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="m-1 space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setRoleDialog({ type: "create" })}>
                            <Plus className="mr-2 size-4" /> Novo grupo
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Grupos</CardTitle>
                            <CardDescription>Um grupo reúne as permissões de uma função do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Grupo</TableHead>
                                        <TableHead>Permissões</TableHead>
                                        <TableHead>Usuários</TableHead>
                                        <TableHead className="w-[60px]">Opções</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles?.map((role, idx) => (
                                        <TableRow key={`${role.id}.${idx}`}>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>{role.permissions?.length ?? 0}</TableCell>
                                            <TableCell>{role.users_count ?? 0}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => setRoleDialog({ type: "edit", role })}>Editar</Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: "role", item: role })}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!loading && roles.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                                Nenhum grupo cadastrado.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="permissions" className="m-1 space-y-4">
                    <div className="flex justify-end">
                        <Button onClick={() => setPermissionDialog({ type: "create" })}>
                            <Plus className="mr-2 size-4" />
                            Nova permissão
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Permissões</CardTitle>
                            <CardDescription>Capacidades individuais que podem ser atribuídas aos grupos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Permissão</TableHead>
                                        <TableHead>Grupos</TableHead>
                                        <TableHead className="w-[60px]">Opções</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions?.map((permission, idx) => (
                                        <TableRow key={`${permission.id}.${idx}`}>
                                            <TableCell className="font-medium">{permission.name}</TableCell>
                                            <TableCell>{permission.roles_count ?? 0}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => setPermissionDialog({ type: "edit", permission })}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget({ type: "permission", item: permission })}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {!loading && permissions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                                Nenhuma permissão cadastrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <RoleDialog dialog={roleDialog} permissions={permissions} onClose={() => setRoleDialog(null)} onSaved={saveRole} />
            <PermissionDialog dialog={permissionDialog} onClose={() => setPermissionDialog(null)} onSaved={savePermission} />

            <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover {deleteTarget?.type === "role" ? "grupo" : "permissão"}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.type === "role"
                                ? `O grupo ${deleteTarget?.item?.name ?? ""} será removido. Grupos usados por usuários precisam ser desvinculados antes.`
                                : `A permissão ${deleteTarget?.item?.name ?? ""} será removida. Primeiro remova-a de todos os grupos que a utilizam.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={remove}>Remover</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}
