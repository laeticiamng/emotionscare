import { test, expect } from '@playwright/test';

test('bubble beat adapts with textual orchestration', async ({ page }) => {
  await page.goto('/bubble-beat');

  const consentCard = page.getByRole('heading', { name: 'Activer Bubble Beat' });
  if (await consentCard.count()) {
    await expect(consentCard).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Libération musicale anti-stress' })).toBeVisible();
  }

  const mainText = await page.locator('main').innerText();
  expect(mainText).not.toMatch(/\d/);
});
