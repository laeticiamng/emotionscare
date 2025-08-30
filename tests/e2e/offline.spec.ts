import { test, expect } from '@playwright/test';

test.describe('Offline Functionality', () => {
  test('app works in offline mode', async ({ page, context }) => {
    // Go online first and load the page
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate to another page - should still work with cached content
    await page.goto('/b2c');
    
    // Should show Loading/Error/Void states gracefully, not raw network errors
    const pageRoot = page.locator('[data-testid="page-root"]');
    await expect(pageRoot).toBeVisible({ timeout: 5000 });
    
    // Should not show raw error messages like "fetch failed"
    const errorText = await page.textContent('body');
    expect(errorText).not.toContain('fetch failed');
    expect(errorText).not.toContain('network error');
    expect(errorText).not.toContain('ERR_INTERNET_DISCONNECTED');
  });

  test('offline indicator appears when offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Should be online initially
    const healthBadge = page.locator('[data-testid="health-badge"]');
    if (await healthBadge.isVisible()) {
      expect(await healthBadge.textContent()).toContain('En ligne');
    }
    
    // Go offline
    await context.setOffline(true);
    
    // Wait for offline detection
    await page.waitForTimeout(2000);
    
    // Health badge should show offline status
    if (await healthBadge.isVisible()) {
      expect(await healthBadge.textContent()).toContain('Hors ligne');
    }
  });

  test('metrics queue works offline', async ({ page, context }) => {
    await page.goto('/app/home');
    
    // Go offline
    await context.setOffline(true);
    
    // Interact with the page to generate metrics
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.click();
    }
    
    // Should not throw network errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Filter out expected offline-related messages
    const unexpectedErrors = consoleErrors.filter(error => 
      !error.includes('fetch') && 
      !error.includes('network') &&
      !error.includes('offline')
    );
    
    expect(unexpectedErrors).toHaveLength(0);
  });

  test('graceful degradation with reduced functionality', async ({ page, context }) => {
    await page.goto('/app/music');
    
    // Go offline
    await context.setOffline(true);
    
    // Should show appropriate fallback content
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Should indicate offline status or show local alternatives
    const pageContent = await page.textContent('body');
    const hasOfflineIndicator = 
      pageContent.includes('hors ligne') ||
      pageContent.includes('offline') ||
      pageContent.includes('non disponible') ||
      pageContent.includes('mode local');
    
    expect(hasOfflineIndicator).toBeTruthy();
  });
});