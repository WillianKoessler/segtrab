import { api, request } from "#lib/api";
import { sleep } from "#lib/utils";

window.mock = {
    clients: [
        {
            id: 0,
            type: "cnpj",
            name: "Fulano de tal",
            trade_name: "",
            document: '01.234.567/0001-89',
            email: "",
            phone: "",
            is_active: true,
            notes: "",

            financial: {
                billing_name: "",
                billing_email: "",
                payment_terms_days: "",
                notes: "",
            },

            sst: {
                technical_responsible: "",
                service_status: "",
                notes: "",
            },

            clinical: {
                responsible_contact: "",
                notes: "",
            },

            engineering: {
                technical_responsible: "",
                service_status: "",
                notes: "",
            },
        },
        {
            id: 1,
            type: "cnpj",
            name: "Beltrano da Silva",
            trade_name: "",
            document: 'document',
            email: "",
            phone: "",
            is_active: true,
            notes: "",

            financial: {
                billing_name: "",
                billing_email: "",
                payment_terms_days: "",
                notes: "",
            },

            sst: {
                technical_responsible: "",
                service_status: "",
                notes: "",
            },

            clinical: {
                responsible_contact: "",
                notes: "",
            },

            engineering: {
                technical_responsible: "",
                service_status: "",
                notes: "",
            },
        }
    ]
};

async function randomDelay() {
    await sleep(Math.random() * 1000);
}

export async function getClients({
    search = "",
    page = 1,
    perPage = 15,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
    });

    if (search.trim())
        params.set("search", search.trim());


    if (!!mock) {
        // Add random sleep to simulate network latency
        await randomDelay();
        let clients = mock.clients;
        if (search)
            clients = mock.clients.filter(client => {
                let smallestLength = client.name.length > search.length ? search.length : client.name.length;
                return client.name.substring(0, smallestLength).toLowerCase() === search.substring(0, smallestLength).toLowerCase();
            });
        return { data: clients };
    }

    return (await request(
        () => api.get('/clients', { params }),
        "Não foi possível obter a listagem de clientes"
    )).data.data;
}

export async function getClient(id) {
    if (!!window.mock) {
        await randomDelay();
        const match = window.mock.clients.find(stored => stored.id === id);
        return { data: match };
    }

    return (await request(
        () => api.get(`/clients/${id}`),
        `Não foi possível obter informações do cliente #${id}`
    )).data.data;
}

export async function createClient(payload) {
    if (!!window.mock) {
        await randomDelay();

        if (!payload?.document)
            throw new Error("Preencher o documento é obrigatório.");

        if (window.mock.clients.some(stored => stored.document === payload.document))
            throw new Error("Já existe um cliente com este documento.");

        window.mock.clients.push(payload);
        payload.id = window.mock.clients.length;
        return { data: true };
    }

    return (await request(
        () => api.post("/clients", payload),
        "Não foi possível criar o cliente"
    )).data.data;
}

export async function updateClient(id, payload) {
    if (!!window.mock) {
        await randomDelay();

        const match = window.mock.clients.find(stored => stored.id === id);
        if (!match)
            throw new Error("Não existe um cliente com este id");

        Object.assign(match, payload);
        return { data: true };
    }

    return (await request(
        () => api.put(`/clients/${id}`, payload),
        "Não foi possível editar o cliente"
    )).data.data;
}

export async function deleteClient(id) {
    if (!!window.mock) {
        await randomDelay();
        window.mock.clients = window.mock.clients.filter(stored => stored.id !== id);
        return { data: window.mock.clients };
    }

    return (await request(
        () => api.delete(`/clients/${id}`),
        `Não foi possível remover o cliente #${id}`
    )).data.data;
}
