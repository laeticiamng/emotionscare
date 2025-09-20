import { test, expect } from '@playwright/test';

test('boss grit page stays textual only', async ({ page }) => {
  await page.goto('/boss-grit');

  const consentCard = page.getByRole('heading', { name: 'Activer Boss Grit' });
  if (await consentCard.count()) {
    await expect(consentCard).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Défi de résilience bienveillant' })).toBeVisible();
  }

  const mainText = await page.locator('main').innerText();
  expect(mainText).not.toMatch(/\d/);
});
