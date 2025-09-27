
import { test, expect } from '@playwright/test';

test.describe('Correction erreur React #426 - Route /b2b', () => {
  test('la route /b2b ne génère plus d\'erreur React', async ({ page }) => {
    console.log('🔍 Test de correction erreur React #426 sur /b2b');
    
    // Écouter les erreurs JavaScript
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

    // Naviguer vers /b2b
    await page.goto('/b2b');
    
    // Attendre que la page soit complètement chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'aucune erreur React #426 n'est présente
    const reactErrors = jsErrors.filter(error => 
      error.includes('Minified React error #426') || 
      error.includes('React error #426')
    );
    
    expect(reactErrors).toHaveLength(0);
    
    // Vérifier que la redirection fonctionne correctement
    await expect(page).toHaveURL('/b2b/selection');
    
    // Vérifier que la page se charge sans erreur
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Espace Entreprise');
    
    // Vérifier que les boutons fonctionnent
    await expect(page.locator('text=Accéder en tant que Collaborateur')).toBeVisible();
    await expect(page.locator('text=Accéder en tant qu\'Administrateur')).toBeVisible();
    
    console.log('✅ Aucune erreur React #426 détectée');
    console.log('✅ Redirection /b2b → /b2b/selection OK');
    console.log('✅ Page se charge correctement');
    
    // Log final des erreurs pour debug
    if (jsErrors.length > 0) {
      console.log('⚠️ Autres erreurs JS détectées:', jsErrors);
    }
    if (consoleErrors.length > 0) {
      console.log('⚠️ Autres erreurs console détectées:', consoleErrors);
    }
  });

  test('navigation depuis /b2b vers les pages de connexion fonctionne', async ({ page }) => {
    await page.goto('/b2b');
    await expect(page).toHaveURL('/b2b/selection');
    
    // Test navigation vers login collaborateur
    await page.click('text=Accéder en tant que Collaborateur');
    await expect(page).toHaveURL('/b2b/user/login');
    
    // Retour à la sélection
    await page.goto('/b2b/selection');
    
    // Test navigation vers login admin
    await page.click('text=Accéder en tant qu\'Administrateur');
    await expect(page).toHaveURL('/b2b/admin/login');
    
    console.log('✅ Navigation entre les pages B2B fonctionne');
  });
});
