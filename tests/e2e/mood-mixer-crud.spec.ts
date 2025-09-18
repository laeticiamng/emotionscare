import { test, expect } from '@playwright/test';

test.describe('Mood Mixer presets CRUD', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('allows creating, updating and deleting personal mood presets', async ({ page }) => {
    await page.addInitScript(() => {
      const OriginalPlay = window.HTMLMediaElement.prototype.play;
      const OriginalPause = window.HTMLMediaElement.prototype.pause;

      window.HTMLMediaElement.prototype.play = function play() {
        return Promise.resolve();
      };
      window.HTMLMediaElement.prototype.pause = function pause() {
        return OriginalPause.call(this);
      };
      Object.defineProperty(window.HTMLMediaElement.prototype, 'muted', {
        configurable: true,
        get() {
          return true;
        },
        set() {
          // noop to silence autoplay protections during tests
        },
      });

      return () => {
        window.HTMLMediaElement.prototype.play = OriginalPlay;
        window.HTMLMediaElement.prototype.pause = OriginalPause;
      };
    });

    const baseTimestamp = '2025-07-01T12:00:00.000Z';
    let moodPresets = [
      {
        id: 'preset-existing',
        user_id: 'user-b2c',
        name: 'Brise Lagon',
        description: 'Mix personnel 40% doux, 70% clair',
        softness: 40,
        clarity: 70,
        blend: { joy: 0.4, calm: 0.6, energy: 0.7, focus: 0.3 },
        slug: null,
        icon: null,
        gradient: null,
        tags: [],
        created_at: baseTimestamp,
        updated_at: baseTimestamp,
      },
    ];

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-b2c' } }),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/mood_presets**', async (route) => {
      const request = route.request();
      const method = request.method();
      const url = new URL(request.url());

      if (method === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(moodPresets),
        });
        return;
      }

      if (method === 'POST') {
        const payloadText = request.postData() ?? '{}';
        const parsed = JSON.parse(payloadText);
        const entries = Array.isArray(parsed) ? parsed : [parsed];
        const createdAt = new Date().toISOString();

        const created = entries.map((entry, index) => {
          const record = {
            id: entry.id ?? (index === 0 ? 'preset-created' : `preset-created-${index}`),
            user_id: entry.user_id ?? entry.userId ?? 'user-b2c',
            name: entry.name ?? 'Nouvelle ambiance',
            description: entry.description ?? null,
            softness: entry.softness ?? 50,
            clarity: entry.clarity ?? 50,
            blend: entry.blend ?? { joy: 0.5, calm: 0.5, energy: 0.5, focus: 0.5 },
            slug: entry.slug ?? null,
            icon: entry.icon ?? null,
            gradient: entry.gradient ?? null,
            tags: entry.tags ?? [],
            created_at: createdAt,
            updated_at: createdAt,
          };
          return record;
        });

        moodPresets = [...created, ...moodPresets];

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(created),
        });
        return;
      }

      if (method === 'PATCH') {
        const idParam = url.searchParams.get('id');
        const targetId = idParam ? idParam.replace('eq.', '') : null;
        const payloadText = request.postData() ?? '{}';
        const parsed = JSON.parse(payloadText);
        const patch = Array.isArray(parsed) ? parsed[0] ?? {} : parsed;
        const existing = moodPresets.find((preset) => preset.id === targetId);

        if (!existing) {
          await route.fulfill({ status: 404, body: '' });
          return;
        }

        const updated = {
          ...existing,
          ...patch,
          updated_at: new Date().toISOString(),
        };

        moodPresets = moodPresets.map((preset) => (preset.id === targetId ? updated : preset));

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([updated]),
        });
        return;
      }

      if (method === 'DELETE') {
        const idParam = url.searchParams.get('id');
        const targetId = idParam ? idParam.replace('eq.', '') : null;
        if (targetId) {
          moodPresets = moodPresets.filter((preset) => preset.id !== targetId);
        }

        await route.fulfill({ status: 204, body: '' });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/modules/adaptive-music/preview', async (route) => {
      await route.fulfill({ status: 503, body: '' });
    });

    await page.goto('/app/mood-mixer');
    await expect(page.getByRole('heading', { name: /Mood Mixer/i })).toBeVisible({ timeout: 20000 });

    const existingCard = page.getByTestId('mood-vibe-preset-existing');
    await expect(existingCard).toBeVisible();

    const sliders = page.locator('div[role="slider"]');
    await sliders.first().click();
    for (let i = 0; i < 22; i += 1) {
      await sliders.first().press('ArrowRight');
    }

    await sliders.nth(1).click();
    for (let i = 0; i < 9; i += 1) {
      await sliders.nth(1).press('ArrowLeft');
    }

    await expect(page.locator('span', { hasText: '72%' }).first()).toBeVisible();
    await expect(page.locator('span', { hasText: '41%' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Sauvegarder la vibe' }).click();
    await expect(page.getByText('Ambiance sauvegardée')).toBeVisible();

    const createdCard = page.getByTestId('mood-vibe-preset-created');
    await expect(createdCard).toBeVisible({ timeout: 10000 });
    await expect(createdCard).toContainText('Mix personnel 72% doux, 41% clair');

    await sliders.first().click();
    for (let i = 0; i < 52; i += 1) {
      await sliders.first().press('ArrowLeft');
    }

    await sliders.nth(1).click();
    for (let i = 0; i < 44; i += 1) {
      await sliders.nth(1).press('ArrowRight');
    }

    await expect(page.locator('span', { hasText: '20%' }).first()).toBeVisible();
    await expect(page.locator('span', { hasText: '85%' }).first()).toBeVisible();

    await page.getByRole('button', { name: 'Mettre à jour la vibe sélectionnée' }).click();
    await expect(page.getByText('Ambiance mise à jour')).toBeVisible();
    await expect(createdCard).toContainText('Mix personnel 20% doux, 85% clair');

    page.once('dialog', (dialog) => dialog.accept());
    await createdCard.locator('button[aria-label^="Supprimer"]').click();
    await expect(page.getByText('Ambiance supprimée')).toBeVisible();
    await expect(createdCard).toBeHidden();
  });
});
