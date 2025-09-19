import tsconfigPaths from 'vite-tsconfig-paths';
// Configuration Vite en JavaScript pur - Évite complètement TypeScript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { execSync } from 'node:child_process';
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// Force disable TypeScript processing completely
process.env.TSC_NONPOLLING_WATCHER = 'false';
process.env.DISABLE_TSC = 'true';

const resolveCommitSha = () => {
  const candidates = [
    process.env.VITE_COMMIT_SHA,
    process.env.SENTRY_RELEASE,
    process.env.GITHUB_SHA,
    process.env.VERCEL_GIT_COMMIT_SHA,
  ].filter(Boolean);

  if (candidates.length > 0) {
    return candidates[0];
  }

  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
};

export default defineConfig(({ mode }) => {
  const enableAnalyzer = (process.env.ANALYZE || '').toLowerCase() === 'true';
  const commitSha = resolveCommitSha();
  const releaseName = `emotionscare@${commitSha}`;
  const enableSentryPlugin =
    !!process.env.SENTRY_AUTH_TOKEN &&
    !!process.env.SENTRY_ORG &&
    !!process.env.SENTRY_PROJECT &&
    mode !== 'development';

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      tsconfigPaths(),
      react({
        // Configuration React sans TypeScript du tout
        typescript: false
      }),
      mode === 'development' && componentTagger(),
      enableAnalyzer && visualizer({
        filename: 'reports/bundle-analysis.html',
        template: 'sunburst',
        gzipSize: true,
        brotliSize: true,
      }),
      enableSentryPlugin &&
        sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          release: releaseName,
          telemetry: false,
          sourcemaps: {
            assets: './dist/**',
            ignore: ['node_modules'],
          },
        }),
    ].filter(Boolean),

    // Force disable all TypeScript processing
    define: {
      'process.env.TSC_COMPILE_ON_ERROR': 'false',
      'process.env.SKIP_TYPE_CHECK': 'true',
      __APP_COMMIT_SHA__: JSON.stringify(commitSha),
    },

    preview: {
      port: 4173,
      host: "::"
    },

    resolve: {
      alias: {
        "@": resolve(process.cwd(), "./src"),
      },
    },

    build: {
      target: 'esnext',
      sourcemap: mode === 'development' ? 'inline' : true,
      cssCodeSplit: true,
      minify: 'esbuild',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-toast',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs'
            ],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            charts: ['recharts', 'chart.js', 'react-chartjs-2'],
            motion: ['framer-motion', 'lottie-react'],
            supabase: ['@supabase/supabase-js', '@tanstack/react-query']
          },
          chunkFileNames: () => 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          }
        }
      }
    },

    // Pure esbuild transformation - bypass complet TypeScript
    esbuild: {
      target: 'esnext',
      jsx: 'automatic',
      keepNames: true,
      logLevel: 'silent'
    },

    // Optimisations pour éviter les conflits
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
        jsx: 'automatic'
      }
    }
  };
});