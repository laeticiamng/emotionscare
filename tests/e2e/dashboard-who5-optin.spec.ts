import { expect, test } from '@playwright/test';

test.describe('Dashboard WHO-5 opt-in prompt', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('shows the ritual card and allows snoozing the invitation', async ({ page }) => {
    await page.route('**/me/feature_flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ flags: { FF_DASHBOARD: true, FF_ASSESS_WHO5: true } }),
      });
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-b2c', email: 'demo@user.test' } }),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/home');

    await expect(page.getByRole('heading', { name: /Bienvenue sur votre espace bien-être/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('heading', { name: /Plan de la semaine/i })).toBeVisible();

    const postponeButton = page.getByRole('button', { name: /Passer pour cette fois/i });
    await expect(postponeButton).toBeVisible();

    await postponeButton.click();
    await expect(page.getByText(/Invitation reportée/i)).toBeVisible();
  });
});
