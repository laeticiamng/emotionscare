// @ts-nocheck

import { test, expect } from '@playwright/test';

test.describe('No Blank Screen Tests - Version Corrigée', () => {
  test('homepage renders and mounts correctly', async ({ page }) => {
    console.log('Testing homepage with direct import...');
    
    // Aller à la racine
    await page.goto('/');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 10000 });
    
    // Vérifier le contenu spécifique de HomePage
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    await expect(page.locator('text=Page d\'accueil fonctionnelle')).toBeVisible();
    
    console.log('Homepage test passed ✅');
  });

  test('test page renders correctly', async ({ page }) => {
    console.log('Testing test page...');
    await page.goto('/test');
    
    // Attendre que le composant soit monté
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu spécifique
    await expect(page.locator('h1')).toContainText('Page de Test');
    
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
    await page.goto('/route-inexistante-test-404');
    
    // Attendre que la page 404 soit montée
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier le contenu 404
    await expect(page.locator('text=404 - Page introuvable')).toBeVisible();
    
    console.log('404 page test passed ✅');
  });

  test('home mounts with correct content', async ({ page }) => {
    console.log('Testing home mounting specifically...');
    await page.goto('/');
    
    // Test anti-blank : au moins un élément h1, h2 ou titre doit contenir "EmotionsCare"
    await expect(page.locator('h1,h2,b')).toContainText('EmotionsCare');
    
    console.log('Home mounting test passed ✅');
  });
});
