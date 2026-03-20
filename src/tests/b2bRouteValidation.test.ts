import { test, expect } from '@playwright/test';

test.describe('Validation de la route /b2b corrigée', () => {
  test('la route /b2b redirige automatiquement vers /b2b/selection', async ({ page }) => {
    console.log('🔍 Test de redirection /b2b → /b2b/selection');
    
    // Naviguer vers /b2b
    await page.goto('/b2b');
    
    // Vérifier que nous sommes redirigés vers /b2b/selection
    await expect(page).toHaveURL('/b2b/selection');
    
    // Vérifier que la page se charge correctement
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Redirection /b2b → /b2b/selection OK');
  });
  
  test('la page /b2b/selection est accessible directement', async ({ page }) => {
    await page.goto('/b2b/selection');
    
    // Vérifier la structure de la page
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    console.log('✅ Page /b2b/selection accessible directement');
  });
  
  test('aucune erreur 404 sur les routes B2B', async ({ page }) => {
    const b2bRoutes = ['/b2b', '/b2b/selection', '/b2b/user/login', '/b2b/admin/login'];
    
    for (const route of b2bRoutes) {
      const response = await page.goto(route);
      expect(response?.status()).not.toBe(404);
      console.log(`✅ ${route} - Status: ${response?.status()}`);
    }
  });
});
