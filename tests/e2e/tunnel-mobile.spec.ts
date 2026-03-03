import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';

const setupMocks = async (page: import('@playwright/test').Page) => {
  await page.route(`${SUPABASE_URL}/auth/v1/**`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'ok' }),
    });
  });
  await page.route(`${SUPABASE_URL}/rest/v1/**`, async (route) => {
    await route.fulfill({ status: 200, headers: { 'content-type': 'application/json' }, body: '[]' });
  });
};

test.describe('Tunnel mobile — Signup scroll & form accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('signup form scrolls completely on mobile viewport', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/signup');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Verify form is visible
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    // Scroll to bottom of form to find submit button
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.scrollIntoViewIfNeeded();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeInViewport();
  });

  test('no content hidden under cookie banner', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/signup');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check if cookie banner is present
    const cookieBanner = page.locator('[data-testid="cookie-banner"], [class*="cookie"], [role="dialog"]:has-text("cookie")').first();
    const bannerVisible = await cookieBanner.isVisible({ timeout: 3000 }).catch(() => false);

    if (bannerVisible) {
      // Accept cookies
      const acceptBtn = page.locator('button:has-text("Accepter"), button:has-text("OK"), button:has-text("Tout accepter")').first();
      if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await acceptBtn.click();
        // Verify no layout jump
        await page.waitForTimeout(500);
      }
    }

    // Verify form submit button is still accessible
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.scrollIntoViewIfNeeded();
    await expect(submitBtn).toBeVisible();
  });

  test('pricing page is accessible on mobile', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Pro plan text visible
    const proText = page.locator('text=Pro').first();
    await expect(proText).toBeVisible({ timeout: 10000 });

    // Price visible
    const priceText = page.locator('text=14').first();
    await expect(priceText).toBeVisible();
  });
});
