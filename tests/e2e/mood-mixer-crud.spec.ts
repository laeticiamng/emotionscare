import { test, expect } from '@playwright/test';

test.describe('Mood Mixer presets CRUD', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('allows creating, updating, previewing and deleting personal mood presets', async ({ page }) => {
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

    const consoleMessages: string[] = [];
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type())) {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });

    const baseTimestamp = '2025-07-01T12:00:00.000Z';
    let moodPresets = [
      {
        id: 'preset-existing',
        user_id: 'user-b2c',
        name: 'Brise Lagon',
        sliders: { energy: 40, calm: 70, focus: 55, light: 60 },
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
        const entry = Array.isArray(parsed) ? parsed[0] ?? {} : parsed;
        const createdAt = new Date().toISOString();

        const created = {
          id: entry.id ?? 'preset-created',
          user_id: entry.user_id ?? 'user-b2c',
          name: entry.name ?? 'Nouvelle douceur',
          sliders: entry.sliders ?? { energy: 50, calm: 50, focus: 50, light: 50 },
          created_at: createdAt,
          updated_at: createdAt,
        };

        moodPresets = [created, ...moodPresets];

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

    await page.route('**/api/modules/adaptive-music/preview**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ previewUrl: '/samples/preview-30s.mp3' }),
      });
    });

    await page.goto('/app/mood-mixer');
    await expect(page.getByRole('heading', { name: /Mood Mixer/i })).toBeVisible({ timeout: 20000 });

    const energySlider = page.getByRole('slider', { name: 'Énergie' });
    await energySlider.focus();
    for (let i = 0; i < 50; i += 1) {
      await energySlider.press('ArrowRight');
    }

    const calmSlider = page.getByRole('slider', { name: 'Calme' });
    await calmSlider.focus();
    for (let i = 0; i < 30; i += 1) {
      await calmSlider.press('ArrowLeft');
    }

    await expect(page.getByText(/flamme solaire/i)).toBeVisible();
    await expect(page.getByText(/onde légère/i)).toBeVisible();

    await page.getByLabel('Nom de votre douceur').fill('Aurore épicée');
    await page.getByRole('button', { name: 'Sauvegarder' }).click();
    await expect(page.getByText('Douceur enregistrée')).toBeVisible();

    const createdCard = page.getByRole('button', { name: /Aurore épicée/ });
    await expect(createdCard).toBeVisible({ timeout: 10000 });
    await expect(createdCard).toContainText(/Énergie flamme solaire/i);

    await page.getByRole('slider', { name: 'Énergie' }).focus();
    for (let i = 0; i < 80; i += 1) {
      await page.keyboard.press('ArrowLeft');
    }

    await page.getByRole('slider', { name: 'Lumière' }).focus();
    for (let i = 0; i < 45; i += 1) {
      await page.keyboard.press('ArrowRight');
    }

    await page.getByLabel('Nom de votre douceur').fill('Calme incandescent');
    await page.getByRole('button', { name: 'Rafraîchir' }).click();
    await expect(page.getByText('Douceur rafraîchie')).toBeVisible();
    await expect(page.getByRole('button', { name: /Calme incandescent/ })).toBeVisible();
    await expect(page.getByText(/Énergie repos suspendu/i)).toBeVisible();

    await page.getByRole('button', { name: 'Pré-écoute' }).click();
    await expect(page.getByRole('button', { name: 'Lancer la pré-écoute' })).toBeVisible();
    await expect(page.locator('audio')).toHaveAttribute('src', '/samples/preview-30s.mp3');

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Supprimer' }).click();
    await expect(page.getByText('Douceur effacée')).toBeVisible();
    await expect(page.getByRole('button', { name: /Calme incandescent/ })).toHaveCount(0);

    expect(consoleMessages).toEqual([]);
  });
});
