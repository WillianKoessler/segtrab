import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    base: '/app/',
    plugins: [
        laravel({
            input: [
                'resources/segsys/main.jsx',
                'resources/segsys/styles/globals.css',
                'resources/css/styles.css',
                'resources/aep/script.js',
            ],
            publicDirectory: '../public_html',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
});
