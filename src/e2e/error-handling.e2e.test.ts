// @ts-nocheck

// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Error Handling E2E Tests', () => {
  test('network error resilience', async ({ page }) => {
    await page.goto('/b2c/login');
    
    // Simulate network failure
    await page.route('**/api/**', route => route.abort());
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('réseau');
    
    // Restore network and retry
    await page.unroute('**/api/**');
    await page.click('[data-testid="retry-button"]');
    
    // Should succeed
    await expect(page).toHaveURL('/b2c/dashboard');
  });

  test('invalid form data handling', async ({ page }) => {
    await page.goto('/b2c/register');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    
    // Test invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.blur('input[name="email"]');
    
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valide');
    
    // Test weak password
    await page.fill('input[name="password"]', '123');
    await page.blur('input[name="password"]');
    
    await expect(page.locator('[data-testid="password-error"]')).toContainText('caractères');
  });

  test('404 page handling', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.locator('[data-testid="404-page"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('404');
    
    // Should have navigation back
    await page.click('[data-testid="home-link"]');
    await expect(page).toHaveURL('/');
  });

  test('session timeout handling', async ({ page }) => {
    // Login first
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Simulate expired session
    await page.evaluate(() => {
      localStorage.removeItem('auth-token');
      sessionStorage.clear();
    });
    
    // Try to access protected route
    await page.goto('/b2c/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/b2c/login');
    await expect(page.locator('[data-testid="session-expired"]')).toBeVisible();
  });
});
