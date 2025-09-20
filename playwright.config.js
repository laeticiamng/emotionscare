import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/e2e/**/*.spec.ts', 'e2e/**/*.spec.ts'],
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
    { name: 'b2b_user-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_user.json' } },
    { name: 'b2b_admin-chromium', use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/_setup/state-b2b_admin.json' } },
  ],
});
