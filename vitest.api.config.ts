import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['services/journal/tests/**/*.ts', 'services/scan/tests/**/*.ts']
  }
});
