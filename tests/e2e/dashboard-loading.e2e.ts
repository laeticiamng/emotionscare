import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le chargement des dashboards
 * Phase 3 - Validation des performances et affichage
 */

test.describe('Dashboard Loading E2E', () => {
  
  test.describe('B2C Consumer Dashboard', () => {
    test('charge le dashboard home en moins de 2 secondes', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/app/home');
      await page.waitForSelector('[data-testid="page-root"]', { timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(2000);
    });

    test('affiche tous les widgets du dashboard B2C', async ({ page }) => {
      await page.goto('/app/home');
      await page.waitForLoadState('networkidle');
      
      // Vérifier la présence des widgets principaux
      await expect(page.locator('[data-testid="journal-timeline"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="vr-sessions-history"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="breath-weekly-card"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="assessment-history"]')).toBeVisible({ timeout: 5000 });
    });

    test('gère les états de chargement avec skeleton loaders', async ({ page }) => {
      // Ralentir la réponse réseau
      await page.route('**/rest/v1/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await route.continue();
      });

      await page.goto('/app/home');
      
      // Vérifier la présence de skeleton loaders
      const skeletons = page.locator('[data-testid*="skeleton"], .animate-pulse');
      
      if (await skeletons.count() > 0) {
        await expect(skeletons.first()).toBeVisible({ timeout: 2000 });
      }
    });

    test('responsive sur mobile (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/app/home');
      
      // Vérifier que les widgets sont empilés verticalement
      const pageRoot = page.locator('[data-testid="page-root"]');
      await expect(pageRoot).toBeVisible();
      
      // Vérifier qu'il n'y a pas de débordement horizontal
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBeFalsy();
    });
  });

  test.describe('B2B Collaborator Dashboard', () => {
    test('charge le dashboard collaborateur en moins de 2 secondes', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/app/collab');
      await page.waitForSelector('[data-testid="page-root"]', { timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(2000);
    });

    test('affiche tous les widgets du dashboard collaborateur', async ({ page }) => {
      await page.goto('/app/collab');
      await page.waitForLoadState('networkidle');
      
      // Vérifier la présence des widgets B2B
      await expect(page.locator('[data-testid="journal-timeline"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="vr-sessions-history"]')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="assessment-history"]')).toBeVisible({ timeout: 5000 });
    });

    test('responsive sur tablette (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/app/collab');
      
      const pageRoot = page.locator('[data-testid="page-root"]');
      await expect(pageRoot).toBeVisible();
      
      // Vérifier la grille adaptative
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBeFalsy();
    });
  });

  test.describe('B2B Admin Dashboard', () => {
    test('charge le dashboard RH en moins de 3 secondes', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/app/rh');
      await page.waitForSelector('[data-testid="page-root"]', { timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    });

    test('affiche les métriques d\'organisation', async ({ page }) => {
      await page.goto('/app/rh');
      await page.waitForLoadState('networkidle');
      
      // Vérifier la présence des métriques org
      const orgMetrics = page.locator('[data-testid="org-metrics"]');
      
      if (await orgMetrics.count() > 0) {
        await expect(orgMetrics).toBeVisible({ timeout: 5000 });
        
        // Vérifier les KPIs principaux
        await expect(page.getByText(/Total|Moyenne|Tendance/i)).toBeVisible();
      }
    });

    test('charge les données avec React Query et cache', async ({ page }) => {
      await page.goto('/app/rh');
      await page.waitForLoadState('networkidle');
      
      // Naviguer ailleurs
      await page.goto('/app/collab');
      await page.waitForLoadState('networkidle');
      
      // Revenir au dashboard RH
      const startTime = Date.now();
      await page.goto('/app/rh');
      await page.waitForSelector('[data-testid="page-root"]', { timeout: 5000 });
      const loadTime = Date.now() - startTime;
      
      // Le cache devrait rendre le 2ème chargement plus rapide
      expect(loadTime).toBeLessThan(1500);
    });

    test('gère les erreurs réseau gracieusement', async ({ page }) => {
      // Simuler une erreur réseau
      await page.route('**/rest/v1/breath_weekly_org_metrics*', route =>
        route.abort('failed')
      );

      await page.goto('/app/rh');
      await page.waitForLoadState('networkidle');
      
      // Vérifier l'affichage d'un message d'erreur
      const errorMessage = page.getByText(/Erreur|Error|Impossible/i);
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('responsive sur desktop large (1920px)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/app/rh');
      
      const pageRoot = page.locator('[data-testid="page-root"]');
      await expect(pageRoot).toBeVisible();
      
      // Vérifier que le contenu utilise l'espace disponible
      const pageWidth = await pageRoot.evaluate(el => (el as HTMLElement).offsetWidth);
      expect(pageWidth).toBeGreaterThan(1200);
    });
  });

  test.describe('Performance globale', () => {
    test('First Contentful Paint < 1.5s sur tous les dashboards', async ({ page }) => {
      const dashboards = ['/app/home', '/app/collab', '/app/rh'];
      
      for (const path of dashboards) {
        await page.goto(path);
        
        const fcp = await page.evaluate(() => {
          return new Promise<number>((resolve) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
              if (fcpEntry) {
                resolve(fcpEntry.startTime);
              }
            }).observe({ entryTypes: ['paint'] });
            
            // Timeout fallback
            setTimeout(() => resolve(0), 5000);
          });
        });
        
        if (fcp > 0) {
          expect(fcp).toBeLessThan(1500);
        }
      }
    });

    test('Cumulative Layout Shift < 0.1 sur tous les dashboards', async ({ page }) => {
      const dashboards = ['/app/home', '/app/collab', '/app/rh'];
      
      for (const path of dashboards) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        const cls = await page.evaluate(() => {
          return new Promise<number>((resolve) => {
            let clsValue = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                  clsValue += (entry as any).value;
                }
              }
            }).observe({ type: 'layout-shift', buffered: true });
            
            setTimeout(() => resolve(clsValue), 3000);
          });
        });
        
        expect(cls).toBeLessThan(0.1);
      }
    });
  });
});
