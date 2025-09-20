import { test, expect } from '@playwright/test';

test('auras page renders textual guidance without digits', async ({ page }) => {
  await page.goto('/leaderboard');

  const fallbackHeading = page.getByRole('heading', { name: 'Activer les Auras' });
  if (await fallbackHeading.count()) {
    await expect(fallbackHeading).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Halo collectif sans chiffres' })).toBeVisible();
  }

  const mainText = await page.locator('main').innerText();
  expect(mainText).not.toMatch(/\d/);
});
