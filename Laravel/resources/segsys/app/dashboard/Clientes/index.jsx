import { useMemo } from "react";
import { createClientCrudSpec } from "./clienteCrud";
import { clientApi } from "#api/clients";
import CrudPage from "#components/crud/CrudPage";

export default function ClientsPage() {
    const spec = useMemo(
        () => createClientCrudSpec({ resource: clientApi }),
        [],
    );

    return <CrudPage spec={spec} />;
}