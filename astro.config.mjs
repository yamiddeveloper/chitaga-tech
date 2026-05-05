import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: 'https://chitaga.tech',
    server: { 
        port: 4323,
        host: true,
    },
    integrations: [react(), sitemap()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: true,
            proxy: {
                '/api': 'http://localhost:4324',
            },
        },
    },
});
