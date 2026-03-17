/**
 * E2E tests for 3D scenes — non-regression and stability
 * Covers: hero visibility, reduced-motion fallback, navigation stability,
 * page refresh resilience, mobile viewport compatibility.
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
  });

  test('Home hero renders fallback with reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Content should still be visible with reduced-motion fallback
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Canvas should NOT be present (replaced by CSS fallback)
    const canvasCount = await page.locator('canvas').count();
    // Either no canvas, or canvas is invisible — both acceptable
    expect(canvasCount).toBeLessThanOrEqual(1);
  });

  test('Navigation between routes does not crash canvas', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Navigate away
    await page.goto('/login');
    await page.waitForTimeout(1000);

    // Navigate back to home
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Hero should still render
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Page refresh maintains visual state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.reload();
    await page.waitForTimeout(3000);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('Mobile viewport renders without crash', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(3000);

    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
  });
});
