import { expect, test } from '@playwright/test';

test.describe('Story Synth orchestration boundary', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'orchestration:story_synth',
        JSON.stringify({ tensionLevel: 3, fatigueLevel: 3 }),
      );
    });
    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('applies cocon bed and slow voice with text-only output', async ({ page }) => {
    await page.goto('/app/story-synth');

    await expect(page.getByText('Ambiance cocon')).toBeVisible();
    await expect(page.getByText('Voix apaisée')).toBeVisible();
    await expect(page.getByText(/Scène resserrée/)).toBeVisible();

    const textContent = await page.locator('main#main-content').innerText();
    expect(textContent).not.toMatch(/\d/);
  });
});
