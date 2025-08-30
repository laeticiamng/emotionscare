import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('focus trap and skip link functionality', async ({ page }) => {
    await page.goto('/');
    
    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('text=Skip to content');
    await expect(skipLink).toBeVisible();
    
    // Test focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('app pages have proper ARIA labels', async ({ page }) => {
    await page.goto('/app/home');
    
    // Wait for page to load
    await expect(page.locator('[data-testid="page-root"]')).toBeVisible();
    
    // Check for proper main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for proper heading structure
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('form controls have proper labels', async ({ page }) => {
    await page.goto('/login');
    
    // Check that form inputs have associated labels
    const inputs = page.locator('input[type="email"], input[type="password"]');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      // Input should have either aria-label, aria-labelledby, or associated label
      const hasLabel = ariaLabel || ariaLabelledby || 
        (id && await page.locator(`label[for="${id}"]`).count() > 0);
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    // Filter for color contrast violations specifically
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });
});