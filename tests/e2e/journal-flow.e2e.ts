import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le flux Journal (vocal + texte)
 * Phase 3 - Validation du parcours complet utilisateur
 */

test.describe('Journal Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/home');
    await page.waitForLoadState('networkidle');
  });

  test('affiche la timeline du journal avec entrées vocales et texte', async ({ page }) => {
    // Vérifier que le composant JournalTimeline est présent
    const timeline = page.getByTestId('journal-timeline');
    await expect(timeline).toBeVisible({ timeout: 10000 });

    // Vérifier qu'il y a au moins une carte (voix ou texte)
    const journalCards = page.locator('[data-testid^="journal-"]');
    const cardCount = await journalCards.count();
    
    if (cardCount > 0) {
      await expect(journalCards.first()).toBeVisible();
      
      // Vérifier les métadonnées
      const firstCard = journalCards.first();
      await expect(firstCard.locator('time')).toBeVisible();
      await expect(firstCard.locator('[role="meter"]')).toBeVisible(); // Confidence meter
    }
  });

  test('affiche correctement les entrées vocales avec durée', async ({ page }) => {
    const voiceCard = page.locator('[data-testid="journal-voice-card"]').first();
    
    if (await voiceCard.count() > 0) {
      await expect(voiceCard).toBeVisible();
      
      // Vérifier la présence de la durée
      await expect(voiceCard.locator('text=/\\d+s/')).toBeVisible();
      
      // Vérifier le badge "Vocal"
      await expect(voiceCard.getByText('Vocal')).toBeVisible();
    }
  });

  test('affiche correctement les entrées texte avec nombre de mots', async ({ page }) => {
    const textCard = page.locator('[data-testid="journal-text-card"]').first();
    
    if (await textCard.count() > 0) {
      await expect(textCard).toBeVisible();
      
      // Vérifier la présence du compteur de mots
      await expect(textCard.locator('text=/\\d+ mots?/')).toBeVisible();
      
      // Vérifier le badge "Texte"
      await expect(textCard.getByText('Texte')).toBeVisible();
    }
  });

  test('respecte l\'accessibilité clavier sur les cartes journal', async ({ page }) => {
    const firstCard = page.locator('[data-testid^="journal-"]').first();
    
    if (await firstCard.count() > 0) {
      await firstCard.focus();
      const focused = await firstCard.evaluate(el => document.activeElement === el);
      expect(focused).toBeTruthy();
      
      // Vérifier les aria-labels
      const ariaLabel = await firstCard.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('charge les données avec React Query et affiche le loading state', async ({ page }) => {
    // Intercepter la requête pour simuler un délai
    await page.route('**/rest/v1/journal_*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.reload();
    
    // Vérifier le skeleton loader
    const skeleton = page.locator('[data-testid="journal-skeleton"]');
    await expect(skeleton).toBeVisible({ timeout: 2000 });
  });

  test('affiche un message si aucune entrée journal', async ({ page }) => {
    // Mock une réponse vide
    await page.route('**/rest/v1/journal_*', route =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );

    await page.reload();
    await page.waitForLoadState('networkidle');

    const emptyState = page.getByText(/Aucune entrée|Commencez/i);
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });
});
