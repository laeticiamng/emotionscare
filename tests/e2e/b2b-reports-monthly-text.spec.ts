import { expect, test } from '@playwright/test';
import { promises as fs } from 'fs';
import type { Download } from '@playwright/test';

async function downloadToString(download: Download): Promise<string> {
  const stream = await download.createReadStream();
  if (stream) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream as AsyncIterable<Uint8Array | string>) {
      if (typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));
      } else {
        chunks.push(Buffer.from(chunk));
      }
    }
    return Buffer.concat(chunks).toString('utf-8');
  }

  const path = await download.path();
  if (!path) {
    return '';
  }
  return fs.readFile(path, 'utf-8');
}

test.describe('B2B monthly text-only reports', () => {
  test('manager can consult, print and export a signed narrative CSV', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('b2b_admin'), 'Requires manager session state.');

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
    });

    await page.route('**/functions/v1/assess-aggregate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          summaries: [
            {
              instrument: 'WEMWBS',
              period: '2024-03',
              text: 'Le collectif respire calmement. La coopération apaise les tensions. Quelques signaux de fatigue partagée.',
              action: 'Ouvrir un check-in calme pour déposer ce qui pèse.',
            },
            {
              instrument: 'CBI',
              period: '2024-03',
              text: 'Les équipes évoquent une charge soutenable à surveiller. La fatigue reste diffuse mais gérable en duo.',
              action: 'Prévoir une pause respiration partagée en équipe.',
            },
            {
              instrument: 'UWES',
              period: '2024-03',
              text: 'Un élan d’engagement demeure grâce aux rituels de soutien et aux temps d’écoute partagés.',
            },
          ],
        }),
      });
    });

    await page.goto('/app/reports');

    await expect(page.getByRole('heading', { name: /Récits mensuels/i })).toBeVisible();

    const detailLink = page.getByRole('link', { name: /Consulter le récit/i }).first();
    await detailLink.click();

    await expect(page.getByRole('heading', { name: 'Tendance douce' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ce qui a aidé' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pistes à explorer' })).toBeVisible();

    const helperItems = page.locator('section:has(h2:has-text("Ce qui a aidé")) li');
    const helperCount = await helperItems.count();
    expect(helperCount).toBeGreaterThan(0);
    expect(helperCount).toBeLessThanOrEqual(3);

    const actionItems = page.locator('section:has(h2:has-text("Pistes à explorer")) li');
    await expect(actionItems).toHaveCount(2);

    await page.getByRole('button', { name: /Imprimer/i }).click();
    const printed = await page.evaluate(() => (window as unknown as { __printed?: boolean }).__printed ?? false);
    expect(printed).toBeTruthy();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Exporter le récit \(texte\)/i }).click(),
    ]);

    const csvContent = await downloadToString(download);
    expect(csvContent).toContain('period,instrument,text_summary,action');
    expect(csvContent).toContain('"2024-03"');
    expect(csvContent).toContain('"Prévoir une pause respiration partagée en équipe."');
    expect(csvContent).not.toContain(',n,');

    expect(consoleWarnings).toEqual([]);
  });

  test('employee is forbidden from accessing monthly reports', async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('b2b_user'), 'Requires employee session state.');

    await page.goto('/app/reports');
    await expect(page).toHaveURL(/forbidden|403/);
  });
});
