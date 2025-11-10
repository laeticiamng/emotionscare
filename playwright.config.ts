import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PREVIEW_URL ?? process.env.PW_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/e2e/_setup/global-setup.ts',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 1,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    headless: true,
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  outputDir: 'test-results',
  expect: {
    timeout: 10000,
  },
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
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
