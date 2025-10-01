// @ts-nocheck

import { test, expect } from '@playwright/test';

const PHASE3_PAGES = [
  '/boss-level-grit',
  '/bounce-back-battle', 
  '/story-synth-lab',
  '/screen-silk-break',
  '/flash-glow'
];

test.describe('Validation des pages enrichies Phase 3', () => {
  test('toutes les pages Phase 3 chargent avec contenu enrichi', async ({ page }) => {
    const results = [];
    
    for (const route of PHASE3_PAGES) {
      console.log(`Testing enriched route: ${route}`);
      
      try {
        const startTime = Date.now();
        const response = await page.goto(route);
        const loadTime = Date.now() - startTime;
        
        // Vérifier la structure de base
        await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('h1')).toBeVisible();
        
        // Vérifier que ce n'est pas juste "En développement" 
        const isEnriched = await page.locator('.grid, .card, .chart, .progress, [data-testid*="widget"]').count() > 2;
        
        // Vérifier les éléments interactifs
        const hasInteractiveElements = await page.locator('button, input, select, [role="button"]').count() > 0;
        
        results.push({
          route,
          status: response?.status() || 0,
          loadTime,
          isEnriched,
          hasInteractiveElements,
          error: null
        });
        
        console.log(`✅ ${route} - Enriched: ${isEnriched}, Interactive: ${hasInteractiveElements}, Load: ${loadTime}ms`);
      } catch (error) {
        results.push({
          route,
          status: 0,
          loadTime: 0,
          isEnriched: false,
          hasInteractiveElements: false,
          error: error.message
        });
        
        console.log(`❌ ${route} - Error: ${error.message}`);
      }
    }
    
    // Rapport détaillé
    const enrichedCount = results.filter(r => r.isEnriched).length;
    const interactiveCount = results.filter(r => r.hasInteractiveElements).length;
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
    
    console.log(`\n📊 RAPPORT PHASE 3:`);
    console.log(`🎨 Pages enrichies: ${enrichedCount}/${results.length}`);
    console.log(`⚡ Pages interactives: ${interactiveCount}/${results.length}`);
    console.log(`⏱️  Temps moyen: ${avgLoadTime.toFixed(0)}ms`);
    
    // Validation : au moins 80% des pages doivent être enrichies
    expect(enrichedCount / results.length).toBeGreaterThan(0.8);
    expect(avgLoadTime).toBeLessThan(3000); // < 3s
  });
  
  test('vérification spécifique fonctionnalités Phase 3', async ({ page }) => {
    // Boss Level Grit - gamification
    await page.goto('/boss-level-grit');
    await expect(page.locator('text=Niveau')).toBeVisible();
    await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible();
    
    // Bounce Back Battle - résilience
    await page.goto('/bounce-back-battle');
    await expect(page.locator('text=Challenge')).toBeVisible();
    await expect(page.locator('button[data-testid="start-challenge"]')).toBeVisible();
    
    // Story Synth Lab - créativité
    await page.goto('/story-synth-lab');
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('text=Générer')).toBeVisible();
    
    // Screen Silk Break - wellness
    await page.goto('/screen-silk-break');
    await expect(page.locator('text=Pause')).toBeVisible();
    await expect(page.locator('[data-testid="timer"]')).toBeVisible();
    
    // Flash Glow - innovation
    await page.goto('/flash-glow');
    await expect(page.locator('text=Instant')).toBeVisible();
    await expect(page.locator('button[data-testid="flash-action"]')).toBeVisible();
  });
});
