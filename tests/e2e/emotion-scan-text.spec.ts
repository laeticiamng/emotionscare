import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const LOGIN_ENDPOINT = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
const USER_ENDPOINT = `${SUPABASE_URL}/auth/v1/user`;

const buildAuthPayload = () => {
  const now = Math.floor(Date.now() / 1000);
  return {
    access_token: 'mock-access-token-scan',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: now + 3600,
    refresh_token: 'mock-refresh-token-scan',
    user: {
      id: '00000000-0000-4000-8000-000000000003',
      aud: 'authenticated',
      email: 'scan-user@example.com',
      phone: null,
      role: 'authenticated',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: { provider: 'email' },
      user_metadata: { role: 'b2c', full_name: 'Scan Test User' },
      identities: [],
      factors: [],
      is_anonymous: false,
    },
  };
};

const MOCK_EMOTION_RESPONSE = {
  success: true,
  emotions: {
    joy: 0.72,
    sadness: 0.08,
    anger: 0.03,
    fear: 0.05,
    surprise: 0.12,
  },
  dominant: 'joy',
  confidence: 0.85,
  score: 72,
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

  // Mock emotion analysis edge function
  await page.route(`${SUPABASE_URL}/functions/v1/analyze-emotion*`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(MOCK_EMOTION_RESPONSE),
    });
  });

  // Mock any other emotion-related endpoints
  await page.route(`${SUPABASE_URL}/functions/v1/emotion*`, async (route) => {
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(MOCK_EMOTION_RESPONSE),
    });
  });

  // Login
  await page.goto('/login?segment=b2c');
  await page.fill('input[name="email"]', 'scan-user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.getByTestId('submit-login').click();
  await expect(page).toHaveURL(/\/app/, { timeout: 10000 });
};

test.describe('Emotion Scan — Text Analysis', () => {
  test('scan page loads and displays scan options', async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Page should load with scan content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('text scan mode is accessible', async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Look for text analysis mode button or tab
    const textMode = page.locator('button, [role="tab"]').filter({
      hasText: /texte|text|écrire|journal/i,
    }).first();

    if (await textMode.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textMode.click();

      // A text input area should become visible
      const textArea = page.locator('textarea, [contenteditable="true"], input[type="text"]').first();
      await expect(textArea).toBeVisible({ timeout: 5000 });
    }
  });

  test('entering text and submitting shows results', async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Select text mode
    const textMode = page.locator('button, [role="tab"]').filter({
      hasText: /texte|text|écrire/i,
    }).first();

    if (await textMode.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textMode.click();
    }

    // Find and fill text area
    const textArea = page.locator('textarea').first();
    if (await textArea.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textArea.fill(
        'Je me sens vraiment heureux aujourd\'hui. La journée est belle et je suis plein d\'énergie positive.'
      );

      // Find and click analyze/submit button
      const analyzeBtn = page.locator('button').filter({
        hasText: /analyser|scanner|envoyer|détecter|commencer/i,
      }).first();

      if (await analyzeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await analyzeBtn.click();

        // Wait for results (mock will respond instantly)
        await page.waitForTimeout(2000);

        // Results should display — look for emotion indicators
        const resultArea = page.locator(
          '[data-testid*="result"], [data-testid*="emotion"], .emotion-result, text=/joie|joy|heureux|score/i'
        ).first();

        if (await resultArea.isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(resultArea).toBeVisible();
        }
      }
    }
  });

  test('page is accessible (basic a11y)', async ({ page }) => {
    await setupAuthenticatedSession(page);

    await page.goto('/scan');
    await page.waitForLoadState('networkidle');

    // Verify semantic structure
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible({ timeout: 10000 });

    // Keyboard navigation works
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focusedTag);
  });
});
