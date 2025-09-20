import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createRequire } from 'module';

// Ensure esbuild binary version matches the JS API used by vite/vitest.
// When the repository has multiple versions of esbuild installed (one
// hoisted at the project root and another inside vite's node_modules),
// vitest may load the JS API for one version while executing the binary of
// another. This mismatch causes the tests to crash before running. By
// resolving the binary relative to vite and pointing `ESBUILD_BINARY_PATH`
// to it, we guarantee that the JS and binary versions stay in sync.
const require = createRequire(import.meta.url);
if (!process.env.ESBUILD_BINARY_PATH) {
  process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild/bin/esbuild', {
    paths: [require.resolve('vite')],
  });
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@/routes': path.resolve(process.cwd(), './src/lib/routes.ts'),
      '@/routerV2': path.resolve(process.cwd(), './src/lib/routerV2'),
      '@/routerV2/routes.config': path.resolve(process.cwd(), './src/lib/routerV2/routes.config.ts'),
      '@/guards': path.resolve(process.cwd(), './src/lib/routerV2/guards.ts'),
      '@sentry/nextjs': path.resolve(process.cwd(), './src/test/mocks/sentry-nextjs.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'supabase/',
        'docs/'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 85,
          statements: 85
        }
      }
    }
  },
});