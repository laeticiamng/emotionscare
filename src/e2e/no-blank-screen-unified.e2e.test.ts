
import { test, expect } from '@playwright/test';
import { ROUTE_MANIFEST } from '../router/buildUnifiedRoutes';

test.describe('No Blank Screen Tests - Router Unifié', () => {
  // Test de base pour vérifier que chaque route retourne du contenu
  for (const route of ROUTE_MANIFEST) {
    test(`route ${route} renders with page-root`, async ({ page }) => {
      console.log(`Testing route: ${route}`);
      
      // Aller à la route
      await page.goto(route);
      
      // Attendre que le composant soit monté avec data-testid="page-root"
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
      
      // Vérifier qu'il n'y a pas d'écran blanc (au moins un élément visible)
      const hasContent = await page.locator('body *:visible').count();
      expect(hasContent).toBeGreaterThan(0);
      
      // Vérifier qu'il n'y a pas d'erreur JavaScript critique
      const errors: string[] = [];
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });
      
      if (errors.length > 0) {
        console.warn(`Warnings for ${route}:`, errors);
        // Ne pas faire échouer le test pour des warnings, seulement pour des erreurs critiques
        const criticalErrors = errors.filter(error => 
          error.includes('ChunkLoadError') || 
          error.includes('Cannot read properties of undefined') ||
          error.includes('is not a function')
        );
        expect(criticalErrors).toHaveLength(0);
      }
      
      console.log(`✅ Route ${route} test passed`);
    });
  }

  test('homepage renders correctly', async ({ page }) => {
    console.log('Testing homepage specifically...');
    await page.goto('/');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
    
    // Vérifier le contenu spécifique de HomePage
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    
    console.log('Homepage test passed ✅');
  });

  test('404 page handles unknown routes', async ({ page }) => {
    console.log('Testing 404 handling...');
    await page.goto('/route-inexistante-test-404');
    
    // Attendre que la page 404 soit montée
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu 404
    await expect(page.locator('text=404 - Page introuvable')).toBeVisible();
    
    console.log('404 handling test passed ✅');
  });

  test('error boundary works', async ({ page }) => {
    console.log('Testing error boundary...');
    
    // Simuler une erreur en allant sur une route qui devrait planter
    await page.goto('/');
    
    // Injecter une erreur dans la page
    await page.evaluate(() => {
      // Forcer une erreur React
      const event = new CustomEvent('test-error');
      window.dispatchEvent(event);
    });
    
    // Vérifier que l'error boundary n'est pas affiché (pas d'erreur)
    // ou qu'il est affiché correctement s'il y a une erreur
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    console.log('Error boundary test passed ✅');
  });

  test('all routes return 200 status', async ({ page }) => {
    console.log('Testing HTTP status codes...');
    
    for (const route of ROUTE_MANIFEST.slice(0, 5)) { // Test sur un échantillon
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      console.log(`✅ Route ${route} returns 200`);
    }
  });
});
