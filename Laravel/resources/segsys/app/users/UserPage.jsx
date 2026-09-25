import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { getAvailableRoles } from "#api/role";
import CrudPage from "#components/crud/CrudPage";
import { createUserCrudSpec } from "./userCrud";
import { userApi } from "#api/users";

export default function UserPage() {
    const { currentUser, authLoading, reloadUser } = useAuth();
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        getAvailableRoles()
            .then(roles => setAvailableRoles(
                [...roles].sort((a, b) => a.id - b.id)
            ))
            .catch(console.error)
    }, [authLoading]);

    const spec = useMemo(() => {
        const nextSpec = createUserCrudSpec({
            resource: userApi,
            availableRoles,
        });
        const originalOnSaved = nextSpec.onSaved;
        nextSpec.onSaved = saved => {
            originalOnSaved?.(saved);

            if (saved?.id === currentUser?.id)
                reloadUser();
        };

        return nextSpec;
    }, [availableRoles, currentUser?.id, reloadUser]);

    return <CrudPage spec={spec} />;
}