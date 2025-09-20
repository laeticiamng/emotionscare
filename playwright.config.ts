import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PREVIEW_URL ?? process.env.PW_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/_setup/global-setup.ts',
  timeout: 45_000,
  retries: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    headless: true,
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results',
  projects: [
    {
      name: 'b2c-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/_setup/state-b2c.json',
      },
    },
    {
      name: 'b2b_user-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/_setup/state-b2b_user.json',
      },
    },
    {
      name: 'b2b_admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/_setup/state-b2b_admin.json',
      },
    },
  ],
});
