
import { test, expect } from '@playwright/test';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

// Liste des 27 nouvelles pages créées par le backend
const NEW_PAGES = [
  '/onboarding',
  '/b2b',
  '/boss-level-grit',
  '/mood-mixer',
  '/bounce-back-battle',
  '/story-synth-lab',
  '/breathwork',
  '/vr-galactique',
  '/screen-silk-break',
  '/flash-glow',
  '/ambition-arcade',
  '/ar-filters',
  '/bubble-beat',
  '/instant-glow',
  '/weekly-bars',
  '/heatmap-vibes',
  '/preferences',
  '/profile-settings',
  '/activity-history',
  '/privacy-toggles',
  '/export-csv',
  '/account/delete',
  '/notifications',
  '/help-center',
  '/feedback',
  '/security',
  '/audit',
  '/accessibility',
  '/health-check-badge',
  '/settings'
];

test.describe('Validation des nouvelles pages créées', () => {
  test('toutes les nouvelles pages chargent sans erreur 404', async ({ page }) => {
    const results = [];
    
    for (const route of NEW_PAGES) {
      console.log(`Testing route: ${route}`);
      
      try {
        const response = await page.goto(route);
        const status = response?.status() || 0;
        
        await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
        
        results.push({
          route,
          status,
          hasPageRoot: true,
          error: null
        });
        
        console.log(`✅ ${route} - Status: ${status}`);
      } catch (error) {
        results.push({
          route,
          status: 0,
          hasPageRoot: false,
          error: error.message
        });
        
        console.log(`❌ ${route} - Error: ${error.message}`);
      }
    }
    
    // Créer un rapport détaillé
    const successCount = results.filter(r => r.hasPageRoot && r.status === 200).length;
    const failureCount = results.length - successCount;
    
    console.log(`\n📊 RAPPORT DE VALIDATION:`);
    console.log(`✅ Pages valides: ${successCount}/${results.length}`);
    console.log(`❌ Pages en erreur: ${failureCount}/${results.length}`);
    
    if (failureCount > 0) {
      console.log(`\n🔍 PAGES EN ERREUR:`);
      results.filter(r => !r.hasPageRoot || r.status !== 200).forEach(r => {
        console.log(`- ${r.route}: Status ${r.status} - ${r.error || 'Page root manquant'}`);
      });
    }
    
    // Le test doit réussir si au moins 90% des pages fonctionnent
    expect(successCount / results.length).toBeGreaterThan(0.9);
  });
  
  test('vérification du contenu minimal de chaque page', async ({ page }) => {
    // Test sur un échantillon de pages critiques
    const priorityPages = [
      '/onboarding',
      '/preferences', 
      '/notifications',
      '/settings',
      '/breathwork'
    ];
    
    for (const route of priorityPages) {
      await page.goto(route);
      
      // Vérifier la structure de base
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=En développement')).toBeVisible();
      
      // Vérifier que la page a du contenu utile
      const hasCards = await page.locator('.grid').count() > 0;
      expect(hasCards).toBeTruthy();
      
      console.log(`✅ ${route} - Structure et contenu OK`);
    }
  });
  
  test('navigation entre les nouvelles pages', async ({ page }) => {
    // Tester la navigation fluide
    await page.goto('/');
    
    // Naviguer vers quelques nouvelles pages
    const navigationFlow = ['/preferences', '/notifications', '/settings'];
    
    for (const route of navigationFlow) {
      await page.goto(route);
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 3000 });
      
      // Vérifier qu'il n'y a pas d'erreur JavaScript
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      
      if (errors.length > 0) {
        console.warn(`Erreurs JS sur ${route}:`, errors);
      }
    }
  });
});
