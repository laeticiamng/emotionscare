// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Scores & vibes dashboard', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('renders mood, sessions and heatmap with PNG export', async ({ page }) => {
    const now = new Date('2024-05-20T12:00:00.000Z');
    const iso = (daysAgo: number, hours: number) => {
      const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      date.setUTCHours(hours, 0, 0, 0);
      return date.toISOString();
    };

    await page.route('**/rest/v1/emotion_scans**', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      const url = new URL(route.request().url());
      const select = url.searchParams.get('select');
      if (select?.includes('payload')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { created_at: iso(2, 8), payload: { valence: 0.4, arousal: 0.6, labels: ['Calm'] } },
            { created_at: iso(1, 12), payload: { valence: 0.1, arousal: 0.3, labels: ['Focus'] } },
            { created_at: iso(0, 20), payload: { valence: 0.8, arousal: 0.9, labels: ['Bright'] } },
          ]),
        });
        return;
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.route('**/rest/v1/sessions**', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { created_at: iso(6, 9), type: 'FlashGlow' },
          { created_at: iso(6, 10), type: 'Breath' },
          { created_at: iso(2, 18), type: 'Music' },
        ]),
      });
    });

    await page.goto('/app/scores');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/app\/scores/);
    await expect(page.getByRole('heading', { name: /Scores & vibes/i })).toBeVisible();

    const moodChart = page.getByTestId('scores-mood-chart');
    await expect(moodChart.locator('svg')).toBeVisible();
    await expect(page.getByText('Série couvrant', { exact: false })).toBeVisible();

    const sessionsChart = page.getByTestId('scores-sessions-chart');
    await expect(sessionsChart.locator('svg')).toBeVisible();
    await expect(page.getByText('Chaque colonne représente une semaine ISO')).toBeVisible();

    const heatmapChart = page.getByTestId('scores-heatmap-chart');
    const rectCount = await heatmapChart.locator('svg rect').count();
    expect(rectCount).toBeGreaterThan(0);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Exporter la heatmap/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('vibes-heatmap');
  });
});
