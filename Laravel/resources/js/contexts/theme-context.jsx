import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    applyTheme,
    getResolvedTheme,
    getStoredTheme,
    getSystemTheme,
    setStoredTheme,
} from "@/lib/theme";

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [theme, _setTheme] = useState("system");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const initial = getStoredTheme();
        _setTheme(initial);
        applyTheme(initial);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            if (theme === "system") {
                applyTheme("system");
            }
        };

        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [theme, mounted]);

    const setTheme = (nextTheme) => {
        _setTheme(nextTheme);
        setStoredTheme(nextTheme);
        applyTheme(nextTheme);
    };

    const value = useMemo (
        () => ({
            theme,
            resolvedTheme: getResolvedTheme(theme),
            setTheme,
        }),
        [theme]
    );

    // Optional: avoid hydration mismatch flash by rendering nothing until mounted
    if (!mounted) return null;

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}