import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Generic state machine for resource CRUD screens.
 *
 * Resource contract:
 *   list(params) -> { items, meta }
 *   get(id)      -> item          (optional)
 *   create(data) -> item
 *   update(id,data) -> item
 *   remove(id)   -> anything
 */
export function useCrud(resource, {
    initialQuery = {},
    autoLoad = true,
    getItemKey = item => item?.id,
} = {}) {
    const [items, setItems] = useState([]);
    const [meta, setMeta] = useState(null);
    const [query, setQuery] = useState(initialQuery);
    const [loading, setLoading] = useState(autoLoad);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [dialog, setDialog] = useState(null);
    const requestId = useRef(0);

    const load = useCallback(async (nextQuery = query) => {
        const id = ++requestId.current;

        try {
            setLoading(true);
            setError(null);

            const result = await resource.list(nextQuery);

            // Ignore stale responses when the user fires two searches quickly.
            if (id !== requestId.current) {
                return result;
            }

            setItems(result?.items ?? []);
            setMeta(result?.meta ?? null);

            return result;
        } catch (loadError) {
            if (id === requestId.current) {
                setError(loadError);
                toast.error(loadError.message);
            }

            throw loadError;
        } finally {
            if (id === requestId.current) {
                setLoading(false);
            }
        }
    }, [resource, query]);

    useEffect(() => {
        if (!autoLoad) {
            return;
        }

        load().catch(() => { });
    }, [autoLoad, load]);

    const openCreate = useCallback(() => {
        setDialog({ type: "create", item: null });
    }, []);

    const openEdit = useCallback((item) => {
        setDialog({ type: "edit", item });
    }, []);

    const openDelete = useCallback((item) => {
        setDialog({ type: "delete", item });
    }, []);

    const closeDialog = useCallback(() => {
        setDialog(null);
    }, []);

    const save = useCallback(async (item, payload) => {
        try {
            setSaving(true);
            setError(null);

            const saved = item
                ? await resource.update(getItemKey(item), payload)
                : await resource.create(payload);

            const savedKey = getItemKey(saved);
            setItems(current => {
                const index = current.findIndex(entry => getItemKey(entry) === savedKey);

                if (index < 0) {
                    return [...current, saved];
                }

                return current.map((entry, entryIndex) =>
                    entryIndex === index ? saved : entry
                );
            });

            toast.success(item ? "Alterações salvas." : "Registro criado.");
            closeDialog();

            return saved;
        } catch (saveError) {
            setError(saveError);
            toast.error(saveError.message);
            throw saveError;
        } finally {
            setSaving(false);
        }
    }, [closeDialog, getItemKey, resource]);

    const remove = useCallback(async (item) => {
        try {
            setDeleting(true);
            setError(null);

            await resource.remove(getItemKey(item));

            const itemKey = getItemKey(item);
            setItems(current =>
                current.filter(entry => getItemKey(entry) !== itemKey)
            );

            toast.success("Registro removido.");
            closeDialog();
        } catch (deleteError) {
            setError(deleteError);
            toast.error(deleteError.message);
            throw deleteError;
        } finally {
            setDeleting(false);
        }
    }, [closeDialog, getItemKey, resource]);

    const setSearch = useCallback((search) => {
        setQuery(current => ({
            ...current,
            page: 1,
            search,
        }));
    }, []);

    const setPage = useCallback((page) => {
        setQuery(current => ({
            ...current,
            page,
        }));
    }, []);

    return useMemo(() => ({
        items,
        meta,
        query,
        setQuery,
        setSearch,
        setPage,
        loading,
        saving,
        deleting,
        error,
        dialog,
        openCreate,
        openEdit,
        openDelete,
        closeDialog,
        load,
        save,
        remove,
    }), [
        items,
        meta,
        query,
        setSearch,
        setPage,
        loading,
        saving,
        deleting,
        error,
        dialog,
        openCreate,
        openEdit,
        openDelete,
        closeDialog,
        load,
        save,
        remove,
    ]);
}