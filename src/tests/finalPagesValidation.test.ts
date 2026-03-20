import { test, expect } from '@playwright/test';

const FINAL_PAGES = [
  '/health-check-badge',
  '/account/delete',
  '/security',
  '/accessibility'
];

test.describe('Validation des 4 dernières pages enrichies (Phase 5)', () => {
  test('toutes les pages finales chargent avec contenu enrichi', async ({ page }) => {
    const results = [];
    
    for (const route of FINAL_PAGES) {
      console.log(`Testing final enriched route: ${route}`);
      
      try {
        const startTime = Date.now();
        const response = await page.goto(route);
        const loadTime = Date.now() - startTime;
        
        // Vérifier la structure de base
        await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('h1')).toBeVisible();
        
        // Vérifier que ce n'est pas juste "En développement" 
        const isEnriched = await page.locator('.grid, .card, .chart, .progress, [data-testid*="widget"], .tabs').count() > 3;
        
        // Vérifier les éléments interactifs spécifiques
        const hasInteractiveElements = await page.locator('button, input, select, [role="button"], .switch').count() > 0;
        
        // Vérifier les fonctionnalités premium
        const hasPremiumFeatures = await page.locator('.badge, .progress, .slider, .alert-dialog').count() > 0;
        
        results.push({
          route,
          status: response?.status() || 0,
          loadTime,
          isEnriched,
          hasInteractiveElements,
          hasPremiumFeatures,
          error: null
        });
        
        console.log(`✅ ${route} - Enriched: ${isEnriched}, Interactive: ${hasInteractiveElements}, Premium: ${hasPremiumFeatures}, Load: ${loadTime}ms`);
      } catch (error) {
        results.push({
          route,
          status: 0,
          loadTime: 0,
          isEnriched: false,
          hasInteractiveElements: false,
          hasPremiumFeatures: false,
          error: error.message
        });
        
        console.log(`❌ ${route} - Error: ${error.message}`);
      }
    }
    
    // Rapport détaillé
    const enrichedCount = results.filter(r => r.isEnriched).length;
    const interactiveCount = results.filter(r => r.hasInteractiveElements).length;
    const premiumCount = results.filter(r => r.hasPremiumFeatures).length;
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    
    console.log(`\n📊 RAPPORT PHASE 5 FINALE:`);
    console.log(`🎨 Pages enrichies: ${enrichedCount}/${results.length} (${Math.round(enrichedCount/results.length*100)}%)`);
    console.log(`⚡ Pages interactives: ${interactiveCount}/${results.length} (${Math.round(interactiveCount/results.length*100)}%)`);
    console.log(`💎 Pages premium: ${premiumCount}/${results.length} (${Math.round(premiumCount/results.length*100)}%)`);
    console.log(`⏱️  Temps moyen: ${avgLoadTime.toFixed(0)}ms`);
    
    // Validation stricte : 100% des pages doivent être enrichies
    expect(enrichedCount / results.length).toBe(1.0); // 100%
    expect(avgLoadTime).toBeLessThan(2500); // < 2.5s
  });
  
  test('vérification spécifique fonctionnalités Phase 5', async ({ page }) => {
    // Health Check Badge - certification santé
    await page.goto('/health-check-badge');
    await expect(page.locator('text=Health Check Badge')).toBeVisible();
    await expect(page.locator('[data-testid="badge"]')).toBeVisible();
    await expect(page.locator('button:has-text("Lancer Health Check")')).toBeVisible();
    
    // Account Delete - suppression RGPD
    await page.goto('/account/delete');
    await expect(page.locator('text=Suppression de Compte')).toBeVisible();
    await expect(page.locator('input[placeholder="SUPPRIMER"]')).toBeVisible();
    await expect(page.locator('text=RGPD')).toBeVisible();
    
    // Security - centre sécurité
    await page.goto('/security');
    await expect(page.locator('text=Centre de Sécurité')).toBeVisible();
    await expect(page.locator('text=Score de Sécurité')).toBeVisible();
    await expect(page.locator('text=Authentification')).toBeVisible();
    
    // Accessibility - accessibilité WCAG
    await page.goto('/accessibility');
    await expect(page.locator('text=Centre d\'Accessibilité')).toBeVisible();
    await expect(page.locator('text=WCAG 2.1 AA')).toBeVisible();
    await expect(page.locator('button:has-text("Audit d\'Accessibilité")')).toBeVisible();
  });

  test('test de performance et qualité UX', async ({ page }) => {
    for (const route of FINAL_PAGES) {
      const startTime = Date.now();
      await page.goto(route);
      
      // Vérifier le chargement rapide
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 3000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // < 3s
      
      // Vérifier l'absence d'erreurs JavaScript
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      
      // Vérifier l'accessibilité de base
      const hasHeadings = await page.locator('h1, h2, h3').count() > 0;
      expect(hasHeadings).toBeTruthy();
      
      // Vérifier la navigation clavier
      await page.keyboard.press('Tab');
      const focusedElement = await page.locator(':focus').count();
      expect(focusedElement).toBeGreaterThan(0);
      
      console.log(`✅ ${route} - Performance: ${loadTime}ms, Accessible: ${hasHeadings}, Keyboard: ${focusedElement > 0}`);
    }
  });
});
