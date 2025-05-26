import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'services/journal/tests/**/*.ts',
      'services/scan/tests/**/*.ts',
      'services/gam/tests/**/*.ts',
      'services/vr/tests/**/*.ts',
      'services/breath/tests/**/*.ts',
      'services/privacy/tests/**/*.ts'
    ]
  }
});
