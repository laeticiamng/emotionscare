import { test, expect } from '@playwright/test';

test.describe('Breath module assessments orchestration', () => {
  test('activating STAI-6 with high answers suggests long exhale cadence', async ({ page }) => {
    test.skip(test.info().project.name !== 'b2c-chromium');
    let staiStartCalls = 0;
    let staiSubmitPayload: Record<string, unknown> | null = null;

    page.on('console', (message) => {
      console.log(`[console:${message.type()}] ${message.text()}`);
    });

    const sessionValue = {
      access_token: 'test-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'test-refresh-token',
      user: {
        id: 'breath-assess-user',
        aud: 'authenticated',
        email: 'breath@spec.dev',
        role: 'authenticated',
        app_metadata: { provider: 'email' },
        user_metadata: {},
      },
    };

    const authStoreState = {
      state: {
        user: sessionValue.user,
        session: sessionValue,
        isAuthenticated: true,
        hasHydrated: true,
        isLoading: false,
        lastSyncAt: Date.now(),
      },
      version: 1,
    };

    await page.addInitScript(([
      supabaseKey,
      supabaseValue,
      storeKey,
      storeValue,
    ]) => {
      window.localStorage.setItem(supabaseKey, supabaseValue);
      window.localStorage.setItem(storeKey, storeValue);
    }, [
      'sb-yaincoxihiqdksxgrsrk-auth-token',
      JSON.stringify(sessionValue),
      'ec-auth-store',
      JSON.stringify(authStoreState),
    ]);

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'breath-assess-user' } }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/me/feature_flags**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          flags: {
            FF_ASSESS_STAI6: true,
            FF_ASSESS_ISI: true,
          },
        }),
      });
    });

    await page.route('**/assess/start', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() ?? '{}');

      if (body.instrument === 'STAI6') {
        staiStartCalls += 1;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: Array.from({ length: 6 }).map((_, index) => ({
              id: `s${index + 1}`,
              text: `Énoncé STAI ${index + 1}`,
            })),
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [] }),
      });
    });

    await page.route('**/assess/submit', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() ?? '{}');
      if (body.instrument === 'STAI6') {
        staiSubmitPayload = body;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/app/breath');

    await expect(page.getByRole('heading', { name: 'Respiration guidée' })).toBeVisible();

    const staiSwitch = page.getByRole('switch', { name: 'Activer STAI-6' });
    await staiSwitch.click();
    await page.getByRole('button', { name: 'Activer STAI-6' }).click();

    await expect(page.getByRole('heading', { name: /Check-in STAI-6 \(avant séance\)/i })).toBeVisible();

    const highOptions = page.getByRole('radio', { name: 'Toujours' });
    const optionCount = await highOptions.count();
    expect(optionCount).toBeGreaterThanOrEqual(6);
    for (let index = 0; index < 6; index += 1) {
      await highOptions.nth(index).click();
    }

    await page.getByRole('button', { name: 'Enregistrer les réponses' }).click();
    await expect(page.getByRole('button', { name: 'Réponses enregistrées' })).toBeVisible();
    await expect(page.getByText('Check-in pré-séance enregistré')).toBeVisible();

    await expect(page.getByText('Cadence recommandée : inspiration 4 s / expiration 6 s', { exact: false })).toBeVisible();
    await expect(page.getByText('Besoin d’apaisement détecté', { exact: false })).toBeVisible();

    expect(staiStartCalls).toBeGreaterThan(0);
    expect(staiSubmitPayload).not.toBeNull();
    expect(staiSubmitPayload?.instrument).toBe('STAI6');
    expect(Object.values(staiSubmitPayload?.answers ?? {})).toContain(4);
  });
});
