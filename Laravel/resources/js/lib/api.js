import axios from "axios";
import { ApiError } from "#lib/errors";

function normalizeError(error) {
    const response = error?.response;
    const body = response?.data;

    if (!response)
        return new ApiError("Não foi possível conectar ao servidor.", { originalError: error });

    const data = body?.data;

    const details = {
        status: response.status,
        originalError: error,
    };

    if (Array.isArray(body?.trace))
        details.trace = body.trace;

    if (body?.exception)
        details.exception = body.exception;

    if (body?.message)
        details.backendMessage = body?.message;

    if (typeof data === "string") {
        const e = new ApiError(data, details);
        console.error(e, details);
        return e;
    }

    if (data && typeof data === "object") {
        details.errors = data;
        const e = new ApiError(Object.values(data).flat()[0] ?? "Ocorreu um erro.", details);
        console.error(e, details);
        return e;
    }

    const e = new ApiError("Ocorreu um erro ao processar a solicitação.", details);
    console.error(e, details);
    return e;
}

function configure(instance) {
    instance.interceptors.response.use(
        response => {
            if (response.data?.status === "failed")
                throw normalizeError({ response });
            return response;
        },
        error => { throw normalizeError(error); },
    );
    return instance;
}

export const api = configure(axios.create({
    baseURL: '/api',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
    },
}));

export const authApi = configure(axios.create({
    baseURL: '/',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
    },
}));

export async function request(callback, error_msg) {
    try {
        return await callback();
    } catch (error) {
        throw error.withFallback?.(error_msg) ?? error;
    }
}
