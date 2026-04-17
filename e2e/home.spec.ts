import { test, expect } from '@playwright/test';

test('home hero exposes descriptive H1 and CTA leading to signup', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /comprendre ses émotions et agir/i }),
  ).toBeVisible();

  const heroCta = page.getByRole('link', { name: /commencer gratuitement/i });
  await expect(heroCta).toBeVisible();

  await heroCta.click();
  await expect(page).toHaveURL(/\/signup/);
});
