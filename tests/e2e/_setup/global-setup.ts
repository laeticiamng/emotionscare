import { FullConfig } from '@playwright/test';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loginAndSaveState } from './login-api';

const shouldSkip = (value: string | undefined) =>
  typeof value === 'string' && ['1', 'true', 'yes'].includes(value.toLowerCase());

const loginRoles = [
  { role: 'b2c' as const, state: 'tests/e2e/_setup/state-b2c.json' },
  { role: 'b2b_user' as const, state: 'tests/e2e/_setup/state-b2b_user.json' },
  { role: 'b2b_admin' as const, state: 'tests/e2e/_setup/state-b2b_admin.json' },
];

export default async function globalSetup(_: FullConfig) {
  const skipDbSetup = shouldSkip(process.env.PLAYWRIGHT_SKIP_DB_SETUP);
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  if (!skipDbSetup && hasDatabaseUrl) {
    execSync('npm run test:db:reset', { stdio: 'inherit' });
    execSync('npm run test:db:seed', { stdio: 'inherit' });
  } else {
    console.info('[global-setup] Skipping database reset/seed');
  }

  if (shouldSkip(process.env.PLAYWRIGHT_SKIP_LOGIN)) {
    console.info('[global-setup] Skipping login state generation');
    return;
  }

  for (const { role, state } of loginRoles) {
    const emailKey = `PW_${role.toUpperCase()}_EMAIL`;
    const passwordKey = `PW_${role.toUpperCase()}_PASSWORD`;
    const emailEnv = process.env[emailKey];
    const passwordEnv = process.env[passwordKey];

    if (!emailEnv || !passwordEnv) {
      console.info(`[global-setup] Missing credentials for ${role}, keeping existing storage state.`);
      continue;
    }

    await loginAndSaveState(role, state);
const STATE_PATHS = {
  b2c: 'tests/e2e/_setup/state-b2c.json',
  b2b_user: 'tests/e2e/_setup/state-b2b_user.json',
  b2b_admin: 'tests/e2e/_setup/state-b2b_admin.json',
} as const;

type Role = keyof typeof STATE_PATHS;

function hasCredentials(role: Role) {
  const email = process.env[`PW_${role.toUpperCase()}_EMAIL`];
  const password = process.env[`PW_${role.toUpperCase()}_PASSWORD`];
  return Boolean(email && password);
}

function ensureEmptyState(role: Role) {
  const file = resolve(STATE_PATHS[role]);
  writeFileSync(file, `${JSON.stringify({})}\n`);
  console.log(`[playwright] Skipping login for ${role}; credentials not provided.`);
}

function hasPsqlBinary() {
  try {
    execSync('psql --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    if (process.env.CI) {
      console.error('[playwright] Missing required dependency: psql');
    } else {
      console.log('[playwright] psql not available, skipping database reset for e2e tests.');
    }
    return false;
  }
}

function shouldPrepareDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('[playwright] DATABASE_URL not set, skipping database reset for e2e tests.');
    return false;
  }

  return hasPsqlBinary();
}

export default async function globalSetup(_: FullConfig) {
  if (shouldPrepareDatabase()) {
    execSync('npm run test:db:reset', { stdio: 'inherit' });
    execSync('npm run test:db:seed', { stdio: 'inherit' });
  }

  for (const role of Object.keys(STATE_PATHS) as Role[]) {
    if (hasCredentials(role)) {
      await loginAndSaveState(role, STATE_PATHS[role]);
    } else {
      ensureEmptyState(role);
    }
  }
}
