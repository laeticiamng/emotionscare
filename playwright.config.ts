import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  globalSetup: 'tests/e2e/_setup/global-setup.ts',
  use: { baseURL: process.env.PW_BASE_URL ?? 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'b2c-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2c.json' } },
    { name: 'b2b-user-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_user.json' } },
    { name: 'b2b-admin-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_admin.json' } },
  ],
});
