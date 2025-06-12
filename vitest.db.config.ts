import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['database/tests/**/*.{test,spec}.ts'],
  },
  resolve: {
    alias: {
      'cross-fetch': './tests/polyfills/cross-fetch.ts'
    }
  }
});
