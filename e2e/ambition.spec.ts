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
          summary: 'progression en douceur',
          level,
          generated_at: new Date().toISOString(),
        },
      },
    ]),
  });
};

test.describe('Ambition arcade orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/assessments**', async (route) => {
      const instrument = resolveInstrument(route);
      if (instrument === 'GAS') {
        await respondAssessments(route, 4);
        return;
      }
      await respondAssessments(route, 3);
    });

    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('suggests micro levers and keeps UI text-only', async ({ page }) => {
    await page.goto('/app/ambition-arcade');

    await expect(page.getByRole('heading', { name: 'Presque au point d’étincelle' })).toBeVisible();
    await expect(page.getByText('Micro-leviers du jour')).toBeVisible();

    const expectedMicroLevers = ['un geste simple', 'quelques pas de marche', 'respirer calmement'];
    for (const lever of expectedMicroLevers) {
      await expect(page.getByRole('checkbox', { name: lever })).toBeVisible();
    }

    const leverLabels = await page
      .locator('form[aria-label="Liste de micro-leviers"] label')
      .allTextContents();
    for (const label of leverLabels) {
      expect(label).not.toMatch(/\d/);
    }

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
