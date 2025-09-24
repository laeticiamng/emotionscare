import { expect, test } from '@playwright/test';

const playlistResponse = {
  ok: true,
  data: {
    playlist_id: 'relaxed-session',
    mood: 'relaxed',
    requested_mood: 'relaxed',
    title: 'Relaxation guidée',
    description: 'Une sélection pour apaiser et réaligner votre énergie.',
    total_duration: 900,
    unit: 'seconds',
    tracks: [
      {
        id: 'track-relaxed-01',
        title: 'Respiration Alignée',
        artist: 'EmotionsCare Studio',
        url: 'https://example.com/audio/relaxed-01.mp3',
        duration: 240,
        mood: 'relaxed',
        energy: 0.35,
        focus: 'breathing',
        instrumentation: ['piano', 'textures'],
        tags: ['relax', 'focus'],
        description: 'Respiration guidée et textures calmes pour se recentrer.',
      },
      {
        id: 'track-relaxed-02',
        title: 'Horizons Doux',
        artist: 'EmotionsCare Studio',
        url: 'https://example.com/audio/relaxed-02.mp3',
        duration: 300,
        mood: 'relaxed',
        energy: 0.32,
        focus: 'flow',
        instrumentation: ['pads'],
        tags: ['relax', 'ambient'],
        description: "Synthés enveloppants pour prolonger l'accalmie.",
      },
    ],
    energy_profile: {
      baseline: 0.32,
      requested: 0.45,
      recommended: 0.34,
      alignment: 0.92,
      curve: [
        { track_id: 'track-relaxed-01', start: 0, end: 240, energy: 0.35, focus: 'breathing' },
        { track_id: 'track-relaxed-02', start: 240, end: 540, energy: 0.32, focus: 'flow' },
      ],
    },
    recommendations: [
      'Planifiez une respiration 4-6 pendant la première piste.',
      "Prolongez la détente avec une séance journal guidée.",
    ],
    guidance: {
      focus: 'Utilisez la première piste pour ancrer la respiration, puis étirez-vous en douceur.',
      breathwork: 'Respiration 4-6',
      activities: ['Journal', 'Étirements', 'Respiration profonde'],
    },
    metadata: {
      curated_by: 'EmotionsCare',
      tags: ['relax', 'evening'],
      dataset_version: '2024.06-adaptive',
    },
  },
};

const seedAdaptiveStorage = () => {
  try {
    window.localStorage.setItem(
      'adaptive-music:persisted-session',
      JSON.stringify({
        trackId: 'track-relaxed-01',
        position: 86,
        volume: 0.62,
        presetId: 'ambient_soft',
        updatedAt: Date.now() - 120_000,
        title: 'Respiration Alignée',
        url: 'https://example.com/audio/relaxed-01.mp3',
        wasPlaying: false,
      }),
    );
    window.localStorage.setItem('adaptive-music:favorites-sync', JSON.stringify([]));
  } catch (error) {
    console.warn('Unable to seed adaptive music storage', error);
  }

  try {
    delete (window as any).AudioContext;
    delete (window as any).webkitAudioContext;
  } catch (error) {
    console.warn('AudioContext cleanup failed', error);
  }

  const originalPlay = window.HTMLMediaElement.prototype.play;
  const originalPause = window.HTMLMediaElement.prototype.pause;

  window.HTMLMediaElement.prototype.play = function play() {
    return Promise.resolve();
  };
  window.HTMLMediaElement.prototype.pause = function pause() {
    return originalPause.call(this);
  };

  window.addEventListener('beforeunload', () => {
    window.HTMLMediaElement.prototype.play = originalPlay;
    window.HTMLMediaElement.prototype.pause = originalPause;
  });
};

test.describe('Adaptive Music favorites and resume', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test.beforeEach(async ({ page }) => {
    await page.route('**/me/feature_flags', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          flags: { FF_MUSIC: true, FF_ASSESS_POMS: true },
        }),
      });
    });

    await page.route('**/auth/v1/user**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: null }),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/mood_playlist', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(playlistResponse),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/*.mp3', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: '' });
        return;
      }

      await route.continue();
    });

    await page.addInitScript(seedAdaptiveStorage);
  });

  test('allows resuming the last track and saving it to favorites', async ({ page }) => {
    await page.goto('/app/music');

    await expect(page.getByRole('heading', { name: /Adaptive Music/i })).toBeVisible({ timeout: 20_000 });

    await expect(page.getByText('Respiration Alignée').first()).toBeVisible();

    const resumeHint = page.getByText(/Dernière écoute sauvegardée/i);
    await expect(resumeHint).toBeVisible();

    const resumeButton = page.locator('[data-ui="resume-button"]');
    await expect(resumeButton).toHaveText(/Reprendre ton écoute/i);
    await resumeButton.click();

    const primaryToggle = page.locator('[data-ui="primary-toggle"]');
    await expect(primaryToggle).toHaveText(/Pause/i);

    const favoriteToggle = page.locator('[data-ui="favorite-toggle"]');
    await favoriteToggle.click();

    const favoritesListItem = page
      .getByRole('listitem')
      .filter({ hasText: 'Respiration Alignée' })
      .first();
    await expect(favoritesListItem).toBeVisible();

    const storedFavorites = await page.evaluate(() => {
      const raw = window.localStorage.getItem('adaptive-music:favorites-sync');
      return raw ? JSON.parse(raw) : [];
    });

    expect(Array.isArray(storedFavorites)).toBeTruthy();
    expect(storedFavorites.some((entry: any) => entry?.trackId === 'track-relaxed-01')).toBeTruthy();
  });

  test('records pre and post POMS check-ins to adapt the preset', async ({ page }) => {
    await page.route('**/rest/v1/clinical_consents**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      if (method === 'POST' || method === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'consent-poms' }]) });
        return;
      }
      await route.continue();
    });

    await page.route('**/functions/v1/assess-start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'POMS',
          locale: 'fr',
          name: 'POMS-SF',
          version: '1.0',
          expiry_minutes: 10,
          items: [
            { id: '1', prompt: 'Tension', type: 'scale', min: 1, max: 4 },
          ],
        }),
      });
    });

    await page.route('**/functions/v1/assess-submit', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await page.goto('/app/music');

    await expect(page.getByRole('heading', { name: /Adaptive Music/i })).toBeVisible({ timeout: 20_000 });

    await page.getByRole('button', { name: /Oui, allons-y/i }).click();
    await expect(page.getByText(/Ton ressenti de départ est bien pris en compte/i)).not.toBeVisible();

    await page.getByLabel('Encore un peu de tension', { exact: false }).check();
    await page.getByLabel('Présence constante', { exact: false }).check();
    await page.getByRole('button', { name: /Enregistrer ce ressenti/i }).first().click();

    await expect(page.getByText(/Ton ressenti de départ est bien pris en compte/i)).toBeVisible();

    await page.getByLabel('Épaules très souples', { exact: false }).check();
    await page.getByLabel('Besoin de repos', { exact: false }).check();
    await page.getByRole('button', { name: /Enregistrer ce ressenti/i }).last().click();

    await expect(page.getByText(/Une légère fatigue s'installe/i)).toBeVisible();
    await expect(page.getByText(/Encore 2 min/i)).toBeVisible();
  });

  test('allows declining the POMS opt-in', async ({ page }) => {
    await page.goto('/app/music');

    const optInPrompt = page.getByText(/Envie de partager ton ressenti/i);
    await expect(optInPrompt).toBeVisible();

    await page.getByRole('button', { name: /Pas maintenant/i }).click();

    await expect(page.getByText(/Tu pourras activer le mini point d'entrée/i)).toBeVisible();
    await expect(page.getByText(/Avant l'écoute/)).not.toBeVisible();
  });
});

