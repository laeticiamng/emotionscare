// @ts-nocheck

// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Performance E2E Tests', () => {
  test('page load performance metrics', async ({ page }) => {
    await page.goto('/');
    
    // Measure Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};
          
          entries.forEach((entry) => {
            if (entry.name === 'FCP') {
              vitals.fcp = entry.value;
            }
            if (entry.name === 'LCP') {
              vitals.lcp = entry.value;
            }
            if (entry.name === 'CLS') {
              vitals.cls = entry.value;
            }
          });
          
          resolve(vitals);
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });

    // Assert performance thresholds
    if (metrics.fcp) {
      expect(metrics.fcp).toBeLessThan(1500); // FCP < 1.5s
    }
    if (metrics.lcp) {
      expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    }
    if (metrics.cls) {
      expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
    }
  });

  test('image loading optimization', async ({ page }) => {
    await page.goto('/');
    
    // Check for lazy loading
    const images = await page.locator('img[loading="lazy"]').all();
    expect(images.length).toBeGreaterThan(0);
    
    // Check for modern formats
    const modernImages = await page.locator('img[src*=".webp"], img[src*=".avif"]').all();
    expect(modernImages.length).toBeGreaterThan(0);
  });

  test('bundle size and loading', async ({ page }) => {
    const response = await page.goto('/');
    
    // Check response size (should be optimized)
    const responseSize = parseInt(response.headers()['content-length'] || '0');
    expect(responseSize).toBeLessThan(1024 * 1024); // < 1MB
    
    // Check for compression
    expect(response.headers()['content-encoding']).toBeTruthy();
  });

  test('API response times', async ({ page }) => {
    await page.goto('/b2c/login');
    
    // Login and measure API calls
    const startTime = Date.now();
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    
    const [response] = await Promise.all([
      page.waitForResponse('/api/auth/login'),
      page.click('button[type="submit"]')
    ]);
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(2000); // < 2s
    expect(response.status()).toBe(200);
  });
});
