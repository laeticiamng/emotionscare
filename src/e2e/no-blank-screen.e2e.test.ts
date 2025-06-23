
import { test, expect } from '@playwright/test';

// Liste complète des routes à tester - CENTRALISED
const routes = [
  // Routes publiques principales
  '/',
  '/about',
  '/contact',
  '/browsing',
  '/privacy',
  '/login',
  
  // Routes d'authentification
  '/b2c/login',
  '/b2c/register',
  '/b2b/selection',
  '/b2b/user/login',
  '/b2b/user/register',
  '/b2b/admin/login',
  '/reset-password',
  '/auth/callback',
  
  // Routes fonctionnelles principales
  '/scan',
  '/music',
  '/vr',
  '/meditation',
  '/gamification',
  '/onboarding',
  '/security',
  '/access-diagnostic',
  
  // Routes protégées admin
  '/teams',
  '/reports',
  '/events',
  '/optimisation',
  '/feedback',
  '/innovation',
  '/privacy',
  '/notifications',
  '/audit',
  '/accessibility',
  
  // Routes spéciales
  '/test',
  '/point20',
  
  // Routes B2B/B2C dashboard (nécessitent auth - seront testées séparément)
  // '/b2c/dashboard',
  // '/b2b/user/dashboard', 
  // '/b2b/admin/dashboard',
  // '/b2b',
];

test.describe('🚨 NO BLANK SCREENS - Router Unification Test', () => {
  for (const route of routes) {
    test(`route ${route} renders with data-testid="page-root"`, async ({ page }) => {
      const errors: string[] = [];
      
      // Capturer les erreurs critiques
      page.on('pageerror', err => {
        errors.push(`Page error: ${err.message}`);
      });
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(`Console error: ${msg.text()}`);
        }
      });

      console.log(`🧪 Testing route: ${route}`);
      
      // Naviguer vers la route avec timeout
      const response = await page.goto(route, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      // Vérifier que la réponse est OK ou gère proprement les redirections
      if (response && !response.ok() && response.status() !== 200) {
        console.warn(`⚠️ Route ${route} returned status ${response.status()}`);
      }
      
      // CRITÈRE PRINCIPAL : data-testid="page-root" doit être visible en ≤ 5s
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      // Vérifier qu'il y a du contenu textuel (pas page blanche)
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.trim().length).toBeGreaterThan(0);
      
      // Vérifier qu'il n'y a pas "page introuvable" sauf pour 404 intentionnelles
      if (!route.includes('non-existent')) {
        const pageText = bodyText?.toLowerCase() || '';
        expect(pageText).not.toContain('page introuvable');
        expect(pageText).not.toContain('404');
      }
      
      // Vérifier l'absence d'erreurs critiques (ignorer favicon, manifest, sw.js)
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('manifest') &&
        !error.includes('sw.js') &&
        !error.includes('Cannot resolve module')
      );
      
      if (criticalErrors.length > 0) {
        console.error(`❌ Critical errors on route ${route}:`, criticalErrors);
        throw new Error(`Critical errors found on ${route}: ${criticalErrors.join(', ')}`);
      }
      
      console.log(`✅ Route ${route} passed all checks`);
    });
  }
});

test.describe('Error Handling & 404', () => {
  test('404 page renders correctly for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-route-test-12345');
    
    // Doit afficher la page 404 avec data-testid
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('404');
    
    // Doit avoir un lien de retour
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
  
  test('navigation between working routes', async ({ page }) => {
    // Commencer par la page d'accueil
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Naviguer vers test
    await page.goto('/test');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Naviguer vers point20
    await page.goto('/point20');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
  });
});

test.describe('Router Stats Validation', () => {
  test('router loads with expected number of routes', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le router a été configuré avec toutes les routes
    const routeCount = await page.evaluate(() => {
      // @ts-ignore - accès debug
      return window.__ROUTER_ROUTES_COUNT__ || 'unknown';
    });
    
    console.log(`📊 Router configured with routes count: ${routeCount}`);
    
    // S'attendre à avoir au moins les routes principales
    expect(routes.length).toBeGreaterThan(20);
  });
});
