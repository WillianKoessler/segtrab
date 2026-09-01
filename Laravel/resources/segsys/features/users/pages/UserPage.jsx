import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Plus, Trash2, UserRound } from "lucide-react";
import { deleteUser, getUsers } from "../../../../js/api/users";
import { getAvailableRoles } from "../../../../js/api/role";

import { Button } from "#components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu";
import { Badge } from "#components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription } from "#components/ui/dialog";
import { Skeleton } from "#components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/ui/alert-dialog";

import UserFormPage from "./UserFormPage";
import { toast } from "sonner";
import { useAuth } from "../../../app/providers/AuthProvider";

function UserPlaceholder() {
    return (
        <TableRow key="user-loading">
            <TableCell>
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Skeleton className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-medium"><Skeleton className="w-64 h-8" /></div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="w-64 h-8" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Skeleton className="w-16 h-8" />
                </div>
            </TableCell>
            <TableCell>
                <Skeleton className="w-32 h-8" />
            </TableCell>
            <TableCell>
                <Skeleton className="w-8 h-8" />
            </TableCell>
        </TableRow>
    );
}

export default function UserPage() {
    const { currentUser, authLoading, reloadUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [dialog, setDialog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availableRoles, setAvailableRoles] = useState([]);

    const dialogRef = useRef(null);

    const openCreate = () => setDialog({ type: "create" });
    const openEdit = user => setDialog({ type: "edit", user });
    const openDelete = user => setDialog({ type: "delete", user });
    const closeDialog = () => setDialog(null);

    const handleDialogOutside = event => {
        const originalEvent = event.detail.originalEvent;

        if (!(originalEvent instanceof PointerEvent))
            return;

        const rect = dialogRef.current?.getBoundingClientRect();

        if (!rect)
            return;

        const { clientX, clientY } = originalEvent;

        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom)
            event.preventDefault();
    }

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await getUsers();
            setUsers(response);

            const roles = await getAvailableRoles()
            setAvailableRoles(roles.sort((a, b) => a.id - b.id));
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!authLoading)
            loadUsers();
    }, [authLoading]);

    const handleSave = user => {
        setUsers(current => {
            return current.some(item => item.id === user.id)
                ? current.map(item => item.id === user.id ? user : item)
                : [...current, user];
        });
        if (user.id === currentUser.id)
            reloadUser();
        closeDialog();
        toast("Usuário Salvo");
    }

    const handleDelete = async user => {
        try {
            await deleteUser(user.id);
            setUsers(current => current.filter(item => item.id !== user?.id));
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            closeDialog();
        }
    }

    return (
        <section className="grid gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Usuários</h1>
                    <p className="text-sm text-muted-foreground">Gerencie as contas de acesso ao sistema.</p>
                </div>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 size-4" />
                    Novo Usuário
                </Button>
            </div>
            <Card className="mx-1">
                <CardHeader>
                    <CardTitle>Contas de Acesso</CardTitle>
                    <CardDescription>Usuários cadastrados no sistema.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow key="users-table-header">
                                <TableHead>Usuário</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Grupo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[60px]">Opções</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (<UserPlaceholder />) : users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <UserRound className="w-4 h-4"></UserRound>
                                        </div>
                                        <div>{user.name}</div>
                                    </TableCell>
                                    <TableCell>
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="flex gap-1 flex-wrap max-w-40">
                                        {user.roles?.map?.((role, role_id) => <Badge key={`user_role_${role_id}`}>{role}</Badge>)}
                                    </TableCell>
                                    <TableCell>
                                        {user.is_active ? <Badge variant="default">Ativo</Badge> : <Badge variant="secondary">Inativo</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="w-4 h-4"></MoreHorizontal>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="gap-10 min-w-40">
                                                <DropdownMenuItem asChild>
                                                    <Button variant="outline" className="size-full px-4 py-2" onClick={() => openEdit(user)}>
                                                        Editar
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Button variant="outline" className="size-full px-4 py-2">
                                                        Redefinir Senha
                                                    </Button>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Button variant="destructive" className="size-full px-4 py-2" onClick={() => { openDelete(user) }} disabled={currentUser?.id === user.id}>
                                                        <Trash2 className="h-4 w-4" />
                                                        Deletar Usuário
                                                    </Button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {(dialog?.type === "delete") && (
                <AlertDialog open={dialog !== null} onOpenChange={open => { if (!open) closeDialog(); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deletar Usuário</AlertDialogTitle>
                            <AlertDialogDescription>Esta ação irá apagar permanentemente este usuário e não poderá ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(dialog.user)}>Deletar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {(dialog?.type === "edit") && (
                <Dialog open={dialog !== null} onOpenChange={open => { if (!open) closeDialog(); }}>
                    <DialogContent ref={dialogRef} className="sm:max-w-sm" onPointerDownOutside={handleDialogOutside}>
                        <DialogHeader>
                            <DialogTitle>Editar usuário</DialogTitle>
                            <DialogDescription>Atualize os dados da conta de acesso.</DialogDescription>
                        </DialogHeader>
                        <UserFormPage user={dialog.user} onSaved={handleSave} availableRoles={availableRoles} />
                    </DialogContent>
                </Dialog>
            )}
            {(dialog?.type === "create") && (
                <Dialog open={dialog !== null} onOpenChange={open => { if (!open) closeDialog(); }}>
                    <DialogContent ref={dialogRef} className="sm:max-w-sm" onPointerDownOutside={handleDialogOutside}>
                        <DialogHeader>
                            <DialogTitle>Novo usuário</DialogTitle>
                            <DialogDescription>Crie uma nova conta de acesso ao sistema.</DialogDescription>
                        </DialogHeader>
                        <UserFormPage onSaved={handleSave} availableRoles={availableRoles} />
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}