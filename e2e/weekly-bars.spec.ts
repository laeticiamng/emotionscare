import { test, expect } from '@playwright/test';

test('weekly bars displays verbal palette only', async ({ page }) => {
  await page.goto('/weekly-bars');
  await page.getByRole('button', { name: /j'accepte volontiers/i }).click();

  await expect(page.getByRole('heading', { name: /ta semaine en mots/i })).toBeVisible();
  await expect(page.getByText('Rejoindre Flash Glow')).toBeVisible();

  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\d/);
});
