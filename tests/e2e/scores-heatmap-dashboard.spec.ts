import { test, expect } from '@playwright/test';

test.describe('Scores & Heatmap dashboard', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('aggregates Supabase history into charts and exposes PNG export', async ({ page }, testInfo) => {
    const now = new Date();
    const iso = (daysAgo: number, hours: number) => {
      const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      date.setHours(hours, 15, 0, 0);
      return date.toISOString();
    };

    const heatmapAnchor = iso(1, 20);
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] as const;
    const expectedIntenseDay = dayNames[new Date(heatmapAnchor).getDay()];

    await page.route('**/rest/v1/emotion_scans**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'scan-1',
              user_id: 'user-b2c',
              created_at: iso(5, 9),
              emotional_balance: 64,
              emotions: { scores: { joie: 6, confiance: 5, anticipation: 5, surprise: 4, tristesse: 2, colere: 1, peur: 1, degout: 1 } },
              summary: 'Matin calme',
              insights: ['Respiration 4-7-8'],
              mood: 'calme',
            },
            {
              id: 'scan-2',
              user_id: 'user-b2c',
              created_at: iso(3, 13),
              emotional_balance: 76,
              emotions: { scores: { joie: 7, confiance: 6, anticipation: 6, surprise: 5, tristesse: 1, colere: 1, peur: 1, degout: 0.5 } },
              summary: 'Midi motivé',
              insights: ['Coaching énergétique'],
              mood: 'motivé',
            },
            {
              id: 'scan-3',
              user_id: 'user-b2c',
              created_at: heatmapAnchor,
              emotional_balance: 88,
              emotions: { scores: { joie: 8, confiance: 7, anticipation: 7, surprise: 6, tristesse: 1, colere: 1, peur: 0.5, degout: 0.2 } },
              summary: 'Soir euphorique',
              insights: ['Playlist adaptative'],
              mood: 'joyeux',
            },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/metrics_flash_glow**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { ts: iso(6, 18) },
            { ts: iso(2, 18) },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { created_at: iso(4, 11), technique_type: 'coherence', session_data: { density: 0.6 } },
            { created_at: iso(1, 8), technique_type: '478', session_data: { density: 0.55 } },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/journal_entries**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { date: iso(4, 7), ai_feedback: 'Belle introspection' },
            { date: iso(2, 21), ai_feedback: 'Routine gratitude' },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/music_sessions**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { created_at: iso(3, 16), mood_tag: 'focus' },
            { created_at: iso(1, 10), mood_tag: 'calme' },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/metrics_vr_breath**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { ts: iso(7, 17) },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/metrics_vr_galaxy**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { ts: iso(5, 19) },
          ]),
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/heatmap');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/app\/heatmap/);
    await expect(page.getByText('Synchronisé en temps réel avec vos activités Supabase.')).toBeVisible();

    const moodChart = page.getByTestId('scores-mood-chart');
    await expect(moodChart.locator('svg')).toBeVisible();
    await expect(page.getByText('Humeur moyenne')).toBeVisible();

    const sessionsChart = page.getByTestId('scores-sessions-chart');
    await expect(sessionsChart.locator('svg')).toBeVisible();
    await expect(page.getByText('Séances par semaine')).toBeVisible();

    const heatmapChart = page.getByTestId('scores-heatmap-chart');
    await expect(heatmapChart.locator('svg')).toBeVisible();
    const rectCount = await heatmapChart.locator('svg rect').count();
    expect(rectCount).toBeGreaterThan(0);

    const focusLabel = `${expectedIntenseDay} — Soir`;
    await expect(page.getByText(focusLabel, { exact: false })).toBeVisible();

    const screenshot = await heatmapChart.screenshot();
    await testInfo.attach('scores-heatmap-card', { body: screenshot, contentType: 'image/png' });

    const exportButton = page.getByRole('button', { name: 'Exporter la heatmap des vibes' });
    await expect(exportButton).toBeEnabled();
  });
});
