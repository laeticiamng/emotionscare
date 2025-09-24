import { test, expect } from '@playwright/test';

test('ambition arcade respects zero-number boundary', async ({ page }) => {
  await page.goto('/ambition-arcade');

  const consentCard = page.getByRole('heading', { name: 'Activer Ambition Arcade' });
  if (await consentCard.count()) {
    await expect(consentCard).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Cap sur l’élan tout en douceur' })).toBeVisible();
  }

  const mainText = await page.locator('main').innerText();
  expect(mainText).not.toMatch(/\d/);
});
