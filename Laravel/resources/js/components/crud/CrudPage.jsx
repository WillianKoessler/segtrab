import { useMemo, useState } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";

import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "#components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "#components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "#components/ui/dialog";
import { Skeleton } from "#components/ui/skeleton";

import { useCrud } from "./useCrud";

function getValue(item, path) {
    if (!path)
        return item;

    return String(path).split(".").reduce((value, key) => value?.[key], item);
}

function LoadingRows({ columns }) {
    return Array.from({ length: 3 }, (_, index) => (
        <TableRow key={`crud-loading-${index}`}>
            {columns.map(column => (
                <TableCell key={column.key ?? column.header}>
                    <Skeleton className="h-5 w-28" />
                </TableCell>
            ))}
            <TableCell>
                <Skeleton className="h-8 w-8" />
            </TableCell>
        </TableRow>
    ));
}

export default function CrudPage({ spec }) {
    const {
        title,
        description,
        resource,
        columns = [],
        form: formSpec = {},
        search: searchSpec = {},
        labels = {},
        table: tableSpec = {},
        actions = [],
        emptyMessage,
        onSaved,
        onRemoved,
        getItemKey = item => item?.id,
    } = spec;

    const [searchInput, setSearchInput] = useState("");

    const crud = useCrud(resource, {
        initialQuery: {
            page: 1,
            per_page: tableSpec.perPage ?? 15,
        },
        getItemKey,
    });

    const FormComponent = formSpec.component;
    const singular = labels.singular ?? "registro";
    const plural = labels.plural ?? `${singular}s`;
    const dialogItem = crud.dialog?.item ?? null;

    const availableActions = useMemo(() => {
        return [
            {
                key: "edit",
                label: labels.edit ?? "Editar",
                type: "edit",
                hidden: !FormComponent,
            },
            ...actions,
            {
                key: "delete",
                label: labels.delete ?? "Remover",
                type: "delete",
                hidden: !resource.remove,
                destructive: true,
            },
        ].filter(action => !action.hidden);
    }, [actions, FormComponent, labels.delete, labels.edit, resource.remove]);

    const submitSearch = event => {
        event?.preventDefault();

        const nextSearch = searchInput.trim();
        crud.setSearch(nextSearch);
    };

    const handleRowAction = (action, item) => {
        const hidden = typeof action.hidden === "function"
            ? action.hidden(item, crud)
            : action.hidden;

        if (hidden) {
            return;
        }

        if (action.type === "edit") {
            crud.openEdit(item);
            return;
        }

        if (action.type === "delete") {
            crud.openDelete(item);
            return;
        }

        action.onClick?.(item, crud);
    };

    const handleFormSubmit = async payload => {
        const saved = await crud.save(dialogItem, payload);
        onSaved?.(saved);
        return saved;
    };

    return (
        <section className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>

                <Button onClick={crud.openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    {labels.create ?? `Novo ${singular}`}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <CardTitle>
                                {labels.listTitle ?? `${plural[0].toUpperCase()}${plural.slice(1)} cadastrados`}
                            </CardTitle>
                            <CardDescription>
                                {labels.listDescription ?? `Registros de ${plural}.`}
                            </CardDescription>
                        </div>

                        {searchSpec.enabled !== false && (
                            <form onSubmit={submitSearch} className="flex gap-2">
                                <Input
                                    value={searchInput}
                                    onChange={event => setSearchInput(event.target.value)}
                                    placeholder={searchSpec.placeholder ?? `Pesquisar ${plural}...`}
                                    className="w-[min(18rem,40vw)]"
                                />
                                <Button
                                    type="submit"
                                    variant="outline"
                                    size="icon"
                                    aria-label="Pesquisar"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {crud.error && (
                        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {crud.error.message}
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map(column => (
                                    <TableHead
                                        key={column.key ?? column.header}
                                        className={column.headerClassName}
                                    >
                                        {column.header}
                                    </TableHead>
                                ))}
                                <TableHead className="w-[60px]" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {crud.loading && <LoadingRows columns={columns} />}

                            {!crud.loading && crud.items.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {emptyMessage ?? `Nenhum ${singular} encontrado.`}
                                    </TableCell>
                                </TableRow>
                            )}

                            {!crud.loading && crud.items.map(item => (
                                <TableRow
                                    key={getItemKey(item)}
                                    className={tableSpec.rowClickable ? "cursor-pointer" : undefined}
                                    onClick={() => tableSpec.rowClickable && crud.openEdit(item)}
                                >
                                    {columns.map(column => {
                                        const value = column.value
                                            ? column.value(item)
                                            : getValue(item, column.key);

                                        return (
                                            <TableCell key={column.key ?? column.header}>
                                                {column.render
                                                    ? column.render(value, item)
                                                    : value ?? "—"}
                                            </TableCell>
                                        );
                                    })}

                                    <TableCell onClick={event => event.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Ações de ${singular}`}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end">
                                                {availableActions.map(action => {
                                                    const hidden = typeof action.hidden === "function"
                                                        ? action.hidden(item, crud)
                                                        : action.hidden;

                                                    if (hidden) {
                                                        return null;
                                                    }

                                                    return (
                                                        <DropdownMenuItem
                                                            key={action.key}
                                                            onClick={() => handleRowAction(action, item)}
                                                            className={action.destructive ? "text-destructive focus:text-destructive" : undefined}
                                                        >
                                                            {action.label}
                                                        </DropdownMenuItem>
                                                    );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {crud.meta?.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">
                                Página {crud.meta.current_page ?? crud.query.page} de {crud.meta.last_page}
                                {crud.meta.total != null ? ` · ${crud.meta.total} registros` : ""}
                            </span>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={(crud.meta.current_page ?? crud.query.page) <= 1 || crud.loading}
                                    onClick={() => crud.setPage(
                                        Math.max(1, (crud.meta.current_page ?? crud.query.page) - 1)
                                    )}
                                >
                                    Anterior
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={(crud.meta.current_page ?? crud.query.page) >= crud.meta.last_page || crud.loading}
                                    onClick={() => crud.setPage(
                                        Math.min(
                                            crud.meta.last_page,
                                            (crud.meta.current_page ?? crud.query.page) + 1
                                        )
                                    )}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AlertDialog
                open={crud.dialog?.type === "delete"}
                onOpenChange={open => !open && crud.closeDialog()}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {labels.deleteTitle ?? `Remover ${singular}`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {labels.deleteDescription ??
                                `Esta ação irá remover este ${singular} e não poderá ser desfeita.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                crud.remove(dialogItem)
                                    .then(() => onRemoved?.(dialogItem))
                                    .catch(() => { })
                            }
                            disabled={crud.deleting}
                        >
                            {crud.deleting ? "Removendo..." : "Remover"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {FormComponent && (
                <Dialog
                    open={crud.dialog?.type === "create" || crud.dialog?.type === "edit"}
                    onOpenChange={open => !open && crud.closeDialog()}
                >
                    <DialogContent className={formSpec.dialogClassName ?? "max-h-[90vh] overflow-y-auto sm:max-w-2xl"}>
                        <DialogHeader>
                            <DialogTitle>
                                {crud.dialog?.type === "edit"
                                    ? (formSpec.editTitle ?? `Editar ${singular}`)
                                    : (formSpec.createTitle ?? `Novo ${singular}`)}
                            </DialogTitle>
                            {formSpec.description && (
                                <DialogDescription>{formSpec.description}</DialogDescription>
                            )}
                        </DialogHeader>

                        <FormComponent
                            mode={crud.dialog?.type}
                            item={dialogItem}
                            onSubmit={handleFormSubmit}
                            onCancel={crud.closeDialog}
                            submitting={crud.saving}
                            {...(formSpec.props ?? {})}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}