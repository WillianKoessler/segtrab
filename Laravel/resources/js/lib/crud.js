import { api, request } from "#lib/api";

export function createCrudApi({
    path,
    labels = {},
}) {
    const singular = labels.singular ?? "registro";

    const unwrapItem = response =>
        response?.data?.data ??
        response?.data ??
        response;

    const unwrapList = response => {
        const body = response?.data ?? response;

        return Array.isArray(body)
            ? { items: body, meta: null }
            : { items: Array.isArray(body?.data) ? body.data : [], meta: body?.meta ?? null };
    };

    return {
        async list(params = {}) {
            const response = await request(
                () => api.get(path, { params }),
                `Nãe foi possível obter a listagem de ${labels.plural ?? `${singular}s`}`
            );
            return unwrapList(response);
        },

        async get(id) {
            if (id === undefined || id === null || id === "")
                throw new Error(`É obrigatório fornecer um id para consultar ${singular}`);

            const response = await request(
                () => api.get(`${path}/${id}`),
                `Não foi possível obter ${singular} #${id}`,
            );

            return unwrapItem(response);
        },

        async create(payload) {
            const response = await request(
                () => api.post(path, payload),
                `Não foi possível criar ${singular}`
            );

            return unwrapItem(response);
        },

        async update(id, payload) {
            const response = await request(
                () => api.put(`${path}/${id}`, payload),
                `Não foi possível editar ${singular}`,
            );
            return unwrapItem(response);
        },

        async remove(id) {
            const response = await request(
                () => api.delete(`${path}/${id}`),
                `Não foi possível remover ${singular} #${id}`,
            );
            return unwrapItem(response);
        },
    };
}
