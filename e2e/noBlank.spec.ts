
import { test, expect } from '@playwright/test';
import { OFFICIAL_ROUTES_ARRAY } from '../src/routesManifest';

test.describe('No Blank Screen Tests - 52 Routes Officielles', () => {
  // Test pour chaque route du manifeste officiel
  for (const route of OFFICIAL_ROUTES_ARRAY) {
    test(`route ${route} renders without blank screen`, async ({ page }) => {
      console.log(`🔍 Testing route: ${route}`);
      
      // Aller à la route
      const response = await page.goto(route);
      
      // Vérifier que la réponse n'est pas une erreur 4xx/5xx
      expect(response?.status()).toBeLessThan(400);
      
      // Attendre que le composant page-root soit visible
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ 
        timeout: 5000 
      });
      
      // Vérifier qu'il y a du contenu visible (pas d'écran blanc)
      const visibleElements = await page.locator('body *:visible').count();
      expect(visibleElements).toBeGreaterThan(0);
      
      // Vérifier qu'il n'y a pas d'erreurs JavaScript critiques
      const jsErrors: string[] = [];
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });
      
      // Attendre un peu pour capturer les erreurs éventuelles
      await page.waitForTimeout(1000);
      
      // Filtrer les erreurs critiques seulement
      const criticalErrors = jsErrors.filter(error => 
        error.includes('ChunkLoadError') || 
        error.includes('Cannot read properties of undefined') ||
        error.includes('is not a function') ||
        error.includes('Network Error')
      );
      
      expect(criticalErrors).toHaveLength(0);
      
      console.log(`✅ Route ${route} passed`);
    });
  }

  test('routes manifest integrity', async () => {
    // Vérifier que le manifeste contient exactement 52 routes
    expect(OFFICIAL_ROUTES_ARRAY).toHaveLength(52);
    
    // Vérifier qu'il n'y a pas de doublons
    const uniqueRoutes = new Set(OFFICIAL_ROUTES_ARRAY);
    expect(uniqueRoutes.size).toBe(OFFICIAL_ROUTES_ARRAY.length);
    
    // Vérifier que toutes les routes commencent par '/'
    for (const route of OFFICIAL_ROUTES_ARRAY) {
      expect(route).toMatch(/^\/.*$/);
    }
  });

  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le contenu spécifique de la homepage
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/EmotionsCare|Accueil/);
  });

  test('404 handling works', async ({ page }) => {
    await page.goto('/route-inexistante-404-test');
    
    // Doit rediriger vers une page d'erreur ou homepage
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
  });
});
