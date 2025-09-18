import { test, expect } from '@playwright/test';

const EMOTION_SCANS_ENDPOINT = '**/rest/v1/emotion_scans*';
const FLASH_GLOW_ENDPOINT = '**/rest/v1/metrics_flash_glow*';
const BREATHWORK_ENDPOINT = '**/rest/v1/breathwork_sessions*';
const JOURNAL_ENDPOINT = '**/rest/v1/journal_entries*';
const MUSIC_ENDPOINT = '**/rest/v1/music_sessions*';
const VR_BREATH_ENDPOINT = '**/rest/v1/metrics_vr_breath*';
const VR_GALAXY_ENDPOINT = '**/rest/v1/metrics_vr_galaxy*';

function isoDaysAgo(daysAgo: number, hours: number) {
  const date = new Date();
  date.setHours(hours, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function isoWeeksAgo(weeksAgo: number, hours: number) {
  const date = new Date();
  date.setHours(hours, 0, 0, 0);
  date.setDate(date.getDate() - weeksAgo * 7);
  return date.toISOString();
}

test.describe('Scores & Heatmap — visualisation et export', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('affiche les graphiques et déclenche un export PNG', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __downloadSpy: Array<{ download: string; href: string }> }).__downloadSpy = [];
      const anchorProto = HTMLAnchorElement.prototype;
      const originalClick = anchorProto.click;
      anchorProto.click = function patchedClick(this: HTMLAnchorElement) {
        const spy = (window as unknown as { __downloadSpy: Array<{ download: string; href: string }> }).__downloadSpy;
        spy.push({ download: this.download, href: this.href });
        return originalClick.call(this);
      };
    });

    const emotionScans = Array.from({ length: 10 }, (_, index) => {
      const daysAgo = 9 - index;
      return {
        created_at: isoDaysAgo(daysAgo, 9),
        emotional_balance: 58 + index * 3,
        emotions: {
          scores: {
            joie: 6 + index * 0.2,
            anticipation: 5 + index * 0.15,
            surprise: 3 + index * 0.1,
            tristesse: 1.1,
            colere: 0.7,
            peur: 0.5,
            degout: 0.3,
          },
        },
        insights: [`Perspective ${index + 1}`],
        summary: `Synthèse ${index + 1}`,
        mood: index % 2 === 0 ? 'confiant' : 'apaise',
      };
    });

    const flashGlowMetrics = [
      ...Array.from({ length: 6 }, (_, week) => ({ ts: isoWeeksAgo(week, 18) })),
      { ts: isoDaysAgo(1, 8) },
      { ts: isoDaysAgo(3, 20) },
    ];

    const breathworkSessions = [
      ...Array.from({ length: 6 }, (_, week) => ({
        created_at: isoWeeksAgo(week, 7),
        technique_type: week % 2 === 0 ? 'coherence_cardiaque' : '4-7-8',
        session_data: { density: 0.58 + week * 0.05 },
      })),
      {
        created_at: isoDaysAgo(2, 6),
        technique_type: '4-7-8',
        session_data: { density: 0.72 },
      },
    ];

    const journalEntries = [
      { date: isoWeeksAgo(0, 12), ai_feedback: 'Focus du jour' },
      { date: isoWeeksAgo(1, 12), ai_feedback: 'Respiration profonde' },
      { date: isoDaysAgo(0, 15), ai_feedback: 'Réflexion calme' },
    ];

    const musicSessions = [
      { created_at: isoDaysAgo(0, 8), mood_tag: 'focus' },
      { created_at: isoDaysAgo(3, 19), mood_tag: 'calm' },
    ];

    const vrBreathMetrics = [
      { ts: isoWeeksAgo(0, 16) },
      { ts: isoWeeksAgo(1, 17) },
    ];

    const vrGalaxyMetrics = [
      { ts: isoWeeksAgo(1, 21) },
      { ts: isoWeeksAgo(2, 22) },
    ];

    await page.route(EMOTION_SCANS_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emotionScans),
      });
    });

    await page.route(FLASH_GLOW_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(flashGlowMetrics),
      });
    });

    await page.route(BREATHWORK_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(breathworkSessions),
      });
    });

    await page.route(JOURNAL_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(journalEntries),
      });
    });

    await page.route(MUSIC_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(musicSessions),
      });
    });

    await page.route(VR_BREATH_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(vrBreathMetrics),
      });
    });

    await page.route(VR_GALAXY_ENDPOINT, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(vrGalaxyMetrics),
      });
    });

    await page.goto('/app/scores');

    const panel = page.getByRole('region', { name: /Scores V2/i });
    await expect(panel.getByRole('heading', { name: /Évolution de l'humeur/i })).toBeVisible();
    await expect(panel.getByRole('heading', { name: /Séances par semaine/i })).toBeVisible();
    await expect(panel.getByRole('heading', { name: /Heatmap Vibes/i })).toBeVisible();
    await expect(panel.getByText(/Humeur moyenne/)).toBeVisible();

    await expect(panel).toHaveScreenshot('scores-dashboard.png', {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.05,
    });

    const exportButton = panel.getByRole('button', { name: /Exporter l'évolution de l'humeur/i });
    await exportButton.click();

    const downloads = await page.evaluate(() => (window as unknown as { __downloadSpy?: Array<{ download: string; href: string }> }).__downloadSpy ?? []);
    expect(downloads.some(entry => entry.download === 'scores-humeur.png' && entry.href.startsWith('data:image/png;base64,'))).toBeTruthy();
  });
});
