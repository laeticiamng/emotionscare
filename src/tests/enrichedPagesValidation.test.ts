// @ts-nocheck
import { test, expect } from '@playwright/test';

// Pages enrichies - Phases 1 & 2 (10 pages)
const ENRICHED_PAGES = [
  // Phase 1
  { route: '/onboarding', title: 'Bienvenue sur EmotionsCare', hasForm: true },
  { route: '/preferences', title: 'Mes Préférences', hasForm: true },
  { route: '/notifications', title: 'Centre de Notifications', hasActions: true },
  { route: '/breathwork', title: 'Respiration Thérapeutique', hasInteractive: true },
  { route: '/settings', title: 'Paramètres Plateforme', hasTabbed: true },
  
  // Phase 2
  { route: '/b2b', title: 'Solutions Entreprise', hasCTA: true },
  { route: '/vr-galactique', title: 'VR Galactique', hasImmersive: true },
  { route: '/mood-mixer', title: 'Mood Mixer', hasCreative: true },
  { route: '/help-center', title: 'Centre d\'aide', hasSearch: true },
  { route: '/audit', title: 'Audit Système', hasData: true }
];

test.describe('Tests des Pages Enrichies - Phases 1 & 2', () => {
  test('toutes les pages enrichies chargent avec contenu complet', async ({ page }) => {
    for (const pageInfo of ENRICHED_PAGES) {
      console.log(`🧪 Testing enriched page: ${pageInfo.route}`);
      
      await page.goto(pageInfo.route);
      
      // Vérifier le chargement de base
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      // Vérifier le titre
      await expect(page.locator('h1')).toContainText(pageInfo.title);
      
      // Vérifier qu'il n'y a plus le message "En développement"
      await expect(page.locator('text=En développement')).not.toBeVisible();
      
      // Tests spécifiques selon le type de page
      if (pageInfo.hasForm) {
        await expect(page.locator('form')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
      }
      
      if (pageInfo.hasActions) {
        await expect(page.locator('button')).toHaveCount(1, { timeout: 3000 });
      }
      
      if (pageInfo.hasInteractive) {
        await expect(page.locator('[role="button"]')).toBeVisible();
      }
      
      if (pageInfo.hasTabbed) {
        await expect(page.locator('[role="tablist"]')).toBeVisible();
      }
      
      if (pageInfo.hasCTA) {
        await expect(page.locator('text=Commencer')).toBeVisible();
      }
      
      if (pageInfo.hasImmersive) {
        await expect(page.locator('canvas, video, .immersive-content')).toBeVisible();
      }
      
      if (pageInfo.hasCreative) {
        await expect(page.locator('.creative-tools, .mood-controls')).toBeVisible();
      }
      
      if (pageInfo.hasSearch) {
        await expect(page.locator('input[type="search"]')).toBeVisible();
      }
      
      if (pageInfo.hasData) {
        await expect(page.locator('table, .data-grid')).toBeVisible();
      }
      
      console.log(`✅ ${pageInfo.route} - Enriched content validated`);
    }
  });
  
  test('navigation entre pages enrichies fonctionne', async ({ page }) => {
    // Test flow : Onboarding → Preferences → Notifications
    await page.goto('/onboarding');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Navigation vers Preferences (si bouton disponible)
    const prefButton = page.locator('text=Paramètres, text=Préférences').first();
    if (await prefButton.isVisible()) {
      await prefButton.click();
      await expect(page.locator('h1')).toContainText('Préférences');
    }
    
    // Navigation directe vers notifications
    await page.goto('/notifications');
    await expect(page.locator('h1')).toContainText('Notifications');
    
    console.log('✅ Navigation flow validated');
  });
  
  test('performance des pages enrichies', async ({ page }) => {
    const performanceResults = [];
    
    for (const pageInfo of ENRICHED_PAGES.slice(0, 5)) { // Test sur 5 pages
      const startTime = Date.now();
      
      await page.goto(pageInfo.route);
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      
      performanceResults.push({
        route: pageInfo.route,
        loadTime,
        status: loadTime < 2000 ? 'GOOD' : loadTime < 4000 ? 'OK' : 'SLOW'
      });
      
      console.log(`⏱️ ${pageInfo.route}: ${loadTime}ms - ${performanceResults[performanceResults.length - 1].status}`);
    }
    
    // Au moins 80% des pages doivent charger en moins de 4s
    const goodPerformance = performanceResults.filter(r => r.loadTime < 4000).length;
    expect(goodPerformance / performanceResults.length).toBeGreaterThan(0.8);
    
    console.log(`📊 Performance: ${goodPerformance}/${performanceResults.length} pages under 4s`);
  });
});
