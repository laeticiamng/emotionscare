import { test, expect } from '@playwright/test';

const SUPABASE_AUTH_USER_URL = '**/auth/v1/user';
const SUPABASE_BREATH_SESSIONS_URL = '**/rest/v1/breathwork_sessions*';
const SUPABASE_SESSIONS_URL = '**/rest/v1/sessions*';

const credentialsAvailable = Boolean(process.env.PW_B2C_EMAIL && process.env.PW_B2C_PASSWORD);

test.describe('Breath Constellation — session guidée', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('propose un protocole respiratoire et journalise la session', async ({ page }) => {
    test.skip(
      !credentialsAvailable,
      'Identifiants B2C manquants pour valider le parcours Breath Constellation.',
    );

    const breathPayloads: any[] = [];
    const sessionPayloads: any[] = [];

    await page.route(SUPABASE_AUTH_USER_URL, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'stub-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: process.env.PW_B2C_EMAIL,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    });

    await page.route(SUPABASE_BREATH_SESSIONS_URL, async route => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      const payload = JSON.parse(route.request().postData() ?? '{}');
      breathPayloads.push(payload);

      const record = {
        id: `breath-${breathPayloads.length}`,
        user_id: 'stub-user-id',
        technique_type: payload.technique_type,
        duration: payload.duration,
        session_data: payload.session_data,
        created_at: new Date().toISOString(),
      };

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(record),
      });
    });

    await page.route(SUPABASE_SESSIONS_URL, async route => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      const payload = JSON.parse(route.request().postData() ?? '{}');
      sessionPayloads.push(payload);

      const record = {
        id: `session-${sessionPayloads.length}`,
        created_at: new Date().toISOString(),
        type: payload.type,
        duration_sec: payload.duration_sec,
        mood_delta: payload.mood_delta ?? null,
        meta: payload.meta ?? null,
      };

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(record),
      });
    });

    await page.goto('/login?segment=b2c');
    await page.getByLabel(/Adresse email/i).fill(process.env.PW_B2C_EMAIL!);
    await page.getByLabel(/Mot de passe/i).fill(process.env.PW_B2C_PASSWORD!);
    await page.getByRole('button', { name: /Se connecter/i }).click();
    await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

    await page.goto('/app/breath');
    await expect(page.getByRole('heading', { name: /Breath Constellation/i })).toBeVisible({ timeout: 20000 });

    await page.getByLabel(/Protocole respiratoire/i).selectOption('4-7-8');
    await page.getByLabel(/Nombre de cycles planifiés/i).fill('1');

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(2200);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await expect.poll(() => breathPayloads.length).toBe(1);
    await expect.poll(() => sessionPayloads.length).toBe(1);

    const supabaseInsert = breathPayloads[0];
    expect(supabaseInsert.technique_type).toBe('4-7-8');
    expect(supabaseInsert.duration).toBeGreaterThan(0);
    expect(supabaseInsert.session_data.cycles_planned).toBe(1);

    const sessionInsert = sessionPayloads[0];
    expect(sessionInsert.type).toBe('breath');
    expect(sessionInsert.meta.technique).toBe('4-7-8');
    expect(sessionInsert.meta.completed).toBe(false);
    expect(sessionInsert.meta.cues.sound).toBe(false);

    await expect(
      page.getByText(/Session enregistrée dans votre historique Supabase/i),
    ).toBeVisible();
  });
});

