import { api, request } from "#lib/api";

export async function getAvailableRoles() {
    return (await request(
        () => api.get(`/user-roles`),
        `Não foi possível obter listagem de usuários`
    )).data.data;
}