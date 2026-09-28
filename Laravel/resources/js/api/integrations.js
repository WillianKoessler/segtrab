import { api, request } from "#lib/api";

export async function getAsaasSettings() {
    return (await request(
        () => api.get("/integrations/asaas"),
        "Não foi possível obter a configuração do Asaas"
    )).data;
}

export async function updateAsaasSettings(payload) {
    return (await request(
        () => api.put("/integrations/asaas", payload),
        "Não foi possível salvar a configuração do Asaas"
    )).data;
}

export async function getFinanceBalance() {
    return (await request(
        () => api.get("/integrations/finance/balance"),
        "Não foi possível consultar o saldo financeiro"
    )).data;
}
