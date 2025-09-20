import { test, expect } from '@playwright/test';

test('activity jardin surfaces textual highlights', async ({ page }) => {
  await page.goto('/activity');
  await page.getByRole('button', { name: /j'accepte volontiers/i }).click();

  await expect(page.getByRole('heading', { name: /trois appuis/i })).toBeVisible();
  await expect(page.getByText('Respirer doucement une minute')).toBeVisible();
  await expect(page.getByText('Journal court deux phrases')).toBeVisible();

  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\d/);
});
