import { test, expect } from '@playwright/test';

const B2B_ROUTES = [
  '/b2b',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/admin/login',
  '/b2b/user/dashboard',
  '/b2b/admin/dashboard'
];

test.describe('Validation complète des routes B2B - Audit de correction', () => {
  test('toutes les routes B2B sont accessibles et fonctionnelles', async ({ page }) => {
    console.log('🔍 AUDIT COMPLET DES ROUTES B2B');
    
    const results = [];
    
    for (const route of B2B_ROUTES) {
      console.log(`Testing B2B route: ${route}`);
      
      try {
        const startTime = Date.now();
        const response = await page.goto(route);
        const loadTime = Date.now() - startTime;
        
        // Vérifier que la page se charge correctement
        await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
        
        // Vérifier qu'il n'y a pas d'erreur 404
        expect(response?.status()).toBe(200);
        
        // Vérifier que le contenu est présent
        const hasContent = await page.locator('h1').isVisible();
        expect(hasContent).toBeTruthy();
        
        results.push({
          route,
          status: response?.status() || 200,
          loadTime,
          hasContent,
          error: null
        });
        
        console.log(`✅ ${route} - Status: ${response?.status()}, Load: ${loadTime}ms`);
      } catch (error) {
        results.push({
          route,
          status: 0,
          loadTime: 0,
          hasContent: false,
          error: error.message
        });
        
        console.log(`❌ ${route} - Error: ${error.message}`);
      }
    }
    
    // Rapport final
    const successCount = results.filter(r => r.status === 200).length;
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    
    console.log(`\n📊 RAPPORT AUDIT B2B:`);
    console.log(`✅ Routes fonctionnelles: ${successCount}/${results.length}`);
    console.log(`⏱️  Temps moyen: ${avgLoadTime.toFixed(0)}ms`);
    
    // Toutes les routes doivent être fonctionnelles
    expect(successCount).toBe(results.length);
    expect(avgLoadTime).toBeLessThan(3000); // < 3s
  });
  
  test('navigation entre les pages B2B fonctionne', async ({ page }) => {
    console.log('🔍 Test de navigation B2B');
    
    // Commencer par la redirection /b2b
    await page.goto('/b2b');
    await expect(page).toHaveURL('/b2b/selection');
    
    // Aller vers connexion utilisateur
    await page.goto('/b2b/user/login');
    await expect(page.locator('h1')).toContainText('Connexion Utilisateur B2B');
    
    // Aller vers connexion admin
    await page.goto('/b2b/admin/login');
    await expect(page.locator('h1')).toContainText('Connexion Administrateur B2B');
    
    // Vérifier les dashboards (sans authentification pour le test)
    await page.goto('/b2b/user/dashboard');
    await expect(page.locator('h1')).toContainText('Tableau de bord utilisateur B2B');
    
    await page.goto('/b2b/admin/dashboard');
    await expect(page.locator('h1')).toContainText('Tableau de bord administrateur');
    
    console.log('✅ Navigation B2B complète');
  });
  
  test('fonctionnalités spécifiques des pages B2B', async ({ page }) => {
    // Page de sélection
    await page.goto('/b2b/selection');
    await expect(page.locator('text=Choisissez votre espace professionnel')).toBeVisible();
    await expect(page.locator('text=Utilisateur')).toBeVisible();
    await expect(page.locator('text=Administrateur')).toBeVisible();
    
    // Page de connexion utilisateur
    await page.goto('/b2b/user/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Page de connexion admin
    await page.goto('/b2b/admin/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Dashboard utilisateur
    await page.goto('/b2b/user/dashboard');
    await expect(page.locator('text=Scans émotionnels')).toBeVisible();
    await expect(page.locator('text=Sessions coaching')).toBeVisible();
    
    // Dashboard admin
    await page.goto('/b2b/admin/dashboard');
    await expect(page.locator('text=Utilisateurs actifs')).toBeVisible();
    await expect(page.locator('text=Bien-être global')).toBeVisible();
    
    console.log('✅ Fonctionnalités B2B vérifiées');
  });
});
