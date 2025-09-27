#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const requiredEnv = ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`\u274c  Sentry upload aborted: missing ${missing.join(', ')}`);
  process.exit(1);
}

const release =
  process.env.SENTRY_RELEASE ??
  process.env.VITE_SENTRY_RELEASE ??
  process.env.VITE_APP_VERSION ??
  process.env.VITE_COMMIT_SHA ??
  process.env.GITHUB_SHA ??
  process.env.VERCEL_GIT_COMMIT_SHA;

if (!release) {
  console.warn('⚠️  No release identifier detected, skipping source map upload.');
  process.exit(0);
}

const environment = process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development';
const distDir = process.env.SENTRY_BUILD_DIR ?? 'dist';
const absoluteDist = path.resolve(process.cwd(), distDir);

if (!fs.existsSync(absoluteDist)) {
  console.error(`\u274c  Build directory "${absoluteDist}" introuvable. Lancez "npm run build" avant l\'upload.`);
  process.exit(1);
}

const runCli = (args, allowFailure = false) => {
  const result = spawnSync('npx', ['--yes', 'sentry-cli', ...args], {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.status !== 0 && !allowFailure) {
    throw new Error(`sentry-cli ${args.join(' ')} exited with code ${result.status}`);
  }

  return result.status;
};

const baseArgs = ['--org', process.env.SENTRY_ORG, '--project', process.env.SENTRY_PROJECT];

try {
  const infoStatus = runCli([...baseArgs, 'releases', 'info', release], true);
  if (infoStatus !== 0) {
    runCli([...baseArgs, 'releases', 'new', release]);
  }

  runCli([...baseArgs, 'releases', 'set-commits', '--auto', release]);
  runCli([
    ...baseArgs,
    'releases',
    'files',
    release,
    'upload-sourcemaps',
    absoluteDist,
    '--rewrite',
    '--strip-common-prefix',
    process.cwd(),
  ]);
  runCli([...baseArgs, 'releases', 'finalize', release]);
  runCli([...baseArgs, 'releases', 'deploys', release, 'new', '--env', environment], true);

  console.log(`✅  Source maps envoyées sur Sentry pour la release ${release} (${environment}).`);
} catch (error) {
  console.error('❌  Échec de l\'upload des source maps:', error instanceof Error ? error.message : error);
  process.exit(1);
}
