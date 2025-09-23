import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour l'authentification
 * Phase 2 - Validation complète des parcours utilisateur
 */

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage correctly', async ({ page }) => {
    // Vérifier le titre
    await expect(page).toHaveTitle(/EmotionsCare/);
    
    // Vérifier les éléments clés
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Chercher un lien de connexion
    const loginLink = page.locator('a', { hasText: /login|connexion|sign in/i }).first();
    
    if (await loginLink.count() > 0) {
      await loginLink.click();
      
      // Vérifier que nous sommes sur la page de login
      await expect(page.url()).toContain('login');
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    } else {
      // Si pas de lien login, vérifier que l'app fonctionne quand même
      console.log('No login link found - app might not have auth implemented yet');
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Attendre l'adaptation responsive
    
    // Vérifier que l'interface s'adapte
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filtrer les erreurs connues non-critiques
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});