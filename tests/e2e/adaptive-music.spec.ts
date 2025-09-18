import { test, expect } from '@playwright/test';

const PLAYLIST_ROUTE = '**/api/mood_playlist';

const playlistPayload = {
  playlist_id: 'relaxed_focus_set',
  mood: 'relaxed',
  requested_mood: 'relaxed',
  title: 'Relaxed Focus Session',
  description: 'Une sélection adaptée pour alléger la charge mentale.',
  total_duration: 1800,
  tracks: [
    {
      id: 'track-relax-1',
      title: 'Deep Calm Waves',
      artist: 'Adaptive Ensemble',
      url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
      duration: 240,
      mood: 'relaxed',
      energy: 0.42,
      focus: 'flow',
      instrumentation: ['synth', 'pads'],
      tags: ['calm', 'deep-work'],
      description: 'Pads éthérés pour stabiliser la respiration.',
    },
    {
      id: 'track-relax-2',
      title: 'Morning Horizon',
      artist: 'Adaptive Ensemble',
      url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=',
      duration: 300,
      mood: 'relaxed',
      energy: 0.48,
      focus: 'breathing',
      instrumentation: ['piano', 'textures'],
      tags: ['serenity'],
      description: 'Textures lumineuses pour préparer la journée.',
    },
  ],
  energy_profile: {
    baseline: 0.35,
    requested: 0.4,
    recommended: 0.52,
    alignment: 0.86,
    curve: [
      {
        track_id: 'track-relax-1',
        start: 0,
        end: 240,
        energy: 0.42,
        focus: 'flow',
      },
      {
        track_id: 'track-relax-2',
        start: 240,
        end: 540,
        energy: 0.48,
        focus: 'breathing',
      },
    ],
  },
  recommendations: [
    'Installez-vous dans un espace calme pendant 20 minutes.',
    'Respirez en carré sur les deux premières pistes.',
  ],
  guidance: {
    focus: 'Maintenez une respiration régulière et relâchez progressivement les épaules.',
    breathwork: 'Coherence cardiaque 5-5',
    activities: ['Deep work', 'Lecture douce'],
  },
  metadata: {
    curated_by: 'Adaptive Coach',
    tags: ['relax', 'focus'],
    dataset_version: '2024.09',
  },
};

test.describe('Adaptive Music — recommandations & favoris', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('propose une playlist, sauvegarde un favori et reprend la lecture', async ({ page }) => {
    await page.route(PLAYLIST_ROUTE, async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, data: playlistPayload }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/modules/adaptive-music');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.reload();

    await expect(page.getByRole('heading', { name: /Adaptive Music/i })).toBeVisible();

    const listenButton = page.getByRole('button', { name: /Écouter/i }).first();
    await listenButton.click();

    const playerPlayButton = page.getByRole('button', { name: /^Lecture$/i }).first();
    await playerPlayButton.click();
    await expect(page.getByRole('button', { name: /^Pause$/i })).toBeVisible();

    await page.waitForTimeout(1200);

    const pauseButton = page.getByRole('button', { name: /^Pause$/i }).first();
    await pauseButton.click();

    const favoriteToggle = page.getByRole('button', { name: /Ajouter aux favoris/i });
    await favoriteToggle.click();
    await expect(favoriteToggle).toHaveAttribute('aria-pressed', 'true');

    await page.reload();

    await expect(page.getByText(/Favoris récents/)).toBeVisible();
    const resumeCard = page.getByRole('button', { name: /Reprendre/i });
    await expect(resumeCard).toBeEnabled();

    await resumeCard.click();
    await expect(page.getByRole('button', { name: /^Pause$/i })).toBeVisible();

    const favoritePlay = page.getByRole('button', { name: /^Lire$/i }).first();
    await favoritePlay.click();
    await expect(page.getByRole('button', { name: /^Pause$/i })).toBeVisible();

    await expect(page.getByText(/Installez-vous dans un espace calme/)).toBeVisible();
    await expect(page.getByText(/Jeu de données 2024\.09/i)).toBeVisible();
  });
});

