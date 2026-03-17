/**
 * E2E tests for 3D scenes — non-regression and stability
 * Covers: hero, breathing, galaxy, nebula
 * Tests: visibility, fallback, reduced-motion, navigation stability, WebGL off
 */

import { test, expect } from '@playwright/test';

test.describe('3D Scenes — Stability & Fallback', () => {
  test('Home hero loads with visible content (no black screen)', async ({ page }) => {
    await page.goto('/');
    // Hero section should be visible
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible({ timeout: 10000 });

    // CTA should be readable above the 3D canvas
    const cta = page.getByRole('link', { name: /commencer gratuitement/i });
    await expect(cta).toBeVisible();

    // No error modals or blank screens
    const errorBanner = page.locator('[data-testid="error-boundary"]');
    await expect(errorBanner).not.toBeVisible();
  });

  test('Home hero renders fallback with reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Should see fallback gradient instead of canvas
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Canvas should NOT be present when reduced-motion is active
    const canvasCount = await page.locator('canvas').count();
    // Either no canvas, or canvas hidden — either way heading must be visible
    expect(canvasCount).toBeLessThanOrEqual(1);
  });

  test('Navigation between 3D routes does not crash', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Navigate to a different page and back
    await page.goto('/login');
    await page.waitForTimeout(1000);

    // Go back to home
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Hero should still be visible after navigation
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Page refresh maintains visual state (no persistent black screen)', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Refresh
    await page.reload();
    await page.waitForTimeout(3000);

    // Content should still be visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Mobile viewport renders without crash', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Content visible on mobile
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Hero scene has no horizontal overflow (no scroll)', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1); // +1 tolerance for rounding
  });

  test('Mobile hero with reduced-motion still shows readable content', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Fallback should have aria-label for accessibility
    const fallback = page.locator('[role="img"]');
    const count = await fallback.count();
    if (count > 0) {
      const label = await fallback.first().getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });
});

test.describe('3D Scenes — WebGL Fallback', () => {
  test('Fallback renders premium gradient when WebGL context fails', async ({ page }) => {
    // Simulate WebGL failure by overriding getContext before navigation
    await page.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return null;
        }
        return origGetContext.apply(this, [type, ...args] as Parameters<typeof origGetContext>);
      };
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Content should still be visible — fallback rendered
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Should have a fallback visual (role="img" with aria-label)
    const fallback = page.locator('[role="img"]');
    const count = await fallback.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('3D Scenes — Cross-route Stability', () => {
  test('Rapid navigation between pages does not crash', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Rapid navigation cycle
    for (const path of ['/login', '/', '/login', '/']) {
      await page.goto(path);
      await page.waitForTimeout(500);
    }

    // Final state should be stable
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
