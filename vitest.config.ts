import { defineConfig } from 'vitest/config';
import path from 'node:path';
import 'ts-node/register';
import 'tsconfig-paths/register';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', './test/setupTests.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
