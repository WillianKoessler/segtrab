import { api, clearStoredAuth, getStoredToken } from "#lib/api";

export async function getCurrentUser() {
    return (await api.get("/user")).data.data;
}

export async function login({ email, password, captchaToken }) {
    const { data } = await api.post(
        "/login",
        {
            email,
            password,
            ...(captchaToken ? { "cf-turnstile-response": captchaToken } : {}),
        },
        { skipAuthRedirect: true },
    );

    localStorage.setItem("segsys.auth.token", data.token);
    localStorage.setItem("segsys.auth.expires_at", data.expires_at);

    return data;
}

export async function logout() {
    try {
        if (getStoredToken()) {
            await api.post("/logout", null, { skipAuthRedirect: true });
        }
    } finally {
        clearStoredAuth();
    }
}
