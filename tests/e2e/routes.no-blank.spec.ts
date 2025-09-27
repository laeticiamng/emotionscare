import { test, expect } from '@playwright/test';
import manifest from '../../scripts/routes/ROUTES_MANIFEST.json';

test.describe('Routes No-Blank Screen Tests', () => {
  // Test all routes from manifest
  for (const route of manifest.routes) {
    test(`${route.path} renders without blank screen`, async ({ page }) => {
      console.log(`Testing route: ${route.path}`);
      
      await page.goto(route.path);
      
      // Wait for the page root to be visible
      await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      
      // Ensure there's actual content (not just blank)
      const hasContent = await page.locator('body *:visible').count();
      expect(hasContent).toBeGreaterThan(0);
      
      console.log(`✅ Route ${route.path} rendered successfully`);
    });
  }

  // Test aliases redirect properly
  test.describe('Alias redirections', () => {
    for (const alias of manifest.aliases) {
      test(`${alias.from} redirects to ${alias.to}`, async ({ page }) => {
        await page.goto(alias.from);
        
        // Wait for redirect and check final URL
        await page.waitForURL(alias.to, { timeout: 5000 });
        expect(page.url()).toContain(alias.to);
        
        // Ensure page loads properly after redirect  
        await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
      });
    }
  });

  test('404 page handles unknown routes', async ({ page }) => {
    await page.goto('/route-inexistante-test-404');
    
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible({ timeout: 5000 });
    // Should show 404 content
    await expect(page.locator('text=404')).toBeVisible();
  });
});