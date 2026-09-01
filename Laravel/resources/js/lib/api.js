import axios from "axios";
import { ApiError } from "#lib/errors";

export const AUTH_TOKEN_KEY = "segsys.auth.token";
export const AUTH_EXPIRES_AT_KEY = "segsys.auth.expires_at";

export function getStoredToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredTokenExpiresAt() {
    return localStorage.getItem(AUTH_EXPIRES_AT_KEY);
}

export function clearStoredAuth() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
}

function isStoredTokenExpired() {
    const expiresAt = getStoredTokenExpiresAt();
    if (!expiresAt) {
        return false;
    }

    const timestamp = Date.parse(expiresAt);
    return Number.isFinite(timestamp) && timestamp <= Date.now();
}

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
        details.backendMessage = body.message;

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
    instance.interceptors.request.use(config => {
        const token = getStoredToken();

        if (token && isStoredTokenExpired()) {
            clearStoredAuth();
            return config;
        }

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    instance.interceptors.response.use(
        response => {
            if (response.data?.status === "failed")
                throw normalizeError({ response });
            return response;
        },
        error => {
            if (
                error?.response?.status === 401 &&
                !error?.config?.skipAuthRedirect
            ) {
                clearStoredAuth();

                if (window.location.pathname !== "/app/login") {
                    window.location.replace("/app/login");
                }
            }

            throw normalizeError(error);
        },
    );

    return instance;
}

export const api = configure(axios.create({
    baseURL: "/api",
    headers: {
        Accept: "application/json",
    },
}));

export async function request(callback, error_msg) {
    try {
        return await callback();
    } catch (error) {
        throw error.withFallback?.(error_msg) ?? error;
    }
}
