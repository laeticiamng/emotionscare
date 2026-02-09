import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// Dev taggers conditionally imported
// import { componentTagger } from "lovable-tagger";
// import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // sunburst, treemap, network
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'EmotionsCare - Bien-être émotionnel',
        short_name: 'EmotionsCare',
        description: 'Plateforme complète de bien-être émotionnel avec IA et coaching personnalisé',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        lang: 'fr',
        dir: 'ltr',
        categories: ['health', 'lifestyle', 'productivity'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshot-mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot-desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Accéder au tableau de bord',
            url: '/b2c/dashboard',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Coach IA',
            short_name: 'Coach',
            description: 'Parler avec le coach IA',
            url: '/b2c/dashboard?tab=coach',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
        prefer_related_applications: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/auth\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'openai-api-cache',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(woff|woff2|ttf|eot|otf)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(mp3|wav|m4a|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: process.env.VITE_SW_DEV === 'true',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
    }),
    react({
      // Désactiver le fast refresh pour les edge functions
      exclude: /supabase\/functions/,
    }),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './types'),
      '@emotionscare/contracts': path.resolve(__dirname, './packages/contracts/index.ts'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: mode === 'production' ? false : true,
    chunkSizeWarningLimit: 300, // 300KB warning - stricter threshold
    // Ignorer les erreurs TypeScript des edge functions
    rollupOptions: {
      external: (id) => id.includes('supabase/functions') || id.includes('supabase/tests'),
      output: {
        manualChunks(id) {
          // Core React - loaded on every page
          if (id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-'))) {
            return 'react-vendor';
          }
          if (id.includes('react-router-dom') || id.includes('@remix-run/router')) {
            return 'router-vendor';
          }

          // UI framework - Radix primitives
          if (id.includes('@radix-ui/')) {
            return 'ui-radix';
          }

          // Data layer
          if (id.includes('@tanstack/react-query')) {
            return 'data-query';
          }
          if (id.includes('@supabase/')) {
            return 'data-supabase';
          }
          if (id.includes('/zod/')) {
            return 'data-zod';
          }

          // Animation - deferred
          if (id.includes('framer-motion')) {
            return 'animation-vendor';
          }

          // Charts - lazy loaded
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'charts-chartjs';
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-recharts';
          }

          // 3D / Heavy ML - lazy loaded, never in initial bundle
          if (id.includes('three') || id.includes('@react-three/')) {
            return 'vendor-3d';
          }
          if (id.includes('@mediapipe/') || id.includes('@huggingface/')) {
            return 'vendor-ml';
          }

          // Audio / Music
          if (id.includes('/tone/') || id.includes('hume')) {
            return 'vendor-audio';
          }

          // i18n
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'vendor-i18n';
          }

          // Date utilities
          if (id.includes('date-fns') || id.includes('dayjs')) {
            return 'vendor-date';
          }

          // Misc heavy vendors
          if (id.includes('xlsx')) {
            return 'vendor-xlsx';
          }
          if (id.includes('html2canvas')) {
            return 'vendor-html2canvas';
          }
          if (id.includes('lottie-react') || id.includes('lottie-web')) {
            return 'vendor-lottie';
          }
          if (id.includes('@sentry/')) {
            return 'vendor-sentry';
          }
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          if (id.includes('openai')) {
            return 'vendor-openai';
          }

          // Music module chunks
          if (id.includes('src/components/music/') || id.includes('src/hooks/music/') || id.includes('src/services/music/')) {
            return 'module-music';
          }

          // Admin module chunks
          if (id.includes('src/pages/admin/') || id.includes('src/components/admin/')) {
            return 'module-admin';
          }

          // Gamification module chunks
          if (id.includes('src/pages/gamification/') || id.includes('src/components/gamification/') || id.includes('src/features/leaderboard/')) {
            return 'module-gamification';
          }

          // B2B module chunks
          if (id.includes('src/pages/b2b/') || id.includes('src/components/b2b/')) {
            return 'module-b2b';
          }

          // Journal module chunks
          if (id.includes('src/pages/journal/') || id.includes('src/components/journal/')) {
            return 'module-journal';
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
  },
  // Désactiver le typecheck strict pour ne pas bloquer sur les edge functions
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));
