
import { test, expect } from '@playwright/test';

test.describe('No Blank Screen Tests', () => {
  test('homepage renders correctly', async ({ page }) => {
    console.log('Testing homepage...');
    await page.goto('/');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu spécifique
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    await expect(page.locator('text=Page d\'accueil active')).toBeVisible();
    
    console.log('Homepage test passed ✅');
  });

  test('test page renders correctly', async ({ page }) => {
    console.log('Testing test page...');
    await page.goto('/test');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu spécifique
    await expect(page.locator('h1')).toContainText('Page de Test');
    await expect(page.locator('text=Test réussi')).toBeVisible();
    
    console.log('Test page test passed ✅');
  });

  test('point20 page renders correctly', async ({ page }) => {
    console.log('Testing point20 page...');
    await page.goto('/point20');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    console.log('Point20 page test passed ✅');
  });

  test('404 page renders for unknown routes', async ({ page }) => {
    console.log('Testing 404 page...');
    await page.goto('/non-existent-route');
    
    // Attendre que la page 404 soit montée
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu 404
    await expect(page.locator('text=404 - Page introuvable')).toBeVisible();
    
    console.log('404 page test passed ✅');
  });
});
