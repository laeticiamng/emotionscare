// @ts-nocheck
import { test, expect } from '@playwright/test';

/**
 * Tests E2E des parcours utilisateurs critiques
 * Coverage: Authentification, Dashboard, Modules clés
 */

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Naviguer vers l'accueil
    await page.goto('/');
  });

  test('Landing to Login flow', async ({ page }) => {
    console.log('Testing landing to login...');
    
    // Vérifier la page d'accueil
    await expect(page.locator('h1')).toContainText('EmotionsCare');
    
    // Cliquer sur "Se connecter"
    await page.click('text=Se connecter');
    
    // Vérifier qu'on est sur la page de login
    await expect(page).toHaveURL(/.*login.*/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    console.log('Landing to login flow ✅');
  });

  test('Signup form validation', async ({ page }) => {
    console.log('Testing signup validation...');
    
    await page.goto('/signup');
    
    // Vérifier présence du formulaire
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Tenter soumission vide
    await page.click('button[type="submit"]');
    
    // Vérifier messages d'erreur (validation HTML5 ou custom)
    const emailInput = page.locator('input[type="email"]');
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
    
    console.log('Signup validation ✅');
  });

  test('Dashboard navigation', async ({ page }) => {
    console.log('Testing dashboard navigation...');
    
    // Note: Ce test suppose qu'on peut accéder au dashboard sans auth (mode demo)
    // ou qu'il y a une auth mock en E2E
    await page.goto('/app/home');
    
    // Attendre le chargement
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 10000 });
    
    // Vérifier présence des éléments clés du dashboard
    const hasContent = await page.locator('body *:visible').count();
    expect(hasContent).toBeGreaterThan(0);
    
    console.log('Dashboard navigation ✅');
  });

  test('Module navigation - Scan émotionnel', async ({ page }) => {
    console.log('Testing emotion scan module...');
    
    await page.goto('/app/scan');
    
    // Attendre le chargement
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 10000 });
    
    // Vérifier le titre ou élément caractéristique
    await expect(page.locator('h1,h2,h3')).toContainText(/scan|émot/i);
    
    console.log('Emotion scan module ✅');
  });

  test('Module navigation - Journal', async ({ page }) => {
    console.log('Testing journal module...');
    
    await page.goto('/app/journal');
    
    // Attendre le chargement
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 10000 });
    
    // Vérifier le titre ou élément caractéristique
    await expect(page.locator('h1,h2,h3')).toContainText(/journal/i);
    
    console.log('Journal module ✅');
  });

  test('Module navigation - Musique', async ({ page }) => {
    console.log('Testing music module...');
    
    await page.goto('/app/music');
    
    // Attendre le chargement
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 10000 });
    
    // Vérifier le titre ou élément caractéristique
    await expect(page.locator('h1,h2,h3')).toContainText(/music|musique/i);
    
    console.log('Music module ✅');
  });

  test('Settings accessibility', async ({ page }) => {
    console.log('Testing settings access...');
    
    await page.goto('/app/settings');
    
    // Attendre le chargement
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 10000 });
    
    // Vérifier présence d'options de paramètres
    await expect(page.locator('text=/paramètre|setting|profil/i').first()).toBeVisible();
    
    console.log('Settings accessibility ✅');
  });

  test('Error handling - 404 page', async ({ page }) => {
    console.log('Testing 404 handling...');
    
    await page.goto('/nonexistent-route-test-404');
    
    // Vérifier page 404
    await page.waitForSelector('[data-testid="page-root"]', { timeout: 5000 });
    await expect(page.locator('text=/404|introuvable|not found/i')).toBeVisible();
    
    console.log('404 handling ✅');
  });

  test('Responsive design - Mobile viewport', async ({ page }) => {
    console.log('Testing mobile responsive...');
    
    // Définir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Vérifier que le contenu est visible
    await expect(page.locator('body')).toBeVisible();
    
    // Vérifier absence de scroll horizontal
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
    
    console.log('Mobile responsive ✅');
  });

  test('Keyboard navigation', async ({ page }) => {
    console.log('Testing keyboard navigation...');
    
    await page.goto('/');
    
    // Tab navigation
    await page.keyboard.press('Tab');
    
    // Vérifier qu'un élément a le focus
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
    
    console.log('Keyboard navigation ✅');
  });
});
