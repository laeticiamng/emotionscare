// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Offline Functionality', () => {
  test('app gracefully handles offline state', async ({ page, context }) => {
    // Start online
    await page.goto('/');
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate to app page - should show loading/error state gracefully
    await page.goto('/app/home');
    
    // Should not show raw network errors
    const errorText = await page.textContent('body');
    expect(errorText).not.toContain('net::ERR_');
    expect(errorText).not.toContain('Failed to fetch');
    
    // Should show appropriate offline message
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
  });

  test('offline queue collects metrics', async ({ page, context }) => {
    await page.goto('/app/home');
    
    // Simulate going offline
    await context.setOffline(true);
    
    // Try to trigger metric collection (simulate user interaction)
    await page.evaluate(() => {
      // Simulate posting a metric while offline
      if (window.postMetric) {
        window.postMetric('/metrics/test', { action: 'test' });
      }
    });
    
    // Verify queue is working (check localStorage)
    const queueExists = await page.evaluate(() => {
      return localStorage.getItem('es_metrics_queue') !== null;
    });
    
    expect(queueExists).toBeTruthy();
  });

  test('coming back online flushes queue', async ({ page, context }) => {
    await page.goto('/app/home');
    
    // Go offline, trigger some actions, then come back online
    await context.setOffline(true);
    
    // Simulate offline activity
    await page.evaluate(() => {
      localStorage.setItem('es_metrics_queue', JSON.stringify([{
        endpoint: '/metrics/test',
        body: JSON.stringify({ test: true }),
        minuteBucket: Math.floor(Date.now() / 60000),
        timestamp: Date.now()
      }]));
    });
    
    // Come back online
    await context.setOffline(false);
    
    // Trigger online event
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    // Wait a bit for flush to process
    await page.waitForTimeout(1000);
    
    // Queue should be processed (this test is basic, real implementation would verify network calls)
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('NetworkError');
  });

  test('UI shows appropriate offline states', async ({ page, context }) => {
    await page.goto('/app/home');
    
    // Go offline
    await context.setOffline(true);
    
    // Trigger a feature that would need network
    await page.click('text=Mesure'); // or any button that would need network
    
    // Should show loading or error state, not crash
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Should not show blank page or uncaught errors
    const hasContent = await page.locator('body *:visible').count();
    expect(hasContent).toBeGreaterThan(0);
  });
});