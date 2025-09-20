import { expect, test, type Route } from '@playwright/test';

const resolveInstrument = (route: Route) => {
  const url = new URL(route.request().url());
  const instrumentFilter = url.searchParams.get('instrument');
  if (!instrumentFilter) return null;
  const [, value] = instrumentFilter.split('.');
  return value ?? instrumentFilter;
};

const respondAssessments = async (route: Route, level: number) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      {
        submitted_at: new Date().toISOString(),
        ts: new Date().toISOString(),
        score_json: {
          summary: 'indicateur mensuel',
          level,
          generated_at: new Date().toISOString(),
        },
      },
    ]),
  });
};

test.describe('Boss Grit orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/assessments**', async (route) => {
      const instrument = resolveInstrument(route);
      if (instrument === 'GRITS' || instrument === 'BRS') {
        await respondAssessments(route, 1);
        return;
      }
      await respondAssessments(route, 2);
    });

    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('activates short compassionate challenge with textual copy', async ({ page }) => {
    await page.goto('/app/boss-grit');

    await expect(page.getByRole('heading', { name: 'Défi douceur (environ trois minutes)' })).toBeVisible();
    await expect(page.getByText('Ta série reste intacte', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Lancer le défi bienveillant' }).click();
    await expect(page.getByRole('button', { name: 'Terminer en douceur' })).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
