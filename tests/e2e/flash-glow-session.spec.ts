import { test, expect } from '@playwright/test';

const SUPABASE_AUTH_USER_URL = '**/auth/v1/user';
const SUPABASE_SESSIONS_URL = '**/rest/v1/sessions*';
const SUPABASE_FLASH_METRICS_URL = '**/functions/v1/flash-glow-metrics';

const credentialsAvailable = Boolean(process.env.PW_B2C_EMAIL && process.env.PW_B2C_PASSWORD);

test.describe('Flash Glow — parcours complet', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('journalise une session et calcule le delta d’humeur', async ({ page }) => {
    test.skip(!credentialsAvailable, 'Identifiants B2C manquants pour valider le parcours Flash Glow.');

    const sessionCalls: any[] = [];
    const statsRecords: any[] = [];

    await page.route(SUPABASE_AUTH_USER_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'stub-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: process.env.PW_B2C_EMAIL,
          app_metadata: { provider: 'email' },
          user_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    });

    await page.route(SUPABASE_FLASH_METRICS_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Bravo', next_session_in: '4h' }),
      });
    });

    await page.route(SUPABASE_SESSIONS_URL, async (route) => {
      const request = route.request();
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(statsRecords),
        });
        return;
      }

      if (request.method() === 'POST') {
        const payload = JSON.parse(request.postData() ?? '{}');
        sessionCalls.push(payload);

        const record = {
          id: `session-${sessionCalls.length}`,
          created_at: new Date().toISOString(),
          type: payload.type,
          duration_sec: payload.duration_sec,
          mood_delta: payload.mood_delta ?? null,
          meta: payload.meta ?? null,
        };
        statsRecords.unshift(record);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(record),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/login?segment=b2c');
    await page.getByLabel(/Adresse email/i).fill(process.env.PW_B2C_EMAIL!);
    await page.getByLabel(/Mot de passe/i).fill(process.env.PW_B2C_PASSWORD!);
    await page.getByRole('button', { name: /Se connecter/i }).click();
    await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

    await page.goto('/app/flash-glow');
    await expect(page.getByRole('heading', { name: /Flash Glow Ultra/i })).toBeVisible({ timeout: 20000 });

    await page.getByRole('button', { name: /Déclencher le Flash Glow/i }).click();
    const stopButton = page.getByRole('button', { name: /Arrêter/i });
    await expect(stopButton).toBeVisible({ timeout: 10000 });
    await stopButton.click();

    await expect(page.getByText(/Ressenti après séance/i)).toBeVisible();

    const afterSlider = page.getByRole('slider').first();
    await afterSlider.focus();
    for (let i = 0; i < 12; i += 1) {
      await afterSlider.press('ArrowRight');
    }

    await page.getByRole('button', { name: /Gain ressenti/i }).click();

    await expect.poll(() => sessionCalls.length).toBe(1);

    const payload = sessionCalls[0];
    expect(payload.user_id).toBe('stub-user-id');
    expect(payload.type).toBe('flash_glow');
    expect(payload.duration_sec).toBeGreaterThan(0);
    expect(payload.meta?.moodBefore).toBeGreaterThanOrEqual(0);
    expect(payload.meta?.moodAfter).toBeGreaterThan(payload.meta?.moodBefore ?? 0);
    expect(payload.mood_delta).toBeGreaterThan(0);

    await expect(page.getByText(/Votre expérience a été ajoutée automatiquement au journal/i)).toBeVisible();
  });
});
