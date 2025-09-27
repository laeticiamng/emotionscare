import { test, expect } from '@playwright/test';

test('B2B Admin — dashboard → teams → reports', async ({ page }) => {
  await page.goto('/b2b/admin');
  await expect(page).not.toHaveURL(/login/);

  await page.getByRole('link', { name: /Teams|Équipes/i }).click();
  await expect(page.getByTestId('page-root')).toBeVisible();

  await page.getByRole('link', { name: /Reports|Rapports/i }).click();
  await expect(page.getByTestId('page-root')).toBeVisible();
});
