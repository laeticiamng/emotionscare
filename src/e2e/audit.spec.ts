// @ts-nocheck

import { test, expect } from '@playwright/test';

test.describe('Front-end Audit - Core Routes', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EmotionsCare/);
    
    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Take screenshot for visual regression
    await page.screenshot({ path: 'reports/audit/homepage.png' });
  });

  test('choose mode page accessible', async ({ page }) => {
    await page.goto('/choose-mode');
    
    // Should show mode selection options
    await expect(page.locator('text=B2C')).toBeVisible();
    await expect(page.locator('text=B2B')).toBeVisible();
    
    await page.screenshot({ path: 'reports/audit/choose-mode.png' });
  });

  test('B2C login page loads', async ({ page }) => {
    await page.goto('/b2c/login');
    
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    await page.screenshot({ path: 'reports/audit/b2c-login.png' });
  });

  test('B2B selection page loads', async ({ page }) => {
    await page.goto('/b2b/selection');
    
    // Should show user and admin options
    await expect(page.locator('text=Utilisateur')).toBeVisible();
    await expect(page.locator('text=Administrateur')).toBeVisible();
    
    await page.screenshot({ path: 'reports/audit/b2b-selection.png' });
  });

  test('404 handling works', async ({ page }) => {
    const response = await page.goto('/non-existent-route');
    expect(response?.status()).toBe(404);
    
    await page.screenshot({ path: 'reports/audit/404-page.png' });
  });
});

test.describe('Authentication Flow', () => {
  test('password validation (minimum 3 characters)', async ({ page }) => {
    await page.goto('/b2c/login');
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'ab'); // Less than 3 chars
    
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=au moins 3 caractères')).toBeVisible();
  });

  test('demo login flows work', async ({ page }) => {
    // Test B2C demo access
    await page.goto('/b2c/login');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/b2c\/dashboard/);
    
    await page.screenshot({ path: 'reports/audit/b2c-dashboard.png' });
  });
});

test.describe('Responsive Design', () => {
  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu
    const menuButton = page.locator('button[aria-label*="menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    
    await page.screenshot({ path: 'reports/audit/mobile-homepage.png' });
  });

  test('desktop layout is proper', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    await page.screenshot({ path: 'reports/audit/desktop-homepage.png' });
  });
});
