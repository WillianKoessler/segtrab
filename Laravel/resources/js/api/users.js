import { api, request } from "#lib/api";
import { createCrudApi } from "#lib/crud";

export const userApi = createCrudApi({
    path: "/users",
    labels: {
        singular: "usuário",
        plural: "usuários",
    },
});

export async function getUsers(params = {}) {
    const result = await userApi.list(params);
    return {
        data: result.items,
        meta: result.meta,
    };
}

export const getUser = userApi.get;
export const createUser = userApi.create;
export const updateUser = userApi.update;
export const deleteUser = userApi.remove;

export async function resetUserPassword(id, password) {
    return (await request(
        () => api.post(`/users/${id}/reset-password`, { password }),
        "Não foi possível resetar a senha do usuário.",
    )).data;
}
