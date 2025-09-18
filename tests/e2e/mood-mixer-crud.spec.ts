import { test, expect } from '@playwright/test';

const SUPABASE_PRESETS_URL = '**/rest/v1/mood_presets*';
const SUPABASE_AUTH_USER_URL = '**/auth/v1/user';

const credentialsAvailable = Boolean(process.env.PW_B2C_EMAIL && process.env.PW_B2C_PASSWORD);

const extractId = (param: string | null) => {
  if (!param) return null;
  const [, value] = param.split('eq.');
  return value ?? null;
};

test.describe('Mood Mixer — gestion des presets', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('permet de créer, modifier et supprimer une ambiance personnalisée', async ({ page }) => {
    test.skip(!credentialsAvailable, 'Identifiants B2C manquants pour valider le CRUD Mood Mixer.');

    const records: any[] = [];

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

    await page.route(SUPABASE_PRESETS_URL, async (route) => {
      const request = route.request();
      const method = request.method();

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(records),
        });
        return;
      }

      if (method === 'POST') {
        const payload = JSON.parse(request.postData() ?? '{}');
        const created = {
          id: `preset-${Date.now()}`,
          user_id: 'stub-user-id',
          slug: payload.slug ?? null,
          name: payload.name,
          description: payload.description ?? null,
          icon: payload.icon ?? null,
          gradient: payload.gradient ?? null,
          tags: payload.tags ?? [],
          softness: payload.softness ?? 50,
          clarity: payload.clarity ?? 50,
          blend: payload.blend ?? {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        records.unshift(created);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(created),
        });
        return;
      }

      if (method === 'PATCH') {
        const url = new URL(request.url());
        const targetId = extractId(url.searchParams.get('id'));
        const payload = JSON.parse(request.postData() ?? '{}');
        const index = targetId ? records.findIndex((record) => record.id === targetId) : -1;
        if (index >= 0) {
          records[index] = {
            ...records[index],
            ...payload,
            updated_at: new Date().toISOString(),
          };
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(records[index]),
          });
          return;
        }
        await route.fulfill({ status: 404, body: '' });
        return;
      }

      if (method === 'DELETE') {
        const url = new URL(request.url());
        const targetId = extractId(url.searchParams.get('id'));
        if (targetId) {
          const index = records.findIndex((record) => record.id === targetId);
          if (index >= 0) {
            records.splice(index, 1);
          }
        }
        await route.fulfill({ status: 204, body: '' });
        return;
      }

      await route.continue();
    });

    await page.goto('/login?segment=b2c');
    await page.getByLabel(/Adresse email/i).fill(process.env.PW_B2C_EMAIL!);
    await page.getByLabel(/Mot de passe/i).fill(process.env.PW_B2C_PASSWORD!);
    await page.getByRole('button', { name: /Se connecter/i }).click();
    await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

    await page.goto('/app/mood-mixer');
    await expect(page.getByRole('heading', { name: /Mood Mixer/i })).toBeVisible();

    await page.getByRole('button', { name: /Sauvegarder la vibe/i }).click();
    await expect(page.getByText(/Ambiance sauvegardée/i)).toBeVisible();

    const savedCard = page.locator('div', { hasText: 'Mix personnel 50% doux, 50% clair' }).first();
    await expect(savedCard).toBeVisible();

    const sliders = page.getByRole('slider');
    await sliders.first().focus();
    for (let i = 0; i < 8; i += 1) {
      await sliders.first().press('ArrowRight');
    }
    await sliders.nth(1).focus();
    for (let i = 0; i < 5; i += 1) {
      await sliders.nth(1).press('ArrowRight');
    }

    await page.getByRole('button', { name: /Mettre à jour la vibe sélectionnée/i }).click();
    await expect(page.getByText(/Ambiance mise à jour/i)).toBeVisible();
    await expect(page.getByText('Mix personnel 58% doux, 55% clair')).toBeVisible();

    page.once('dialog', (dialog) => dialog.accept());
    await savedCard.locator('button[aria-label^="Supprimer"]').click();
    await expect(page.getByText(/Ambiance supprimée/i)).toBeVisible();
    await expect(page.getByText('Mix personnel 58% doux, 55% clair')).not.toBeVisible();
    await expect.poll(() => records.length).toBe(0);
  });
});
