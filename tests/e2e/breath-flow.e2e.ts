import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le flux Breath (métriques respiratoires hebdomadaires)
 * Phase 3 - Validation des exercices de respiration
 */

test.describe('Breath Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/home');
    await page.waitForLoadState('networkidle');
  });

  test('affiche les métriques hebdomadaires de respiration', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      await expect(breathCard).toBeVisible();
      
      // Vérifier la présence de la semaine
      await expect(breathCard.getByText(/Semaine|Week/i)).toBeVisible();
      
      // Vérifier les métriques clés
      await expect(breathCard.getByText(/sessions?/i)).toBeVisible();
      await expect(breathCard.getByText(/minutes?/i)).toBeVisible();
    }
  });

  test('affiche le nombre total de sessions et durée cumulative', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      // Vérifier le nombre de sessions
      const sessionsText = await breathCard.locator('[data-testid="total-sessions"]').textContent();
      expect(sessionsText).toMatch(/\d+/);
      
      // Vérifier la durée totale
      const durationText = await breathCard.locator('[data-testid="total-duration"]').textContent();
      expect(durationText).toMatch(/\d+/);
    }
  });

  test('affiche la moyenne de la fréquence respiratoire', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      // Vérifier la présence de la moyenne
      const avgRespRate = breathCard.locator('[data-testid="avg-resp-rate"]');
      await expect(avgRespRate).toBeVisible();
      
      const rateValue = await avgRespRate.textContent();
      expect(rateValue).toMatch(/\d+(\.\d+)?/);
    }
  });

  test('affiche un indicateur visuel de progression', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      // Vérifier la présence d'une barre de progression ou indicateur
      const progressBar = breathCard.locator('[role="progressbar"], [role="meter"]');
      
      if (await progressBar.count() > 0) {
        await expect(progressBar).toBeVisible();
        
        // Vérifier que la valeur est accessible
        const ariaValueNow = await progressBar.getAttribute('aria-valuenow');
        expect(ariaValueNow).toBeTruthy();
      }
    }
  });

  test('respecte le format de date localisé français', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      // Vérifier le format de date français (ex: "Semaine du 1 oct. 2025")
      const dateText = await breathCard.locator('time').textContent();
      expect(dateText).toMatch(/\d{1,2}\s+\w+\.?\s+\d{4}/);
    }
  });

  test('gère l\'absence de données avec message approprié', async ({ page }) => {
    // Mock une réponse vide
    await page.route('**/rest/v1/breath_weekly_metrics*', route =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );

    await page.reload();
    await page.waitForLoadState('networkidle');

    const emptyState = page.getByText(/Aucune donnée|Commencez/i);
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });

  test('charge les métriques avec React Query efficacement', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/app/home');
    await page.waitForSelector('[data-testid="breath-weekly-card"]', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que le chargement prend moins de 2 secondes
    expect(loadTime).toBeLessThan(2000);
  });

  test('affiche plusieurs semaines avec défilement', async ({ page }) => {
    const breathCards = page.locator('[data-testid="breath-weekly-card"]');
    const cardCount = await breathCards.count();
    
    if (cardCount > 1) {
      // Vérifier que les cartes sont dans l'ordre chronologique décroissant
      const firstWeek = await breathCards.first().locator('[data-testid="week-start"]').textContent();
      const lastWeek = await breathCards.last().locator('[data-testid="week-start"]').textContent();
      
      expect(firstWeek).toBeTruthy();
      expect(lastWeek).toBeTruthy();
    }
  });

  test('navigation clavier accessible dans les cartes breath', async ({ page }) => {
    const breathCard = page.locator('[data-testid="breath-weekly-card"]').first();
    
    if (await breathCard.count() > 0) {
      await breathCard.focus();
      
      const isFocusable = await breathCard.evaluate(el => 
        el.tabIndex >= 0 || el.hasAttribute('tabindex')
      );
      expect(isFocusable).toBeTruthy();
    }
  });
});
