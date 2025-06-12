import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'services/journal/tests/**/*.ts',
      'services/scan/tests/**/*.ts',
      'services/gam/tests/**/*.ts',
      'services/vr/tests/**/*.ts',
      'services/breath/tests/**/*.ts',
      'services/account/tests/**/*.ts',
      'services/privacy/tests/**/*.ts',
      'tests/api/**/*.ts'
    ]
  },
  resolve: {
    alias: {
      'cross-fetch': './tests/polyfills/cross-fetch.ts'
    }
  }
});
