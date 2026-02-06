import { test, expect } from '@playwright/test';

test('home hero CTA is accessible', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: /bien-être émotionnel/i })).toBeVisible();

  const heroCta = page.getByRole('link', { name: /commencer gratuitement/i });
  await expect(heroCta).toBeVisible();

  await heroCta.click();
  await expect(page).toHaveURL(/\/signup/);
});
