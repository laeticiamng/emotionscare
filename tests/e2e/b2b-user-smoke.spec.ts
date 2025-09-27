import { test, expect } from '@playwright/test';
import { SELECTORS } from './_selectors';

test('B2B User — dashboard → journal → scan', async ({ page }) => {
  await page.goto('/b2b/dashboard');
  await expect(page).not.toHaveURL(/login/);

  await page.getByRole('link', { name: /Journal/i }).click();
  await expect(page.locator(SELECTORS.journalInput)).toBeVisible();

  await page.getByRole('link', { name: /Scan/i }).click();
  await expect(page.locator(SELECTORS.scanRoot)).toBeVisible();
});
