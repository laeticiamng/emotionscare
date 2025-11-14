import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from "lovable-tagger";
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';
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
    dyadComponentTagger(),
    react({
      // Désactiver le fast refresh pour les edge functions
      exclude: /supabase\/functions/,
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './types'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: mode === 'production' ? false : true,
    chunkSizeWarningLimit: 500, // 500KB warning
    // Ignorer les erreurs TypeScript des edge functions
    rollupOptions: {
      external: (id) => id.includes('supabase/functions') || id.includes('supabase/tests'),
      output: {
        manualChunks: {
          // Vendor chunks - Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI framework chunks
          'ui-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-slider',
            '@radix-ui/react-progress',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-select',
            '@radix-ui/react-dropdown-menu',
          ],

          // Data management
          'data-vendor': ['@tanstack/react-query', '@supabase/supabase-js', 'zod'],

          // Animation
          'animation-vendor': ['framer-motion'],

          // Charts
          'charts-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],

          // Music module chunks
          'music-player': [
            './src/components/music/UnifiedMusicPlayer',
            './src/hooks/music/useAudioPlayer',
          ],
          'music-generator': [
            './src/components/music/EmotionalMusicGenerator',
            './src/services/music/enhanced-music-service',
          ],
          'music-quota': [
            './src/services/music/quota-service',
            './src/hooks/music/useUserQuota',
            './src/components/music/QuotaIndicator',
          ],
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
