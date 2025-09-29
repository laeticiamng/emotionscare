import { test, expect } from '@playwright/test';

test('B2B heatmap — chargement textuel et navigation vers le rapport', async ({ page }, testInfo) => {
  if (!testInfo.project.name.includes('b2b_admin')) {
    test.skip();
  }

  const consoleWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') {
      consoleWarnings.push(message.text());
    }
  });

  await page.addInitScript(() => {
    window.print = () => {
      (window as unknown as { __printed?: boolean }).__printed = true;
    };
    // eslint-disable-next-line no-extend-native
    HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,AAAA';
  });

  await page.route('**/functions/v1/b2b-heatmap-periods', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ periods: ['2025-09', '2025-08'] }),
    });
  });

  await page.route('**/functions/v1/b2b-heatmap**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        period: '2025-09',
        cells: [
          {
            team_id: null,
            team_label: 'Organisation',
            instrument: 'UWES',
            summary: 'Implication sereine, envie collective intacte.',
          },
          {
            team_id: 'team-a',
            team_label: 'Équipe A',
            instrument: 'WEMWBS',
            summary: 'Ambiance apaisée, échanges fluides et attentifs.',
          },
          {
            team_id: 'aggregated',
            team_label: 'Autres (agrégé)',
            instrument: 'CBI',
            summary: 'Synthèse mutualisée : fatigue légère détectée.',
          },
        ],
      }),
    });
  });

  await page.goto('/b2b/rh');

  await expect(page.getByRole('heading', { name: /Heatmap RH textuelle/i })).toBeVisible();
  const firstCell = page.getByTestId('heatmap-card').first();
  await expect(firstCell).toContainText('Implication sereine');
  await expect(firstCell).not.toContainText(/\d/);

  const aggregatedCell = page.getByTestId('heatmap-card').filter({ hasText: 'fatigue' }).first();
  await expect(aggregatedCell).toContainText('fatigue');
  await expect(aggregatedCell).toContainText('Synthèse mutualisée');

  await firstCell.click();
  await expect(page).toHaveURL(/\/b2b\/reports\?/);

  expect(consoleWarnings).toEqual([]);
});
