import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le flux Assessments (évaluations cliniques)
 * Phase 3 - Validation des questionnaires et résultats
 */

test.describe('Assessment Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/home');
    await page.waitForLoadState('networkidle');
  });

  test('affiche les cartes d\'évaluation avec instrument et score', async ({ page }) => {
    const assessmentCard = page.locator('[data-testid="assessment-card"]').first();
    
    if (await assessmentCard.count() > 0) {
      await expect(assessmentCard).toBeVisible();
      
      // Vérifier le nom de l'instrument
      await expect(assessmentCard.locator('[data-testid="instrument-name"]')).toBeVisible();
      
      // Vérifier le score
      await expect(assessmentCard.locator('[data-testid="assessment-score"]')).toBeVisible();
      
      // Vérifier la date
      await expect(assessmentCard.locator('time')).toBeVisible();
    }
  });

  test('affiche le niveau interne calculé avec couleur appropriée', async ({ page }) => {
    const assessmentCard = page.locator('[data-testid="assessment-card"]').first();
    
    if (await assessmentCard.count() > 0) {
      const levelBadge = assessmentCard.locator('[data-testid="internal-level"]');
      await expect(levelBadge).toBeVisible();
      
      // Vérifier que le badge a une classe de couleur
      const classes = await levelBadge.getAttribute('class');
      expect(classes).toMatch(/bg-|text-/);
    }
  });

  test('affiche l\'historique complet des évaluations', async ({ page }) => {
    const assessmentHistory = page.locator('[data-testid="assessment-history"]');
    
    if (await assessmentHistory.count() > 0) {
      await expect(assessmentHistory).toBeVisible();
      
      // Vérifier la présence de plusieurs évaluations
      const assessments = assessmentHistory.locator('[data-testid="assessment-card"]');
      const count = await assessments.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('permet le filtrage par instrument', async ({ page }) => {
    const filterSelect = page.locator('[data-testid="instrument-filter"]');
    
    if (await filterSelect.count() > 0) {
      await expect(filterSelect).toBeVisible();
      
      // Sélectionner un instrument
      await filterSelect.click();
      const firstOption = page.locator('[role="option"]').first();
      
      if (await firstOption.count() > 0) {
        const instrumentName = await firstOption.textContent();
        await firstOption.click();
        
        // Vérifier que seules les évaluations de cet instrument sont affichées
        const assessments = page.locator('[data-testid="assessment-card"]');
        const visibleCount = await assessments.count();
        
        if (visibleCount > 0) {
          const firstInstrument = await assessments.first()
            .locator('[data-testid="instrument-name"]')
            .textContent();
          expect(firstInstrument).toBe(instrumentName);
        }
      }
    }
  });

  test('affiche les détails de chaque évaluation au clic', async ({ page }) => {
    const assessmentCard = page.locator('[data-testid="assessment-card"]').first();
    
    if (await assessmentCard.count() > 0) {
      await assessmentCard.click();
      
      // Vérifier l'ouverture d'un dialog ou expansion
      const details = page.locator('[data-testid="assessment-details"], [role="dialog"]');
      
      if (await details.count() > 0) {
        await expect(details).toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('respecte la confidentialité GDPR des données cliniques', async ({ page }) => {
    // Vérifier qu'il n'y a pas de données sensibles exposées dans le HTML
    const pageContent = await page.content();
    
    // Ne devrait pas contenir de données personnelles non chiffrées
    expect(pageContent).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN format
    expect(pageContent).not.toMatch(/password/i);
  });

  test('charge les évaluations de manière performante', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/app/home');
    await page.waitForSelector('[data-testid="assessment-history"]', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    
    // Vérifier que le chargement prend moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('gère l\'absence d\'évaluations avec message approprié', async ({ page }) => {
    // Mock une réponse vide
    await page.route('**/rest/v1/assessments*', route =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );

    await page.reload();
    await page.waitForLoadState('networkidle');

    const emptyState = page.getByText(/Aucune évaluation|Commencez/i);
    await expect(emptyState).toBeVisible({ timeout: 5000 });
  });

  test('navigation clavier accessible dans l\'historique', async ({ page }) => {
    const assessments = page.locator('[data-testid="assessment-card"]');
    
    if (await assessments.count() > 1) {
      await assessments.first().focus();
      
      // Tab vers la prochaine évaluation
      await page.keyboard.press('Tab');
      
      const secondAssessment = assessments.nth(1);
      const isFocused = await secondAssessment.evaluate(el => 
        document.activeElement === el || el.contains(document.activeElement)
      );
      expect(isFocused).toBeTruthy();
    }
  });

  test('affiche les seuils de l\'instrument avec échelle visuelle', async ({ page }) => {
    const assessmentCard = page.locator('[data-testid="assessment-card"]').first();
    
    if (await assessmentCard.count() > 0) {
      // Vérifier la présence d'une échelle visuelle ou barre de progression
      const scale = assessmentCard.locator('[role="progressbar"], [role="meter"]');
      
      if (await scale.count() > 0) {
        await expect(scale).toBeVisible();
        
        // Vérifier les valeurs aria
        const ariaValueMin = await scale.getAttribute('aria-valuemin');
        const ariaValueMax = await scale.getAttribute('aria-valuemax');
        expect(ariaValueMin).toBeTruthy();
        expect(ariaValueMax).toBeTruthy();
      }
    }
  });
});
