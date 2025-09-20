import { test, expect } from '@playwright/test';

test('screen silk adapts blur and reminders without numbers', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'orchestration:screen_silk',
      JSON.stringify({ cvsqLevel: 3 }),
    );
  });

  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/screen-silk');
  await page.getByRole('button', { name: /j'accepte volontiers/i }).click();

  await expect(page.getByText('Pense à cligner doucement')).toBeVisible();
  await expect(page.getByText('Voile à peine perceptible')).toBeVisible();

  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\d/);
});
