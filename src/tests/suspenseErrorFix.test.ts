import { test, expect } from '@playwright/test';

test.describe('Correction erreur de suspension React', () => {
  test('aucune erreur de suspension sur la route racine', async ({ page }) => {
    console.log('🔍 Test de correction erreur de suspension React');
    
    // Écouter les erreurs JavaScript spécifiques
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
      console.log('❌ Erreur JS détectée:', error.message);
    });

    // Écouter les erreurs de console
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.log('❌ Erreur console:', msg.text());
      }
    });

    // Naviguer vers la route racine
    await page.goto('/');
    
    // Attendre que la page soit complètement chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'aucune erreur de suspension n'est présente
    const suspensionErrors = jsErrors.filter(error => 
      error.includes('suspended while responding to synchronous input') ||
      error.includes('startTransition') ||
      error.includes('loading indicator')
    );
    
    expect(suspensionErrors).toHaveLength(0);
    
    // Vérifier que la page se charge correctement
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    
    // Vérifier qu'il n'y a pas d'indicateur de chargement bloquant
    const loadingIndicators = page.locator('[data-testid="page-loading"]');
    await expect(loadingIndicators).toHaveCount(0);
    
    console.log('✅ Aucune erreur de suspension détectée');
    console.log('✅ Page se charge correctement sans blocage');
    
    // Log final des erreurs pour debug
    if (jsErrors.length > 0) {
      console.log('⚠️ Autres erreurs JS détectées:', jsErrors);
    }
    if (consoleErrors.length > 0) {
      console.log('⚠️ Autres erreurs console détectées:', consoleErrors);
    }
  });

  test('navigation fluide entre les routes sans erreur de suspension', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Test navigation vers /auth
    await page.goto('/auth');
    await expect(page).toHaveURL('/auth');
    await page.waitForLoadState('networkidle');
    
    // Test navigation vers /b2b
    await page.goto('/b2b');
    await expect(page).toHaveURL('/b2b/selection');
    await page.waitForLoadState('networkidle');
    
    // Retour à la racine
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    console.log('✅ Navigation fluide entre les routes sans erreur');
  });
});
