import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: 'tests/e2e/_setup/global-setup.ts',
  reporter: [
    ['list'],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['html', { outputFolder: 'reports/html' }],
  ],
  use: {
    baseURL: process.env.PW_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'b2c-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2c.json' } },
    { name: 'b2b-user-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_user.json' } },
    { name: 'b2b-admin-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_admin.json' } },
  ],
});
