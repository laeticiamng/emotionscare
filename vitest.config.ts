import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',      // évite jsdom par défaut
    setupFiles: ['./vitest.setup.ts'],
  },
});
