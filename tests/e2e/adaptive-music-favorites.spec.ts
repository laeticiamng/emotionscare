import { test, expect } from '@playwright/test';

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
        description: 'Synthés enveloppants pour prolonger l'accalmie.',
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
      'Prolongez la détente avec une séance journal guidée.',
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

test.describe('Adaptive Music favorites and resume', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('allows resuming the last track and saving it to favorites', async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem('adaptive-music:favorites', JSON.stringify([]));
        window.localStorage.setItem(
          'adaptive-music:playback:track-relaxed-01',
          JSON.stringify({
            position: 42.5,
            volume: 0.7,
            wasPlaying: false,
            updatedAt: Date.now() - 60_000,
            trackTitle: 'Respiration Alignée',
            trackSrc: 'https://example.com/audio/relaxed-01.mp3',
          }),
        );
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
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-adaptive-music' } }),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/mood_playlist', async (route) => {
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

    await page.route('**/*.mp3', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: '' });
        return;
      }

      await route.continue();
    });

    await page.goto('/app/music');

    const heading = page.getByRole('heading', { name: /Adaptive Music/i });
    await expect(heading).toBeVisible({ timeout: 20000 });

    const playlistCard = page.getByText('Respiration Alignée').first();
    await expect(playlistCard).toBeVisible();

    const resumeInfo = page.getByText(/Reprise à 0:42/i);
    await expect(resumeInfo).toBeVisible();

    const resumeButton = page.getByRole('button', { name: /Reprendre \(0:42\)/i });
    await expect(resumeButton).toBeVisible();

    await resumeButton.click();

    const primaryToggle = page.locator('[data-ui="primary-cta"]');
    await expect(primaryToggle).toHaveText(/Pause/i);

    const favoriteToggle = page.locator('[data-ui="favorite-toggle"]');
    await favoriteToggle.click();

    await expect(page.getByText(/Sauvegardé dans vos favoris locaux/i)).toBeVisible();

    const favoritesListItem = page
      .getByRole('listitem')
      .filter({ hasText: 'Respiration Alignée' })
      .first();
    await expect(favoritesListItem).toBeVisible({ timeout: 10000 });

    const storedFavorites = await page.evaluate(() => {
      const raw = window.localStorage.getItem('adaptive-music:favorites');
      return raw ? JSON.parse(raw) : [];
    });

    expect(Array.isArray(storedFavorites)).toBeTruthy();
    expect(storedFavorites.some((entry: any) => entry?.id === 'track-relaxed-01')).toBeTruthy();
  });
});
