import { test, expect } from '@playwright/test';
import { SELECTORS } from './_selectors';

test('B2C — dashboard → journal (création) → scan', async ({ page }) => {
  await page.goto('/b2c/dashboard');
  await expect(page).not.toHaveURL(/login/);

  await page.getByRole('link', { name: /Journal/i }).click();
  await page.locator(SELECTORS.journalInput).fill('Je me sens détendu.');
  await page.locator(SELECTORS.submitJournal).click();
  await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible();

  await page.getByRole('link', { name: /Scan/i }).click();
  await expect(page.locator(SELECTORS.scanRoot)).toBeVisible();
});
