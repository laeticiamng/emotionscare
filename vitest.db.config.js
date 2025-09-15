import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/db/**/*.test.ts'],
  },
});
