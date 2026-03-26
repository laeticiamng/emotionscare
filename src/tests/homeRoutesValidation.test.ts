// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Validation des routes principales - Correction 404', () => {
  test('la route racine / charge correctement', async ({ page }) => {
    console.log('🔍 Test de la route racine /');
    
    await page.goto('/');
    
    // Vérifier que la page se charge avec le bon contenu
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    await expect(page.locator('text=Espace Particulier')).toBeVisible();
    await expect(page.locator('text=Espace Entreprise')).toBeVisible();
    
    console.log('✅ Route racine / fonctionne correctement');
  });

  test('la route /auth charge correctement', async ({ page }) => {
    console.log('🔍 Test de la route /auth');
    
    await page.goto('/auth');
    
    // Vérifier que la page d'authentification se charge
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Authentification');
    await expect(page.locator('text=Connexion Particulier')).toBeVisible();
    await expect(page.locator('text=Connexion Entreprise')).toBeVisible();
    
    console.log('✅ Route /auth fonctionne correctement');
  });

  test('la route /choose-mode charge correctement', async ({ page }) => {
    console.log('🔍 Test de la route /choose-mode');
    
    await page.goto('/choose-mode');
    
    // Vérifier que la page de sélection se charge
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Choisissez votre mode d\'accès')).toBeVisible();
    await expect(page.locator('text=Particulier (B2C)')).toBeVisible();
    await expect(page.locator('text=Entreprise (B2B)')).toBeVisible();
    
    console.log('✅ Route /choose-mode fonctionne correctement');
  });

  test('navigation entre les pages principales', async ({ page }) => {
    console.log('🔍 Test de navigation entre les pages');
    
    // Commencer par la page d'accueil
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    
    // Naviguer vers choose-mode
    await page.click('text=Commencer maintenant');
    await expect(page).toHaveURL('/choose-mode');
    
    // Retourner à l'accueil
    await page.click('text=Retour');
    await expect(page).toHaveURL('/');
    
    // Naviguer vers auth
    await page.goto('/auth');
    await expect(page.locator('h1')).toContainText('Authentification');
    
    console.log('✅ Navigation entre les pages fonctionne');
  });

  test('toutes les routes principales retournent 200', async ({ page }) => {
    const routes = ['/', '/auth', '/choose-mode'];
    
    for (const route of routes) {
      console.log(`🔍 Test HTTP status pour ${route}`);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      console.log(`✅ ${route} - Status: 200`);
    }
  });
});
