import { expect, test } from '@playwright/test';

test.describe('Screen Silk orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('orchestration:screen_silk', JSON.stringify({ cvsqLevel: 3 }));
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('activates blink reminder and gentle blur with no digits', async ({ page }) => {
    await page.goto('/app/screen-silk');

    await expect(page.getByText('Rappel de clignement doux activé.')).toBeVisible();
    await expect(page.getByText(/Flou extrêmement léger/)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lancer Flash Glow apaisé' })).toBeVisible();

    const textContent = await page.locator('main#main-content').innerText();
    expect(textContent).not.toMatch(/\d/);
  });
});
