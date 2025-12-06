
import { test, expect } from '@playwright/test';

test.describe('Data Integrity E2E Tests', () => {
  test('journal entry persistence', async ({ page }) => {
    // Login
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Create journal entry
    await page.click('[data-testid="journal-card"]');
    await page.click('[data-testid="new-entry-button"]');
    
    const entryText = `Test entry ${Date.now()}`;
    await page.fill('[data-testid="journal-editor"]', entryText);
    await page.click('[data-testid="save-entry"]');
    
    // Verify immediate persistence
    await expect(page.locator('[data-testid="journal-entries"]')).toContainText(entryText);
    
    // Refresh page and verify persistence
    await page.reload();
    await expect(page.locator('[data-testid="journal-entries"]')).toContainText(entryText);
    
    // Logout and login again
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');
    
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.click('[data-testid="journal-card"]');
    await expect(page.locator('[data-testid="journal-entries"]')).toContainText(entryText);
  });

  test('emotion scan data persistence', async ({ page }) => {
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Perform emotion scan
    await page.click('[data-testid="scan-card"]');
    await page.click('[data-testid="mock-scan-button"]'); // For testing
    
    // Verify results are saved
    await expect(page.locator('[data-testid="scan-history"]')).toBeVisible();
    
    // Check dashboard shows updated data
    await page.goto('/b2c/dashboard');
    await expect(page.locator('[data-testid="emotion-score"]')).not.toBeEmpty();
  });

  test('user preferences persistence', async ({ page }) => {
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Change preferences
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Préférences');
    
    await page.click('[data-testid="theme-toggle"]');
    await page.selectOption('[data-testid="language-select"]', 'en');
    await page.click('[data-testid="save-preferences"]');
    
    // Verify persistence across sessions
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Logout and login
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');
    
    await page.goto('/b2c/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Preferences should be maintained
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});
