import { expect, test } from '@playwright/test';

test.describe('Social Cocon orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'orchestration:social_cocon',
        JSON.stringify({ mspssLevel: 0 }),
      );
    });
    await page.route('**session_text_logs**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('promotes shared breaks and highlights private rooms', async ({ page }) => {
    await page.goto('/app/social-cocon');

    await expect(page.getByRole('heading', { name: 'Planifier une pause partagée' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Proposer le créneau' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ajouter dans mon agenda' })).toBeVisible();

    const firstRoomHeading = page.locator('section[aria-label="Espaces disponibles"] h3').first();
    await expect(firstRoomHeading).toContainText('Cercle');
    await expect(page.getByText('Privé').first()).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
