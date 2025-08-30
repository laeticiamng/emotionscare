import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage passes accessibility checks', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // No critical violations allowed
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical'
    );
    
    expect(criticalViolations).toHaveLength(0);
    
    if (criticalViolations.length > 0) {
      console.error('Critical accessibility violations:', criticalViolations);
    }
  });

  test('login page passes accessibility checks', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation => violation.impact === 'critical'
    );
    
    expect(criticalViolations).toHaveLength(0);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Test skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[href="#main-content"]');
    if (await skipLink.isVisible()) {
      expect(await skipLink.isFocused()).toBeTruthy();
    }
    
    // Test basic tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    expect(await focusedElement.isVisible()).toBeTruthy();
  });

  test('focus visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Check buttons have focus styles
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await firstButton.focus();
      
      // Check focus is visible (this may need to be adapted based on your styles)
      const focusStyles = await firstButton.evaluate(el => {
        const styles = window.getComputedStyle(el, ':focus');
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow
        };
      });
      
      // Should have some focus indication
      expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBeTruthy();
    }
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const ariaLabelledby = await img.getAttribute('aria-labelledby');
      
      // Should have alt text or aria labeling
      expect(alt !== null || ariaLabel !== null || ariaLabelledby !== null).toBeTruthy();
    }
  });
});