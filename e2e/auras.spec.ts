import { expect, test, type Route } from '@playwright/test';

const fulfillAssessments = async (route: Route, level: number) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      {
        submitted_at: new Date().toISOString(),
        ts: new Date().toISOString(),
        score_json: {
          summary: 'halo lumineux',
          level,
          generated_at: new Date().toISOString(),
        },
      },
    ]),
  });
};

test.describe('Auras orchestration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/assessments**', async (route) => {
      await fulfillAssessments(route, 4);
    });

    await page.route('**/rest/v1/sessions**', async (route) => {
      await route.fulfill({ status: 200, body: '{}' });
    });
  });

  test('renders warm halo without digits', async ({ page }) => {
    await page.goto('/app/leaderboard');

    await expect(page.getByRole('heading', { name: 'Halo soleil coton' })).toBeVisible();
    await expect(page.getByText('Ambiance conseillée : textures lumineuses, voix enveloppantes et rythmes souples.')).toBeVisible();

    const mainCopy = await page.locator('main').innerText();
    expect(mainCopy).not.toMatch(/\d/);
  });
});
