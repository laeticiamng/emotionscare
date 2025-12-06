// @ts-nocheck
import { expect, test } from '@playwright/test';

test('B2B monthly report detail — rendu texte et export', async ({ page }, testInfo) => {
  if (!testInfo.project.name.includes('b2b_admin')) {
    test.skip();
  }

  await page.addInitScript(() => {
    window.print = () => {
      (window as unknown as { __printed?: boolean }).__printed = true;
    };
    window.open = (url: string | URL) => {
      (window as unknown as { __exportUrl?: string }).__exportUrl = typeof url === 'string' ? url : url.toString();
      return null;
    };
  });

  await page.route('**/functions/v1/b2b-report?period=2025-02', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        title: 'Rapport organisation — 2025-02',
        period: '2025-02',
        team_label: null,
        summary: [
          'Ambiance globalement posée.',
          'Quelques signaux de fatigue à accueillir avec attention.',
          "Implication forte, envie d'avancer partagée.",
        ],
        action: 'Réunion courte sans agenda pour relâcher.',
      }),
    });
  });

  await page.route('**/functions/v1/b2b-report-export', async (route) => {
    const body = await route.request().json();
    expect(body).toEqual({ period: '2025-02', team_id: null });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        url: 'https://storage.test/report-2025-02.csv?signature=mock',
        expires_at: '2025-02-28T12:00:00.000Z',
        fallback: null,
      }),
    });
  });

  await page.goto('/b2b/reports/2025-02');

  const summaryItems = page.getByTestId('report-summary-line');
  await expect(summaryItems).toHaveCount(3);
  for (const item of await summaryItems.all()) {
    await expect(item).not.toHaveText(/\d/);
  }

  await page.getByRole('button', { name: 'Exporter (CSV)' }).click();
  await page.waitForTimeout(100);
  const exportUrl = await page.evaluate(() => (window as unknown as { __exportUrl?: string }).__exportUrl ?? '');
  expect(exportUrl).toContain('report-2025-02.csv');

  await page.getByRole('button', { name: 'Imprimer' }).click();
  const printed = await page.evaluate(() => (window as unknown as { __printed?: boolean }).__printed ?? false);
  expect(printed).toBeTruthy();
});
