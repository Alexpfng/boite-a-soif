import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vite + PWA : tout est précaché pour un fonctionnement 100 % hors ligne.
// Le SW n'est enregistré qu'en production publiée (voir src/main.tsx).
export default defineConfig({
  server: { host: '::', port: 8080 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      filename: 'sw.js',
      devOptions: { enabled: false },
      includeAssets: ['favicon-*.png', 'apple-touch-icon.png', 'icons/*.png', 'brand/*.png', '.htaccess'],
      manifest: {
        name: 'Boîte à Soif',
        short_name: 'Boîte à Soif',
        description:
          "L'appli qui met l'ambiance au bar : jeux, blagues, chansons à reprendre et toasts pour trinquer. En gros et à voix haute, pour rigoler ensemble à tout âge.",
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        background_color: '#F5F0EA',
        theme_color: '#0F3A4A',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'pages' },
          },
          {
            urlPattern: /\/audio\/.*\.mp3$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              rangeRequests: true,
              expiration: { maxEntries: 5 },
            },
          },
        ],
      },
    }),
  ],
  build: { target: 'es2019' },
});
