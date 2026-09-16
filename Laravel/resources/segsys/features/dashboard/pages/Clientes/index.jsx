import { useEffect, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";

import { getClients, deleteClient } from "#api/clients";
import { toast } from "sonner";
import { cn } from "#lib/utils";

import { Button, buttonVariants } from "#components/ui/button";
import { Badge } from "#components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import { Input } from "#components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "#components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "#components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#components/ui/alert-dialog";
import ClienteForm from "./CreateCliente";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#components/ui/dialog";

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dialog, setDialog] = useState(null);
    const openCreate = () => setDialog({ type: "Novo" });
    const openEdit = client => setDialog({ type: "Editar", client });
    const openDelete = client => setDialog({ type: "delete", client });
    const closeDialog = () => setDialog(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getClients({ search });

            setClients(response.data ?? []);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async client => {
        try {
            setLoading(true);
            await deleteClient(client.id);
            await load();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const handleSearchKeyDown = event => {
        if (event.key !== 'Enter')
            return;

        load();
    }

    useEffect(() => { load() }, []);

    return (
        <section className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Clientes
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Empresas e pessoas atendidas pela Segtrab
                    </p>
                </div>

                <Button onClick={() => openCreate()}>
                    <Plus className="mr-2 h-4 w-4" />Novo cliente
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>Clientes cadastrados</CardTitle>

                            <CardDescription>
                                Cadastros e relacionamentos da empresa
                            </CardDescription>
                        </div>

                        <Input
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Pesquisar..."
                            className="max-w-xs"
                        />
                    </div>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Documento</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[60px]" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center"
                                    >
                                        Carregando clientes...
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading && clients.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        Nenhum cliente encontrado.
                                    </TableCell>
                                </TableRow>
                            )}

                            {!loading && clients.map(client => (
                                <TableRow key={client.id} onClick={() => openEdit(client)}>
                                    <TableCell>
                                        {client.trade_name || client.name}
                                    </TableCell>

                                    <TableCell>
                                        {client.document || "—"}
                                    </TableCell>

                                    <TableCell>{
                                        client.type === "company"
                                            ? "PJ"
                                            : "PF"
                                    }</TableCell>

                                    <TableCell>{
                                        client.is_active
                                            ? <Badge>Ativo</Badge>
                                            : <Badge variant="secondary">Inativo</Badge>
                                    }</TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    Editar
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={e => { e.stopPropagation(); openDelete(client); }} className={cn(buttonVariants({ variant: 'destructive' }), "w-full justify-start")} >
                                                    Remover
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
            <AlertDialog open={dialog !== null && dialog?.type === "delete"} onOpenChange={open => { if (!open) closeDialog(); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Usuário</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação irá apagar permanentemente este usuário e não poderá ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(dialog?.client)}>Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={dialog !== null && dialog?.type !== "delete"} onOpenChange={open => { if (!open) closeDialog(); }}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                    <DialogHeader>{dialog?.client
                        ? (<>
                            <DialogTitle>Editar Cliente</DialogTitle>
                            <DialogDescription>Atualize os dados cadastrais e os módulos relacionados</DialogDescription>
                        </>)
                        : (<>
                            <DialogTitle>Novo Cliente</DialogTitle>
                            <DialogDescription>Cadastre um novo cliente e as informações específicas de cada área</DialogDescription>
                        </>)
                    }</DialogHeader>
                    <ClienteForm client={dialog?.client} onConfirm={() => closeDialog()} />
                </DialogContent>
            </Dialog>
        </section>
    )
}