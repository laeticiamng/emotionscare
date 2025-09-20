import { expect, test } from '@playwright/test';

test.describe('Mood Mixer orchestration', () => {
  test('guides audio using textual cues only', async ({ page }) => {
    await page.route('**/api/sessions', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.goto('/app/mood-mixer');
    await expect(page.getByRole('heading', { name: 'Orchestration sensible sans chiffres' })).toBeVisible();

    const valenceSlider = page.getByRole('slider', { name: 'Ambiance sonore (doux vers clair)' });
    await valenceSlider.focus();
    await valenceSlider.press('End');
    await page.waitForRequest('**/api/sessions');

    const arousalSlider = page.getByRole('slider', { name: 'Cadence du mix (posé vers tonique)' });
    await arousalSlider.focus();
    await arousalSlider.press('Home');
    await page.waitForRequest('**/api/sessions');

    await expect(page.getByText('Plus clair')).toBeVisible();
    await expect(page.getByText('Plus posé')).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
