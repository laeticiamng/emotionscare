import { defineConfig } from 'vitest/config';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
if (!process.env.ESBUILD_BINARY_PATH) {
  process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild/bin/esbuild', {
    paths: [require.resolve('vitest')],
  });
}

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['services/**/*.test.ts'],
    watch: false,
  },
});

