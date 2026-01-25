import { test, expect } from '@playwright/test';

test('Token expiré → redirection login', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('auth_token', 'expired.invalid'));
  await page.goto('/app/home');
  await expect(page).toHaveURL(/\/login/);
});
