import { test, expect } from '@playwright/test';

test.describe('Auth Guards', () => {
  test('anonymous user on /app/* redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/app/home');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('anonymous user on /app/scan redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/app/scan');
    await page.waitForURL(/\/login/, { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('public routes accessible without auth', async ({ page }) => {
    await page.context().clearCookies();
    const publicRoutes = ['/', '/b2c', '/entreprise', '/help', '/login', '/signup'];
    for (const route of publicRoutes) {
      await page.goto(route);
      expect(page.url()).not.toContain('/login');
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    }
  });

  test('b2c user cannot access admin dashboard', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'b2c-chromium') test.skip();
    await page.goto('/app/rh');
    await expect(page).toHaveURL(/403|login/);
  });

  test('expired token redirects to login', async ({ page, context }) => {
    await context.addCookies([{ name: 'auth_token', value: 'expired', domain: 'localhost', path: '/' }]);
    await page.goto('/b2c/dashboard');
    await expect(page).toHaveURL(/login/);
  });

  test('authenticated b2c user reaches dashboard', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'b2c-chromium') test.skip();
    await page.goto('/b2c/dashboard');
    await expect(page).not.toHaveURL(/login/);
  });
});
