import { test, expect } from '@playwright/test';

test.describe('Validation complète de toutes les routes - Correction 404', () => {
  test('toutes les routes principales sont accessibles sans erreur 404', async ({ page }) => {
    console.log('🔍 Test complet de toutes les routes principales');
    
    const routes = [
      '/',
      '/choose-mode',
      '/auth',
      '/b2c',
      '/b2c/login',
      '/b2c/register',
      '/b2b',
      '/b2b/selection',
      '/b2b/user/login',
      '/b2b/admin/login'
    ];
    
    for (const route of routes) {
      console.log(`🔍 Test de la route: ${route}`);
      const response = await page.goto(route);
      
      // Vérifier que la route ne retourne pas 404
      expect(response?.status()).not.toBe(404);
      
      // Vérifier que la page se charge avec le bon élément racine
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ ${route} - Status: ${response?.status()} - OK`);
    }
  });

  test('navigation spécifique vers "espaces particuliers" fonctionne', async ({ page }) => {
    console.log('🔍 Test spécifique pour les espaces particuliers');
    
    // Test depuis la page d'accueil
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Cliquer sur "Espace Particulier"
    await page.click('text=Espace Particulier');
    await expect(page).toHaveURL('/b2c');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    console.log('✅ Navigation vers espaces particuliers depuis accueil - OK');
    
    // Test direct de l'URL
    await page.goto('/b2c');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Espace Particulier');
    
    console.log('✅ Accès direct à /b2c - OK');
  });

  test('navigation depuis espaces particuliers vers login/register', async ({ page }) => {
    await page.goto('/b2c');
    
    // Test navigation vers login
    await page.click('text=Se connecter');
    await expect(page).toHaveURL('/b2c/login');
    await expect(page.locator('h1')).toContainText('Connexion Particulier');
    
    // Retour à l'espace B2C
    await page.goto('/b2c');
    
    // Test navigation vers register
    await page.click('text=S\'inscrire');
    await expect(page).toHaveURL('/b2c/register');
    await expect(page.locator('h1')).toContainText('Inscription Particulier');
    
    console.log('✅ Navigation B2C complète - OK');
  });

  test('comparaison B2B vs B2C - les deux espaces fonctionnent', async ({ page }) => {
    // Test B2C
    await page.goto('/b2c');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Espace Particulier');
    
    // Test B2B
    await page.goto('/b2b');
    await expect(page).toHaveURL('/b2b/selection');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Espace Entreprise');
    
    console.log('✅ Les deux espaces (B2C et B2B) fonctionnent correctement');
  });
});
