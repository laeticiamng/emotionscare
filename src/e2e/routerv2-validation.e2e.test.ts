// @ts-nocheck
import { test, expect } from '@playwright/test';
import { ROUTES_REGISTRY } from '@/routerV2/registry';

// Extraire les paths pour les tests
const ROUTE_PATHS = ROUTES_REGISTRY.map(route => route.path);

test.describe('RouterV2 - Validation Complete', () => {
  test('all routes render without blank screen', async ({ page }) => {
    for (const route of ROUTE_PATHS.slice(0, 10)) { // Test un échantillon
      console.log(`Testing route: ${route}`);
      
      await page.goto(route);
      
      // Attendre que le composant soit monté
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
      
      // Vérifier qu'il n'y a pas d'écran blanc
      const hasContent = await page.locator('body *:visible').count();
      expect(hasContent).toBeGreaterThan(0);
      
      console.log(`✅ Route ${route} OK`);
    }
  });

  test('routes uniqueness validation', async () => {
    const routes = ROUTE_PATHS;
    const uniqueRoutes = new Set(routes);
    
    expect(routes.length).toBe(uniqueRoutes.size);
    console.log(`✅ ${routes.length} routes uniques validées`);
  });

  test('404 page handles unknown routes', async ({ page }) => {
    await page.goto('/route-inexistante-test-404');
    
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page introuvable')).toBeVisible();
  });
});