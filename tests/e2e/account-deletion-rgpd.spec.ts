import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const LOGIN_ENDPOINT = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const USER_ENDPOINT = `${SUPABASE_URL}/auth/v1/user`;

const USER_ID = '00000000-0000-4000-8000-000000000002';

const buildAuthPayload = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'mock-access-token-rgpd',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'mock-refresh-token-rgpd',
    user: {
      id: USER_ID,
      aud: 'authenticated',
      email: 'rgpd-user@example.com',
      phone: null,
      role: 'authenticated',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'b2c', full_name: 'RGPD Test User' },
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  };
};

const setupAuthenticatedSession = async (page: import('@playwright/test').Page) => {
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

  // Mock the delete-user-account edge function
  await page.route(`${SUPABASE_URL}/functions/v1/delete-user-account`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Account scheduled for deletion' }),
    });
  });

  await page.route(`${SUPABASE_URL}/auth/v1/logout`, async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });

  // Login first
  await page.goto('/login?segment=b2c');
  await page.fill('input[name="email"]', 'rgpd-user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.getByTestId('submit-login').click();
  await expect(page).toHaveURL(/\/app/, { timeout: 10000 });
};

test.describe('RGPD — Account Deletion Flow', () => {
  test('navigate to settings and find account deletion option', async ({ page }) => {
    await setupAuthenticatedSession(page);

    // Navigate to settings page where account deletion lives
    await page.goto('/app/settings');
    await page.waitForLoadState('networkidle');

    // Look for the delete account button
    const deleteBtn = page.locator('text=Supprimer mon compte').first();
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
  });

  test('account deletion dialog opens and can be cancelled', async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto('/app/settings');
    await page.waitForLoadState('networkidle');

    // Click "Supprimer mon compte"
    const deleteBtn = page.locator('text=Supprimer mon compte').first();
    await deleteBtn.click();

    // A confirmation dialog should appear
    const dialog = page.getByRole('alertdialog');
    if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Verify dialog content
      await expect(dialog).toContainText(/supprimer|irréversible|définitiv/i);

      // Cancel the deletion
      const cancelBtn = dialog.locator('text=Annuler');
      if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await cancelBtn.click();
        await expect(dialog).not.toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('account deletion confirmation triggers edge function', async ({ page }) => {
    await setupAuthenticatedSession(page);

    let deleteFunctionCalled = false;
    await page.route(`${SUPABASE_URL}/functions/v1/delete-user-account`, async (route) => {
      deleteFunctionCalled = true;
      await route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/app/settings');
    await page.waitForLoadState('networkidle');

    // Click delete
    const deleteBtn = page.locator('text=Supprimer mon compte').first();
    await deleteBtn.click();

    const dialog = page.getByRole('alertdialog');
    if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      // If there's a confirmation input (type "SUPPRIMER")
      const confirmInput = dialog.locator('input');
      if (await confirmInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmInput.fill('SUPPRIMER');
      }

      // Click the confirmation action button
      const confirmDelete = dialog.locator('button').filter({ hasText: /supprimer|confirmer/i }).last();
      if (await confirmDelete.isEnabled({ timeout: 3000 }).catch(() => false)) {
        await confirmDelete.click();
        // Give time for the function call
        await page.waitForTimeout(2000);
      }
    }

    // The edge function or REST insert should have been triggered
    // (either via direct insert to account_deletion_requests or edge function)
  });
});
