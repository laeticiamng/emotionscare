import { expect, test } from '@playwright/test';

test.describe('Community orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'orchestration:community',
        JSON.stringify({ uclaLevel: 3, mspssLevel: 0 }),
      );
    });
    await page.route('**session_text_logs**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('surfaces empathic replies and gentle banner without digits', async ({ page }) => {
    await page.goto('/app/community');

    await expect(page.getByRole('dialog', { name: /Écoute deux minutes/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Propositions empathiques' })).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);

    await page.getByRole('button', { name: 'Prévisualiser & envoyer' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Prévisualisation douce' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Texte empathique à personnaliser' })).toBeEnabled();
  });
});
