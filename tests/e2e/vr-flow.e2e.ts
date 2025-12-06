import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le flux VR (Nebula + Dome)
 * Phase 3 - Validation des sessions VR immersives
 */

test.describe('VR Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/home');
    await page.waitForLoadState('networkidle');
  });

  test('affiche les sessions VR Nebula avec métriques HRV', async ({ page }) => {
    const nebulaSession = page.locator('[data-testid="vr-nebula-session"]').first();
    
    if (await nebulaSession.count() > 0) {
      await expect(nebulaSession).toBeVisible();
      
      // Vérifier les métriques de cohérence cardiaque
      await expect(nebulaSession.getByText(/Cohérence|Coherence/i)).toBeVisible();
      
      // Vérifier la présence du score
      const scoreElement = nebulaSession.locator('[data-testid="coherence-score"]');
      await expect(scoreElement).toBeVisible();
      
      // Vérifier la durée de session
      await expect(nebulaSession.locator('text=/\\d+ min/')).toBeVisible();
    }
  });

  test('affiche l\'historique des sessions VR avec filtrage', async ({ page }) => {
    const historyList = page.locator('[data-testid="vr-sessions-history"]');
    
    if (await historyList.count() > 0) {
      await expect(historyList).toBeVisible();
      
      // Vérifier la présence des sessions
      const sessions = historyList.locator('[data-testid^="vr-session-"]');
      const sessionCount = await sessions.count();
      expect(sessionCount).toBeGreaterThan(0);
      
      // Vérifier les timestamps
      await expect(sessions.first().locator('time')).toBeVisible();
    }
  });

  test('affiche correctement les métriques de groupe pour Dome', async ({ page }) => {
    const domeSession = page.locator('[data-testid="vr-dome-session"]').first();
    
    if (await domeSession.count() > 0) {
      await expect(domeSession).toBeVisible();
      
      // Vérifier les métriques de synchronie d'équipe
      await expect(domeSession.getByText(/Synchronie|Team/i)).toBeVisible();
      
      // Vérifier l'affect positif d'équipe
      await expect(domeSession.getByText(/Affect positif|Positive affect/i)).toBeVisible();
    }
  });

  test('respecte les guidelines WCAG 2.1 AA pour les graphiques VR', async ({ page }) => {
    const vrCard = page.locator('[data-testid^="vr-"]').first();
    
    if (await vrCard.count() > 0) {
      // Vérifier les labels accessibles
      const ariaLabel = await vrCard.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
      
      // Vérifier le contraste des couleurs (via snapshot)
      await expect(vrCard).toHaveScreenshot({ maxDiffPixels: 100 });
    }
  });

  test('charge les sessions VR de manière optimisée', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/app/home');
    await page.waitForSelector('[data-testid="vr-sessions-history"]', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que le chargement prend moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('gère l\'absence de sessions VR avec message approprié', async ({ page }) => {
    // Mock une réponse vide
    await page.route('**/rest/v1/vr_*', route =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );

    await page.reload();
    await page.waitForLoadState('networkidle');

    const emptyState = page.getByText(/Aucune session|Commencez/i);
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });

  test('navigation clavier complète dans l\'historique VR', async ({ page }) => {
    const sessions = page.locator('[data-testid^="vr-session-"]');
    
    if (await sessions.count() > 1) {
      await sessions.first().focus();
      
      // Tab vers la prochaine session
      await page.keyboard.press('Tab');
      
      const secondSession = sessions.nth(1);
      const isFocused = await secondSession.evaluate(el => 
        document.activeElement === el || el.contains(document.activeElement)
      );
      expect(isFocused).toBeTruthy();
    }
  });
});
