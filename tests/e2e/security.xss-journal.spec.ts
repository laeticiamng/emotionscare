import { test, expect } from '@playwright/test';

test('Journal sanitize XSS', async ({ page }) => {
  await page.goto('/app/journal');
  await page.getByTestId('journal-input').fill('<img src=x onerror=alert(1)> Hello');
  await page.getByRole('button', { name: /Garder|Enregistrer/i }).click();
  const entry = page.getByText('Hello');
  await expect(entry).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});
