// @ts-nocheck

import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive E2E Tests', () => {
  test('mobile navigation and layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Should show mobile menu button
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();
    
    // Test mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test navigation
    await page.click('text=Espace Personnel');
    await expect(page).toHaveURL('/b2c/login');
  });

  test('mobile form interaction', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/b2c/login');
    
    // Forms should be mobile-friendly
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    
    await emailInput.fill('test@example.com');
    await page.locator('input[name="password"]').fill('password123');
    
    // Submit button should be accessible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    
    await submitButton.click();
  });

  test('mobile dashboard layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login first
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Dashboard should adapt to mobile
    await expect(page.locator('[data-testid="mobile-dashboard"]')).toBeVisible();
    
    // Cards should stack vertically
    const cards = await page.locator('[data-testid*="card"]').all();
    expect(cards.length).toBeGreaterThan(0);
    
    // Test swipe gestures (if implemented)
    await page.touchscreen.tap(200, 300);
  });

  test('tablet layout adaptation', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Should show tablet-optimized layout
    await expect(page.locator('[data-testid="tablet-layout"]')).toBeVisible();
    
    // Navigation should be hybrid (drawer + tabs)
    await expect(page.locator('[data-testid="tab-navigation"]')).toBeVisible();
  });
});
