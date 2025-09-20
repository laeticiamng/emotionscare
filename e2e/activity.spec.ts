import { expect, test } from '@playwright/test';

test.describe('Activity Jardin orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('orchestration:activity', JSON.stringify({ who5Level: 1 }));
    });
    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('shows supportive highlights without digits', async ({ page }) => {
    await page.goto('/app/activity');

    await expect(page.getByRole('heading', { name: 'Trois appuis qui aident cette semaine' })).toBeVisible();
    await expect(page.getByText(/Respirer doucement/)).toBeVisible();
    await expect(page.getByText(/Journal doux/)).toBeVisible();

    const textContent = await page.locator('main#main-content').innerText();
    expect(textContent).not.toMatch(/\d/);
  });
});
