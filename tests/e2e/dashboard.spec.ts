import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le dashboard
 * Phase 2 - Validation des fonctionnalités principales
 */

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should access dashboard if available', async ({ page }) => {
    // Chercher un lien vers le dashboard
    const dashboardLink = page.locator('a', { 
      hasText: /dashboard|tableau de bord|accueil/i 
    }).first();
    
    if (await dashboardLink.count() > 0) {
      await dashboardLink.click();
      
      // Vérifier que nous sommes sur le dashboard
      await expect(page.url()).toMatch(/dashboard|accueil|home/);
      
      // Vérifier les éléments typiques d'un dashboard
      const possibleElements = [
        page.locator('[data-testid*="dashboard"]'),
        page.locator('.dashboard'),
        page.locator('main'),
        page.locator('[role="main"]')
      ];
      
      let foundElement = false;
      for (const element of possibleElements) {
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
          foundElement = true;
          break;
        }
      }
      
      expect(foundElement).toBe(true);
    }
  });

  test('should handle navigation between pages', async ({ page }) => {
    // Test de navigation basique
    const links = await page.locator('a[href^="/"]').all();
    
    if (links.length > 0) {
      // Tester les 3 premiers liens (éviter de surcharger)
      for (let i = 0; i < Math.min(3, links.length); i++) {
        const link = links[i];
        const href = await link.getAttribute('href');
        
        if (href && href !== '#' && !href.includes('mailto:')) {
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Vérifier que la page s'est chargée
          await expect(page.locator('body')).toBeVisible();
          
          // Retour à la page d'accueil
          await page.goto('/');
        }
      }
    }
  });

  test('should be accessible', async ({ page }) => {
    // Test d'accessibilité basique avec Playwright
    await page.goto('/');
    
    // Vérifier les éléments d'accessibilité essentiels
    const mainContent = page.locator('main, [role="main"], #root').first();
    await expect(mainContent).toBeVisible();
    
    // Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
    
    // Vérifier qu'il y a des headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings.first()).toBeVisible();
  });

  test('should handle loading states', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que le contenu principal soit chargé
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il n'y a pas d'états de loading persistants
    const loadingElements = page.locator('[data-testid*="loading"], .loading, .spinner');
    
    if (await loadingElements.count() > 0) {
      // Attendre que le loading disparaisse (max 10 secondes)
      await expect(loadingElements.first()).toBeHidden({ timeout: 10000 });
    }
    
    // Vérifier que le contenu principal est visible
    await expect(page.locator('main, #root, [role="main"]').first()).toBeVisible();
  });
});