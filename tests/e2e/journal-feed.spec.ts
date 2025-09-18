import { test, expect } from '@playwright/test';

const SUPABASE_AUTH_USER_URL = '**/auth/v1/user';
const JOURNAL_FEED_URL = '**/functions/v1/api/v1/me/journal';
const JOURNAL_TEXT_URL = '**/functions/v1/api/v1/journal/text';

const credentialsAvailable = Boolean(process.env.PW_B2C_EMAIL && process.env.PW_B2C_PASSWORD);

const buildAuthUserPayload = () => ({
  id: 'stub-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: process.env.PW_B2C_EMAIL,
  app_metadata: { provider: 'email' },
  user_metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const buildJournalResponse = (entries: any[]) => ({
  ok: true,
  data: { entries },
});

const extractTags = (payload: Record<string, any>) => {
  const raw = String(payload.text_raw ?? '');
  return Array.from(raw.match(/#([\p{L}\p{N}_-]{2,24})/gu) ?? []).map((tag) => tag.slice(1).toLowerCase());
};

test.describe('Journal — parcours complet', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('permet de créer une entrée et de filtrer le feed', async ({ page }) => {
    test.skip(!credentialsAvailable, 'Identifiants B2C manquants pour valider le parcours Journal.');

    const feedEntries: any[] = [
      {
        id: 'entry-1',
        ts: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'text',
        text_raw: 'Ancienne note #bilan',
        preview: 'Ancienne note #bilan',
        summary: null,
        tags: ['bilan'],
        valence: 0,
        meta: { tags: ['bilan'] },
      },
    ];

    await page.route(SUPABASE_AUTH_USER_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(buildAuthUserPayload()),
      });
    });

    await page.route(JOURNAL_FEED_URL, async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(buildJournalResponse(feedEntries)),
        });
        return;
      }
      await route.continue();
    });

    await page.route(JOURNAL_TEXT_URL, async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') {
        await route.continue();
        return;
      }

      const payload = JSON.parse(request.postData() ?? '{}');
      const id = `entry-${feedEntries.length + 1}`;
      const ts = new Date().toISOString();
      const tags = extractTags(payload);

      feedEntries.unshift({
        id,
        ts,
        type: 'text',
        text_raw: payload.text_raw,
        preview: payload.preview,
        summary: payload.preview,
        tags,
        tag_set: tags,
        meta: { tags },
        valence: payload.valence ?? 0,
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { id, ts } }),
      });
    });

    await page.goto('/login?segment=b2c');
    await page.getByLabel(/Adresse email/i).fill(process.env.PW_B2C_EMAIL!);
    await page.getByLabel(/Mot de passe/i).fill(process.env.PW_B2C_PASSWORD!);
    await page.getByRole('button', { name: /Se connecter/i }).click();
    await expect(page.getByText(/Connexion réussie/i)).toBeVisible({ timeout: 20000 });

    await page.goto('/app/journal');
    await expect(page.getByRole('heading', { name: /Journal/i })).toBeVisible();
    await expect(page.getByText('Ancienne note')).toBeVisible();

    await page.getByTestId('journal-input').fill('Nouvelle entrée <img src="x" onerror="alert(1)"> #Gratitude');
    await page.getByLabel(/Tags/i).fill('Gratitude énergie');
    await page.getByRole('button', { name: /Enregistrer/i }).click();

    await expect.poll(() => feedEntries.length).toBeGreaterThan(1);
    await expect(page.locator('img[src="x"]')).toHaveCount(0);
    await expect(page.getByText(/Nouvelle entrée/)).toBeVisible();

    const search = page.getByLabel(/Recherche/i);
    await search.fill('gratitude');
    await expect(page.getByText(/Nouvelle entrée/)).toBeVisible();
    await search.fill('');

    await page.getByRole('button', { name: '#gratitude' }).click();
    await expect(page.getByText(/Nouvelle entrée/)).toBeVisible();
    await page.getByRole('button', { name: 'Tous' }).click();

    await page.goto('/app/dashboard');
    const summaryCard = page.getByRole('heading', { name: 'Journal récent' }).locator('..').locator('..');
    await expect(summaryCard).toBeVisible();
    await expect(summaryCard).toContainText('Nouvelle entrée');
    await expect(summaryCard).toContainText('#gratitude', { timeout: 5000 });
  });
});
