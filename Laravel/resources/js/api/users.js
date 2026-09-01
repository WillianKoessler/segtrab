import { api, request } from "#lib/api";

export async function getUsers(params = {}) {
    return (await request(
        () => api.get('/users', { params }),
        "Não foi possível obter a listagem de usuários"
    )).data.data;
}

export async function getUser(id) {
    return (await request(
        () => api.get(`/users/${id}`),
        `Não foi possível obter o usuário #${id}`
    )).data.data;
}

export async function createUser(payload) {
    return (await request(
        () => api.post("/users", payload),
        "Não foi possível criar o usuário"
    )).data.data;
}

export async function updateUser(id, payload) {
    return (await request(
        () => api.put(`/users/${id}`, payload),
        "Não foi possível editar o usuário"
    )).data.data;
}

export async function deleteUser(id) {
    return (await request(
        () => api.delete(`/users/${id}`),
        `Não foi possível remover o usuário #${id}`
    )).data.data;
}

export async function resetUserPassword(id, password) {
    return (await request(
        () => api.post(`/users/${id}/reset-password`, { password }),
        "Não foi possível resetar a senha do usuário."
    ));
}
