import { FullConfig } from '@playwright/test';
import { execSync } from 'node:child_process';
import { loginAndSaveState } from './login-api';

export default async function globalSetup(_: FullConfig) {
  execSync('npm run test:db:reset', { stdio: 'inherit' });
  execSync('npm run test:db:seed', { stdio: 'inherit' });

  await loginAndSaveState('b2c', 'tests/e2e/_setup/state-b2c.json');
  await loginAndSaveState('b2b_user', 'tests/e2e/_setup/state-b2b_user.json');
  await loginAndSaveState('b2b_admin', 'tests/e2e/_setup/state-b2b_admin.json');
}
