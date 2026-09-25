import { createCrudApi } from "#lib/crud";

export const clientApi = createCrudApi({
    path: "/clients",
    labels: {
        singular: "cliente",
        plural: "clientes",
    }
});

export const getClients = async params => {
    const result = await clientApi.list(params);
    return {
        data: result.items,
        meta: result.meta,
    };
};

export const getClient = clientApi.get;
export const createClient = clientApi.create;
export const updateClient = clientApi.update;
export const deleteClient = clientApi.remove;
