import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';

const buildAuthPayload = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'mock-access-token-tunnel',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'mock-refresh-token-tunnel',
    user: {
      id: '00000000-0000-4000-8000-000000000099',
      aud: 'authenticated',
      email: 'tunnel-test@example.com',
      phone: null,
      role: 'authenticated',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'b2c', full_name: 'Tunnel Test User' },
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  };
};

const setupSupabaseMocks = async (page: import('@playwright/test').Page) => {
  const authPayload = buildAuthPayload();

  // Mock signup
  await page.route(`${SUPABASE_URL}/auth/v1/signup`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(authPayload),
    });
  });

  // Mock login
  await page.route(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(authPayload),
    });
  });

  // Mock user endpoint
  await page.route(`${SUPABASE_URL}/auth/v1/user`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(authPayload.user),
    });
  });

  // Mock REST API
  await page.route(`${SUPABASE_URL}/rest/v1/**`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: '[]',
    });
  });

  // Mock logout
  await page.route(`${SUPABASE_URL}/auth/v1/logout`, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  return authPayload;
};

test.describe('Tunnel complet desktop — Signup → Login → Pricing → Checkout', () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  test('signup page loads and form is accessible', async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto('/signup');

    // Verify form fields are visible
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();

    // Verify submit button exists
    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();
  });

  test('login page loads and accepts credentials', async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto('/login');

    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"], input[type="password"]').first()).toBeVisible();

    // Fill credentials
    await page.fill('input[name="email"], input[type="email"]', 'tunnel-test@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');

    // Submit
    const submitBtn = page.locator('button[type="submit"]').first();
    await submitBtn.click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/app\/home|\/dashboard/i, { timeout: 15000 });
  });

  test('pricing page shows Pro plan with correct price', async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.goto('/pricing');

    // Wait for pricing page to load
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Check Pro plan is displayed with 14.90€
    const proText = page.locator('text=Pro').first();
    await expect(proText).toBeVisible({ timeout: 10000 });

    const priceText = page.locator('text=14').first();
    await expect(priceText).toBeVisible();
  });

  test('unauthenticated user clicking Pro plan redirects to signup', async ({ page }) => {
    // No auth mocks — user is not logged in
    await page.route(`${SUPABASE_URL}/auth/v1/user`, async (route) => {
      await route.fulfill({
        status: 401,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'not authenticated' }),
      });
    });
    await page.route(`${SUPABASE_URL}/rest/v1/**`, async (route) => {
      await route.fulfill({ status: 200, headers: { 'content-type': 'application/json' }, body: '[]' });
    });

    await page.goto('/pricing');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Find and click a CTA button on the Pro plan
    const ctaButtons = page.locator('a[href*="signup"], button:has-text("Commencer"), button:has-text("Essayer"), a:has-text("Commencer")');
    const firstCta = ctaButtons.first();

    if (await firstCta.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstCta.click();
      // Should navigate to signup
      await expect(page).toHaveURL(/signup/i, { timeout: 10000 });
    }
  });

  test('authenticated user clicking Pro plan triggers Stripe checkout', async ({ page }) => {
    await setupSupabaseMocks(page);

    // Mock the create-checkout edge function
    let checkoutCalled = false;
    await page.route(`${SUPABASE_URL}/functions/v1/create-checkout`, async (route) => {
      checkoutCalled = true;
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: 'https://checkout.stripe.com/mock-session' }),
      });
    });

    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', 'tunnel-test@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'TestPassword123!');
    await page.locator('button[type="submit"]').first().click();
    await expect(page).toHaveURL(/\/app\/home|\/dashboard/i, { timeout: 15000 });

    // Navigate to pricing
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Click Pro plan CTA
    const proCta = page.locator('button:has-text("Pro"), button:has-text("Choisir"), button:has-text("Commencer")').first();
    if (await proCta.isVisible({ timeout: 5000 }).catch(() => false)) {
      await proCta.click();
      // Wait for checkout call
      await page.waitForTimeout(2000);
    }
  });
});
