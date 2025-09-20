import { test, expect } from '@playwright/test';

test('story synth adapts in text only', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'orchestration:story_synth',
      JSON.stringify({ tensionLevel: 3, fatigueLevel: 3 }),
    );
  });

  await page.goto('/story-synth');
  await page.getByRole('button', { name: /j'accepte volontiers/i }).click();

  await expect(page.getByRole('heading', { name: /histoire modulée/i })).toBeVisible();
  await expect(page.getByText('Ambiance cocon')).toBeVisible();
  await expect(page.getByText('Voix apaisée')).toBeVisible();

  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\d/);
});
