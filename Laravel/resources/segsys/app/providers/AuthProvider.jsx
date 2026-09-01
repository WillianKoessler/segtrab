import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, logout as authLogout } from "../../../js/api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);
            return user;
        } catch(error) {
            setCurrentUser(null);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = async () => {
        await authLogout();
        setCurrentUser(null);
    }

    useEffect(() => {
        fetchUser().catch(reason => {
            // Not authenticated ?
        });
    }, []);

    const value = useMemo(
        () => ({
            authLoading,
            currentUser,
            logout,
            reloadUser: fetchUser,
        }), [currentUser, authLoading]
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