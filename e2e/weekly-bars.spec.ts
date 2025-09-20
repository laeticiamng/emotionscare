import { expect, test } from '@playwright/test';

test.describe('Weekly Bars orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('orchestration:weekly_bars', JSON.stringify({ who5Level: 3 }));
    });
    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('renders textual bars and a gentle cta', async ({ page }) => {
    await page.goto('/app/weekly-bars');

    await expect(page.getByText('clair')).toBeVisible();
    await expect(page.getByText('actif')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Respirer deux minutes avec Flash Glow' })).toBeVisible();

    const textContent = await page.locator('main#main-content').innerText();
    expect(textContent).not.toMatch(/\d/);
  });
});
