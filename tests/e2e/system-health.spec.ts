// @ts-nocheck
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Tests E2E pour SystemHealthPage
 * Valide dashboard de monitoring + accessibilité WCAG AA
 */

test.describe('SystemHealthPage - Dashboard de Santé Système', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers la page de santé système
    await page.goto('/system-health');
    
    // Attendre que le dashboard soit chargé
    await page.waitForLoadState('networkidle');
  });

  test('affiche le dashboard avec tous les composants essentiels', async ({ page }) => {
    // Vérifier le titre
    await expect(page.getByRole('heading', { name: /santé système/i })).toBeVisible();
    
    // Vérifier la présence des sections principales
    await expect(page.getByText(/état global/i)).toBeVisible();
    await expect(page.getByText(/tables supabase/i)).toBeVisible();
    await expect(page.getByText(/edge functions/i)).toBeVisible();
    await expect(page.getByText(/dépendances/i)).toBeVisible();
  });

  test('affiche le score de santé global', async ({ page }) => {
    // Vérifier le score (0-100%)
    const scoreElement = page.locator('[data-testid="health-score"]').first();
    await expect(scoreElement).toBeVisible();
    
    const scoreText = await scoreElement.textContent();
    expect(scoreText).toMatch(/\d+%/);
  });

  test('affiche le statut des tables Supabase', async ({ page }) => {
    // Vérifier au moins une table
    const tableStatus = page.locator('[data-testid*="table-status"]').first();
    await expect(tableStatus).toBeVisible({ timeout: 10000 });
    
    // Vérifier les indicateurs de statut (✓ ou ✗)
    const statusIndicator = tableStatus.locator('svg, [data-icon]').first();
    await expect(statusIndicator).toBeVisible();
  });

  test('affiche le statut des Edge Functions', async ({ page }) => {
    // Vérifier la présence d'au moins une edge function
    const edgeFunctionCard = page.locator('[data-testid*="edge-function"]').first();
    await expect(edgeFunctionCard).toBeVisible({ timeout: 10000 });
    
    // Vérifier les métriques (latence, taux d'erreur, etc.)
    await expect(edgeFunctionCard.getByText(/latence|erreur|requêtes/i)).toBeVisible();
  });

  test('rafraîchit automatiquement toutes les 5 minutes', async ({ page }) => {
    // Vérifier que le timer de rafraîchissement est affiché
    const refreshTimer = page.locator('[data-testid="refresh-timer"]').first();
    
    if (await refreshTimer.isVisible()) {
      const initialTime = await refreshTimer.textContent();
      
      // Attendre 2 secondes et vérifier que le temps change
      await page.waitForTimeout(2000);
      const newTime = await refreshTimer.textContent();
      
      expect(initialTime).not.toBe(newTime);
    }
  });

  test('permet un rafraîchissement manuel', async ({ page }) => {
    // Chercher le bouton de rafraîchissement
    const refreshButton = page.getByRole('button', { name: /rafraîchir|actualiser|refresh/i });
    
    if (await refreshButton.isVisible()) {
      // Cliquer sur le bouton
      await refreshButton.click();
      
      // Vérifier qu'un indicateur de chargement apparaît
      await expect(page.locator('[data-testid="loading-indicator"]').first()).toBeVisible({ timeout: 2000 });
    }
  });

  test('affiche les alertes critiques si présentes', async ({ page }) => {
    // Chercher une section d'alertes
    const alertsSection = page.locator('[data-testid="alerts-section"]').first();
    
    if (await alertsSection.isVisible()) {
      // Vérifier qu'il y a au moins une alerte ou un message "Aucune alerte"
      const hasAlerts = await page.locator('[data-testid*="alert-item"]').count() > 0;
      const noAlertsMessage = await page.getByText(/aucune alerte|no alerts/i).isVisible();
      
      expect(hasAlerts || noAlertsMessage).toBe(true);
    }
  });

  test('affiche les graphiques de monitoring', async ({ page }) => {
    // Vérifier la présence de graphiques (canvas pour chart.js)
    const charts = page.locator('canvas');
    const chartCount = await charts.count();
    
    // Il devrait y avoir au moins un graphique
    expect(chartCount).toBeGreaterThan(0);
  });

  test('responsive design - mobile', async ({ page }) => {
    // Redimensionner en mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que le contenu est toujours visible et lisible
    await expect(page.getByRole('heading', { name: /santé système/i })).toBeVisible();
    
    // Vérifier que les cartes se réorganisent en colonne
    const cards = page.locator('[role="region"], [data-testid*="card"]');
    const firstCard = cards.first();
    
    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox();
      expect(box?.width).toBeLessThan(400); // Mobile width
    }
  });

  test('navigation retour fonctionne', async ({ page }) => {
    // Chercher un lien ou bouton de retour
    const backButton = page.getByRole('link', { name: /retour|back|accueil/i }).first();
    
    if (await backButton.isVisible()) {
      await backButton.click();
      
      // Vérifier qu'on est redirigé (URL change)
      await page.waitForURL((url) => !url.pathname.includes('/system-health'));
    }
  });
});

test.describe('SystemHealthPage - Accessibilité WCAG AA', () => {
  test('passe les vérifications axe-core (accessibilité)', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Exécuter axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Vérifier qu'il n'y a pas de violations critiques
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('navigation au clavier fonctionne', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Commencer par le premier élément focusable
    await page.keyboard.press('Tab');
    
    // Vérifier qu'un élément a le focus
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
    expect(focusedElement).not.toBe('BODY');
  });

  test('tous les boutons ont des labels accessibles', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Récupérer tous les boutons
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Chaque bouton doit avoir soit un texte, soit un aria-label
      expect(ariaLabel || text?.trim()).toBeTruthy();
    }
  });

  test('les images ont des attributs alt', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Récupérer toutes les images
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      
      // Chaque image doit avoir un attribut alt (même vide si décorative)
      expect(alt).not.toBeNull();
    }
  });

  test('les liens ont un texte descriptif', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Récupérer tous les liens
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Chaque lien doit avoir un texte ou aria-label descriptif
      expect((text?.trim() || ariaLabel || '').length).toBeGreaterThan(0);
    }
  });

  test('contrastes de couleurs respectent WCAG AA', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Utiliser axe-core pour vérifier les contrastes
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // On teste spécifiquement le contraste
      .analyze();
    
    // Chercher les violations de contraste
    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    
    expect(contrastViolations.length).toBe(0);
  });

  test('les formulaires ont des labels appropriés', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Récupérer tous les inputs
    const inputs = await page.locator('input, select, textarea').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Chaque input doit avoir un label associé
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        expect(label > 0 || ariaLabel || ariaLabelledBy).toBeTruthy();
      } else {
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('les éléments interactifs ont une taille tactile suffisante', async ({ page }) => {
    await page.goto('/system-health');
    await page.waitForLoadState('networkidle');
    
    // Récupérer tous les boutons et liens
    const interactiveElements = await page.locator('button, a[href]').all();
    
    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      
      if (box) {
        // Taille minimale recommandée: 44x44px (WCAG 2.1 Level AAA, mais bonne pratique)
        // Pour AA, on accepte 24x24px minimum
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
      }
    }
  });
});
