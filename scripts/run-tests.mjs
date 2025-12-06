import { createRequire } from 'module';
import { spawnSync } from 'child_process';

const require = createRequire(import.meta.url);
// Point esbuild to the binary that matches the version bundled with vite.
process.env.ESBUILD_BINARY_PATH = require.resolve('esbuild/bin/esbuild', {
  paths: [require.resolve('vite')],
});

// Spawn vitest directly using Node's executable to avoid PATH resolution
// issues when this script is executed outside of an npm lifecycle hook.
const vitestBin = require.resolve('vitest/vitest.mjs');
const result = spawnSync(process.execPath, [vitestBin, 'run', '--silent'], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
