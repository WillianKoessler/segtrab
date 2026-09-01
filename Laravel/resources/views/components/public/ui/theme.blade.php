<div>
    <button class="visible dark:hidden block font-medium text-stone-800 rounded-full hover:bg-stone-200 focus:outline-hidden focus:bg-stone-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            type="button"
            data-theme-click="dark">
        <span class="group inline-flex shrink-0 justify-center items-center size-7">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
        </span>
    </button>
    <button class="hidden dark:visible block font-medium text-stone-800 rounded-full hover:bg-stone-200 focus:outline-hidden focus:bg-stone-200 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            type="button"
            data-theme-click="light">
        <span class="group inline-flex shrink-0 justify-center items-center size-7">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
        </span>
    </button>
</div>

@pushOnce('scripts')
    <script>
        (() => {
            const STORAGE_KEY = 'dark-theme';

            function setTheme(theme) {
                const darkButtons = document.querySelectorAll('button[data-theme-click="dark"]');
                const lightButtons = document.querySelectorAll('button[data-theme-click="light"]');

                const getStoredTheme = () => {
                    const value = localStorage.getItem(STORAGE_KEY);
                    return (value === 'light' || value === 'dark' || value === 'system') ? value : "system";
                }

                const setStoredTheme = theme => {
                    localStorage.setItem(STORAGE_KEY, theme);
                }

                const getSystemTheme = () => {
                    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                }

                const getResolvedTheme = theme => {
                    return theme === "system" ? getSystemTheme() : theme;
                }

                const applyTheme = theme => {
                    const resolved = getResolvedTheme(theme);
                    const root = document.documentElement;

                    const isLight = resolved === "light";
                    const isDark = resolved === "dark";

                    darkButtons.forEach(button => {
                        button.classList.toggle('hidden', isDark);
                    });
                    lightButtons.forEach(button => {
                        button.classList.toggle('hidden', isLight);
                    });

                    root.classList.toggle("dark", resolved === "dark");
                    root.classList.toggle("light", resolved === "light");
                    root.style.colorScheme = resolved;
                }

                if (!theme)
                    theme = getStoredTheme();

                applyTheme(theme);
                setStoredTheme(theme);
            }

            document.addEventListener("DOMContentLoaded", () => {
                const savedTheme = localStorage.getItem(STORAGE_KEY) ?? 'light';
                setTheme(savedTheme);
                document.querySelectorAll('[data-theme-click]').forEach(element => element.addEventListener('click', e => setTheme(element.dataset.themeClick)));
            });
        })
        ()
    </script>
@endPushOnce
