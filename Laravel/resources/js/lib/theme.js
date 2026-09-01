// resources/js/lib/theme.js
const STORAGE_KEY = "theme";

export function getStoredTheme() {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark" || value === "system") {
        return value;
    }
    return "system";
}

export function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
}

export function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResolvedTheme(theme) {
    return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme) {
    const resolved = getResolvedTheme(theme);
    const root = document.documentElement;

    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
}