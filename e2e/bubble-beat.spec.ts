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
          summary: 'stress suivi',
          level,
          generated_at: new Date().toISOString(),
        },
      },
    ]),
  });
};

test.describe('Bubble Beat orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/assessments**', async (route) => {
      const instrument = resolveInstrument(route);
      if (instrument === 'PSS10') {
        await respondAssessments(route, 4);
        return;
      }
      await respondAssessments(route, 2);
    });

    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('adapts path and exposes Nyvée CTA when stress is elevated', async ({ page }) => {
    await page.goto('/app/bubble-beat');

    await expect(page.getByRole('heading', { name: 'Parcours apaisant' })).toBeVisible();
    await expect(page.getByText('Durée proposée : Environ deux minutes.', { exact: false })).toBeVisible();

    await page.getByRole('button', { name: 'Démarrer la séance' }).click();
    await page.getByRole('button', { name: 'Terminer la bulle sonore' }).click();

    await expect(page.getByRole('link', { name: 'Parler à Nyvée' })).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
