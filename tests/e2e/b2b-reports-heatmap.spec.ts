import { test, expect } from '@playwright/test';

test('B2B reports heatmap — chargement, filtres, export et impression', async ({ page }, testInfo) => {
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

  await page.route('**/functions/v1/assess-aggregate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        summaries: [
          { instrument: 'WEMWBS', period: '2024-W11', text: 'Ton collectif apaisé', team: 'Produit' },
          { instrument: 'CBI', period: '2024-W11', text: 'Fatigue résiduelle mais partagée', team: 'Produit' },
          { instrument: 'UWES', period: '2024-W11', text: 'Élan d’engagement constaté' },
        ],
      }),
    });
  });

  await page.goto('/b2b/reports');

  await expect(page.getByRole('heading', { name: /Heatmap RH/i })).toBeVisible();
  await expect(page.getByTestId('heatmap-text').first()).toContainText('Ton collectif');
  await expect(page.getByTestId('action-suggestion').first()).toBeVisible();

  await page.getByLabel('Instrument').click();
  await page.getByRole('option', { name: 'CBI' }).click();
  await expect(page.getByTestId('heatmap-text').first()).toContainText('Fatigue');

  await page.getByLabel('Équipe').click();
  await page.getByRole('option', { name: 'Organisation complète' }).click();
  await expect(page.getByTestId('heatmap-text').nth(0)).toContainText('Ton collectif');

  await page.getByRole('button', { name: /Exporter en PNG/i }).click();
  await page.getByRole('button', { name: /Imprimer/i }).click();
  const printed = await page.evaluate(() => (window as unknown as { __printed?: boolean }).__printed ?? false);
  expect(printed).toBeTruthy();

  expect(consoleWarnings).toEqual([]);
});
