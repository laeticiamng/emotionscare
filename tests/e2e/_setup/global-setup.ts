import { FullConfig } from '@playwright/test';
import { execSync } from 'node:child_process';
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
  }
}
