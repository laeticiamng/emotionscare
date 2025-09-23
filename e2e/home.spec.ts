import { test, expect } from '@playwright/test';

test('home hero CTA is accessible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /emotionscare/i })).toBeVisible();

  const heroCta = page.getByRole('link', { name: /essai gratuit 30 jours/i });
  await expect(heroCta).toBeVisible();

  await heroCta.click();
  await expect(page).toHaveURL(/\/b2c/);
});
