import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    clearStoredAuth,
    getStoredToken,
    getStoredTokenExpiresAt,
} from "../../../js/lib/api";
import {
    getCurrentUser,
    login as authLogin,
    logout as authLogout,
} from "../../../js/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const expiryTimerRef = useRef(null);

    const clearAuth = useCallback(() => {
        if (expiryTimerRef.current) {
            window.clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }

        clearStoredAuth();
        setCurrentUser(null);
    }, []);

    const scheduleExpiry = useCallback(() => {
        if (expiryTimerRef.current) {
            window.clearTimeout(expiryTimerRef.current);
        }

        const expiresAt = getStoredTokenExpiresAt();
        if (!expiresAt) {
            return;
        }

        const expiresIn = Date.parse(expiresAt) - Date.now();

        if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
            clearAuth();
            return;
        }

        expiryTimerRef.current = window.setTimeout(() => {
            clearAuth();
        }, expiresIn + 250);
    }, [clearAuth]);

    const fetchUser = useCallback(async () => {
        try {
            if (!getStoredToken()) {
                setCurrentUser(null);
                return null;
            }

            const user = await getCurrentUser();
            setCurrentUser(user);
            scheduleExpiry();
            return user;
        } catch (error) {
            clearAuth();
            throw error;
        } finally {
            setAuthLoading(false);
        }
    }, [clearAuth, scheduleExpiry]);

    const login = useCallback(async (credentials) => {
        const result = await authLogin(credentials);
        setCurrentUser(result.user);
        scheduleExpiry();
        setAuthLoading(false);
        return result.user;
    }, [scheduleExpiry]);

    const logout = useCallback(async () => {
        try {
            await authLogout();
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    useEffect(() => {
        fetchUser().catch(() => {});

        return () => {
            if (expiryTimerRef.current) {
                window.clearTimeout(expiryTimerRef.current);
            }
        };
    }, [fetchUser]);

    useEffect(() => {
        const handleStorage = event => {
            if (
                event.key === "segsys.auth.token" ||
                event.key === "segsys.auth.expires_at"
            ) {
                if (!getStoredToken()) {
                    setCurrentUser(null);
                    setAuthLoading(false);
                } else {
                    fetchUser().catch(() => {});
                }
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [fetchUser]);

    const value = useMemo(
        () => ({
            authLoading,
            currentUser,
            login,
            logout,
            reloadUser: fetchUser,
        }),
        [authLoading, currentUser, login, logout, fetchUser],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
