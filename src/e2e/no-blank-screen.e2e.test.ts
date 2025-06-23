
import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/choose-mode',
  '/b2b/selection',
  '/b2b',
  '/scan',
  '/music',
  '/coach',
  '/journal',
  '/b2c/login',
  '/b2c/register',
  '/b2c/dashboard',
  '/b2b/user/login',
  '/b2b/user/dashboard',
  '/b2b/admin/login',
  '/b2b/admin/dashboard',
  '/vr',
  '/preferences',
  '/gamification',
  '/social-cocon',
  // Pages premium
  '/boss-level-grit',
  '/mood-mixer',
  '/ambition-arcade',
  '/bounce-back-battle',
  '/story-synth-lab',
  '/flash-glow',
  '/instant-glow',
  '/ar-filters',
  '/bubble-beat',
  '/screen-silk-break',
  '/vr-galactique',
  '/weekly-bars',
  '/heatmap-vibes',
  '/breathwork',
  '/privacy-toggles',
  '/export-csv',
  '/health-check-badge',
  '/onboarding-flow',
  '/notifications',
  '/help-center',
  '/profile-settings',
  '/activity-history',
  '/feedback'
];

test.describe('No Blank Screens - All Routes Must Render Content', () => {
  for (const route of routes) {
    test(`route ${route} renders visible content`, async ({ page }) => {
      const errors: string[] = [];
      
      // Capturer les erreurs
      page.on('pageerror', err => {
        errors.push(`Page error: ${err.message}`);
      });
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(`Console error: ${msg.text()}`);
        }
      });

      // Naviguer vers la route
      const response = await page.goto(route, { 
        waitUntil: 'networkidle',
        timeout: 10000 
      });
      
      // Vérifier que la réponse est OK
      expect(response?.ok()).toBeTruthy();
      
      // Attendre que l'élément racine soit visible
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      // Vérifier qu'il y a du contenu textuel
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.trim().length).toBeGreaterThan(0);
      
      // Vérifier qu'il n'y a pas d'erreurs critiques
      const criticalErrors = errors.filter(error => 
        !error.includes('favicon') && 
        !error.includes('manifest') &&
        !error.includes('sw.js')
      );
      
      if (criticalErrors.length > 0) {
        console.error(`Errors on route ${route}:`, criticalErrors);
      }
      
      expect(criticalErrors.length).toBe(0);
    });
  }
});

test.describe('Error Handling', () => {
  test('404 page renders correctly', async ({ page }) => {
    await page.goto('/non-existent-route');
    
    // Doit afficher la page 404
    await expect(page.locator('h1')).toContainText('404');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Doit avoir un lien de retour
    await expect(page.locator('a[href="/"]')).toBeVisible();
  });
  
  test('navigation between routes works', async ({ page }) => {
    // Commencer par la page d'accueil
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Naviguer vers choose-mode
    await page.click('a[href="/choose-mode"]');
    await expect(page).toHaveURL('/choose-mode');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Naviguer vers B2B
    await page.click('a[href="/b2b/selection"]');
    await expect(page).toHaveURL('/b2b/selection');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
  });
});
