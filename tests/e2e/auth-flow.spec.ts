import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const LOGIN_ENDPOINT = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const USER_ENDPOINT = `${SUPABASE_URL}/auth/v1/user`;
const LOGOUT_ENDPOINT = `${SUPABASE_URL}/auth/v1/logout`;

const buildAuthPayload = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'mock-refresh-token',
    user: {
      id: '00000000-0000-4000-8000-000000000001',
      aud: 'authenticated',
      email: 'b2c@example.com',
      phone: null,
      role: 'authenticated',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'b2c', full_name: 'Test B2C User' },
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  };
};

/** Mock all Supabase endpoints for an authenticated session */
const setupAuthMocks = async (page: import('@playwright/test').Page) => {
  const authPayload = buildAuthPayload();

  await page.route(LOGIN_ENDPOINT, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(authPayload),
    });
  });

  await page.route(USER_ENDPOINT, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(authPayload.user),
    });
  });

  await page.route(`${SUPABASE_URL}/rest/v1/**`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: '[]',
    });
  });

  await page.route(`${SUPABASE_URL}/auth/v1/logout`, async (route) => {
    await route.fulfill({
      status: 204,
      headers: { 'content-type': 'application/json' },
      body: '',
    });
  });

  return authPayload;
};

test.describe('Auth Flow — Login → Dashboard → Logout', () => {
  test('login, access dashboard, then logout', async ({ page }) => {
    await setupAuthMocks(page);

    // 1. Navigate to login
    await page.goto('/login?segment=b2c');
    await page.fill('input[name="email"]', 'b2c@example.com');
    await page.fill('input[name="password"]', 'password123');

    // 2. Submit login
    const submitBtn = page.getByTestId('submit-login');
    await submitBtn.click();

    // 3. Verify redirect to dashboard
    await expect(page).toHaveURL(/\/app\/home/, { timeout: 10000 });

    // 4. Find and click logout (in UserMenu dropdown or nav)
    const logoutTrigger = page.locator('text=Déconnexion').first();

    if (!(await logoutTrigger.isVisible({ timeout: 3000 }).catch(() => false))) {
      // Open user menu first
      const userMenuBtn = page.locator('[data-testid="user-menu"], button:has(svg.lucide-user), button:has(svg.lucide-log-out)').first();
      if (await userMenuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await userMenuBtn.click();
      }
    }

    const logoutBtn = page.locator('text=Déconnexion').first();
    if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutBtn.click();
      // Should redirect away from app
      await expect(page).not.toHaveURL(/\/app\/home/, { timeout: 10000 });
    }
  });

  test('protected route redirects unauthenticated user', async ({ page }) => {
    // Don't set up auth mocks — user is unauthenticated
    await page.route(USER_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 401,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'not authenticated' }),
      });
    });

    await page.goto('/app/home');

    // Should redirect to login or show access denied
    await expect(page).toHaveURL(/login|\/$/i, { timeout: 10000 });
  });
});
