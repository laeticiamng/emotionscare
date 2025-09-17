import { defineConfig } from 'vitest/config';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
if (!process.env.ESBUILD_BINARY_PATH) {
  process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild/bin/esbuild', {
    paths: [require.resolve('vite')],
  });
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['services/api/tests/**/*.test.ts'],
    maxThreads: 1,
    minThreads: 1,
    sequence: { hooks: 'list', files: 'serial' },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
      reportsDirectory: 'reports/api-tests-coverage',
    },
  },
});
