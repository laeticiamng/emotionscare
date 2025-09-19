import { test, expect } from '@playwright/test';

test.describe('Coach IA sécurisé', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Force fetch fallback to simplify tests.
      Object.defineProperty(window, 'EventSource', { value: undefined, configurable: true });
    });
  });

  test('consentement et premier message', async ({ page }) => {
    await page.route('**/functions/v1/ai-coach', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          thread_id: 'test-thread',
          messages: [
            {
              role: 'assistant',
              content: 'Merci pour ton partage. Faisons une respiration d’une minute et note ce que tu ressens.',
            },
          ],
          disclaimers: [
            'Le Coach IA ne remplace pas un professionnel de santé.',
            'En cas de danger immédiat, contacte le 112 ou une personne de confiance.',
          ],
        }),
      });
    });

    await page.goto('/app/coach');

    const consentModal = page.getByRole('dialog', { name: /Coach IA/ });
    await expect(consentModal).toBeVisible();

    await consentModal.getByRole('checkbox').check();
    await consentModal.getByRole('button', { name: /Commencer/ }).click();
    await expect(consentModal).toBeHidden();

    await page.getByLabel('Ton message pour le coach').fill('Je me sens stressé.');
    await page.getByRole('button', { name: 'Envoyer' }).click();

    const assistantBubble = page.getByText(/Merci pour ton partage/);
    await expect(assistantBubble).toBeVisible();

    const quickAction = page.getByRole('link', { name: 'Respirer 1 min' });
    await expect(quickAction).toHaveAttribute('href', '/app/breath');
  });
});
