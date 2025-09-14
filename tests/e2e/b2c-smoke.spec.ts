import { test, expect } from '@playwright/test';
import { SELECTORS } from './_selectors';
import { readJournalEntry } from './_setup/assert-db';

test('B2C — dashboard → journal (création) → scan', async ({ page }) => {
  await page.goto('/b2c/dashboard');
  await expect(page).not.toHaveURL(/login/);

  await page.getByRole('link', { name: /Journal/i }).click();
  await page.locator(SELECTORS.journalInput).fill('Je me sens détendu.');
  const [journalRes] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/journal') && r.request().method() === 'POST'),
    page.locator(SELECTORS.submitJournal).click(),
  ]);
  await expect(page.locator(SELECTORS.toastSuccess)).toBeVisible();

  const created = await journalRes.json();
  const dbEntry = await readJournalEntry(created.id);
  expect(dbEntry.id).toBe(created.id);
  expect(dbEntry.content).toContain('Je me sens détendu');

  await page.getByRole('link', { name: /Scan/i }).click();
  await expect(page.locator(SELECTORS.scanRoot)).toBeVisible();
});
