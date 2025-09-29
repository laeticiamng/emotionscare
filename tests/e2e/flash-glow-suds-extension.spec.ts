import { expect, test } from '@playwright/test';

test.describe('Flash Glow SUDS extension flow', () => {
  test('auto-extends session when post SUDS tension stays high', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'b2c-chromium') {
      test.skip();
    }

    const consoleWarnings: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning' || message.type() === 'error') {
        consoleWarnings.push(`${message.type()}: ${message.text()}`);
      }
    });

    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem('flash_glow_suds_opt_in');
        window.localStorage.removeItem('flash_glow_suds_cooldown');
      } catch {
        /* noop */
      }
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-flash-suds' } }),
        });
        return;
      }

      await route.continue();
    });

    const sudsRequests: Array<Record<string, any>> = [];
    await page.route('**/functions/v1/assess-submit', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      const rawBody = request.postData() ?? '{}';
      try {
        sudsRequests.push(JSON.parse(rawBody));
      } catch {
        sudsRequests.push({ raw: rawBody });
      }

      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.route('**/rest/v1/user_activity_sessions**', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (request.method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'activity-flash-suds',
              user_id: 'user-flash-suds',
              activity_type: 'flash_glow',
              duration_seconds: 120,
              session_data: { extension_used: true },
              mood_before: null,
              mood_after: null,
              completed_at: new Date().toISOString(),
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/journal_entries**', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (request.method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'journal-flash-suds',
              user_id: 'user-flash-suds',
              content: 'Session prolongée pour haute tension.',
              created_at: new Date().toISOString(),
              emotion_analysis: { mood_delta: 2 },
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/app/flash-glow');

    await expect(page.getByRole('button', { name: /Je partage ce ressenti/i })).toBeVisible();
    await page.getByRole('button', { name: /Je partage ce ressenti/i }).click();

    const startButton = page.getByRole('button', { name: /Lancer la lueur/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    await page.waitForTimeout(600);

    const softExit = page.getByRole('button', { name: /Sortie douce/i });
    await expect(softExit).toBeEnabled();
    await softExit.click();

    await expect(page.getByRole('heading', { name: /Comment ça atterrit/i })).toBeVisible();

    const dialogSlider = page.getByRole('slider').last();
    await dialogSlider.focus();
    for (let i = 0; i < 5; i += 1) {
      await dialogSlider.press('ArrowRight');
    }

    const extendButton = page.getByRole('button', { name: /Encore 60 s/i });
    await expect(extendButton).toBeVisible();

    await extendButton.click();

    await expect(page.getByRole('heading', { name: /Comment ça atterrit/i })).not.toBeVisible();
    await expect(page.getByText(/Extension active/i)).toBeVisible();
    await expect(page.getByText(/Encore un peu de lumière/i)).toBeVisible();

    expect(sudsRequests.length).toBeGreaterThanOrEqual(2);
    const lastPayload = sudsRequests.at(-1);
    expect(lastPayload?.instrument).toBe('SUDS');
    expect(lastPayload?.answers?.['1']).toBeGreaterThanOrEqual(7);

    expect(consoleWarnings).toEqual([]);
  });
});
