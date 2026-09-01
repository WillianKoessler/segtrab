import { api, request } from "#lib/api";

export async function getRoles() {
    return (await request(
        () => api.get("/roles"),
        "Não foi possível obter os grupos"
    )).data;
}

export async function createRole(payload) {
    return (await request(
        () => api.post("/roles", payload),
        "Não foi possível criar o grupo"
    )).data;
}

export async function updateRole(id, payload) {
    return (await request(
        () => api.put(`/roles/${id}`, payload),
        "Não foi possível editar o grupo"
    )).data;
}

export async function deleteRole(id) {
    return (await request(
        () => api.delete(`/roles/${id}`),
        "Não foi possível remover o grupo"
    )).data;
}

export async function getPermissions() {
    return (await request(
        () => api.get("/permissions"),
        "Não foi possível obter as permissões"
    )).data;
}

export async function createPermission(payload) {
    return (await request(
        () => api.post("/permissions", payload),
        "Não foi possível criar a permissão"
    )).data;
}

export async function updatePermission(id, payload) {
    return (await request(
        () => api.put(`/permissions/${id}`, payload),
        "Não foi possível editar a permissão"
    )).data;
}

export async function deletePermission(id) {
    return (await request(
        () => api.delete(`/permissions/${id}`),
        "Não foi possível remover a permissão"
    )).data.data;
}
