import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Savings Calculator',
        short_name: 'SavingsCalc',
        description: 'Multi-lingual savings calculator with interactive charts',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@server": path.resolve(__dirname, "./server"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@hooks": path.resolve(__dirname, "./client/src/hooks"),
      "@components": path.resolve(__dirname, "./client/src/components"),
      "@lib": path.resolve(__dirname, "./client/src/lib"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    host: process.env.NODE_ENV === "production" ? "0.0.0.0" : undefined,
    port: 5173,
    hmr: {
      clientPort: process.env.NODE_ENV === "production" ? 443 : undefined,
      protocol: process.env.NODE_ENV === "production" ? "wss" : undefined,
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-hook-form", "zod", "wouter"],
  },
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          form: ["react-hook-form", "@hookform/resolvers"],
          ui: ["@/components/ui"],
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
