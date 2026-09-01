import { api, authApi, request } from "#lib/api";


export async function getCurrentUser() {
    return (await request(
        () => api.get("/user"),
        "Não foi possível obter as informações do usuário atual"
    )).data;
}

export async function login({email, password, remember = false}) {
    await authApi.get('/sanctum/csrf-cookie');

    const { data } = await authApi.post('/login', { email, password, remember });

    return data.user;
}

export async function logout() {
    await api.post('/logout');
}