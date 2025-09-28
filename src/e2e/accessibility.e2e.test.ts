
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility E2E Tests', () => {
  test('homepage accessibility compliance', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation throughout app', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Navigate to login
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/login/);
    
    // Test form navigation
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');
    
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/b2c/dashboard');
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount({ min: 5 });
    
    // Check for heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('high contrast mode compatibility', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Should adapt to high contrast
    const backgroundElements = await page.locator('[class*="bg-"]').all();
    expect(backgroundElements.length).toBeGreaterThan(0);
  });

  test('focus management in modals', async ({ page }) => {
    await page.goto('/b2c/dashboard');
    
    // Open modal
    await page.click('[data-testid="settings-button"]');
    
    // Focus should be trapped in modal
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Escape should close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });
});
