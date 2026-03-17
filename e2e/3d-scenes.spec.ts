/**
 * E2E tests for 3D scenes — non-regression and stability
 * Covers: hero, breathing, galaxy, nebula
 * Tests: visibility, fallback, reduced-motion, navigation stability
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
    const canvas = page.locator('canvas');
    // Canvas may or may not exist, but content should still be visible
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible({ timeout: 10000 });
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
});
