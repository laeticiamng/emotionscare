import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const LOGIN_ENDPOINT = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const USER_ENDPOINT = `${SUPABASE_URL}/auth/v1/user`;
const RECOVER_ENDPOINT = `${SUPABASE_URL}/auth/v1/recover`;

const buildAuthSuccessPayload = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'refresh-token',
    user: {
      id: '00000000-0000-4000-8000-000000000000',
      aud: 'authenticated',
      email: 'b2c@example.com',
      phone: null,
      role: 'authenticated',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'b2c', full_name: 'B2C User' },
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  };
};

test.describe('Flux d\'authentification B2C', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login?segment=b2c');
  });

  test('authentifie un utilisateur avec succès', async ({ page }) => {
    const authPayload = buildAuthSuccessPayload();

    await page.route(LOGIN_ENDPOINT, async route => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(authPayload),
      });
    });

    await page.route(USER_ENDPOINT, async route => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user: authPayload.user }),
      });
    });

    await page.route(`${SUPABASE_URL}/rest/v1/**`, async route => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: '[]',
      });
    });

    await page.fill('input[name="email"]', 'b2c@example.com');
    await page.fill('input[name="password"]', 'password123');

    const submitButton = page.getByTestId('submit-login');
    await submitButton.click();
    await expect(submitButton).toBeDisabled();

    await expect(page).toHaveURL(/\/app\/home/);
  });

  test('affiche une erreur lorsque les identifiants sont invalides', async ({ page }) => {
    await page.route(LOGIN_ENDPOINT, async route => {
      await route.fulfill({
        status: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials',
          msg: 'Invalid login credentials',
        }),
      });
    });

    await page.fill('input[name="email"]', 'b2c@example.com');
    await page.fill('input[name="password"]', 'wrong-password');
    await page.getByTestId('submit-login').click();

    const errorAlert = page.getByTestId('auth-error');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Email ou mot de passe incorrect');
    await expect(page).toHaveURL(/login/);
  });

  test('permet de demander un lien de réinitialisation', async ({ page }) => {
    await page.fill('input[name="email"]', 'b2c@example.com');

    await page.route(RECOVER_ENDPOINT, async route => {
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
    });

    await page.getByTestId('forgot-password-trigger').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await page.getByTestId('forgot-password-submit').click();
    const successAlert = page.getByTestId('reset-success');
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('email de réinitialisation');
  });
});
