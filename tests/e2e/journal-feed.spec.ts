import { test, expect } from '@playwright/test';

test.describe('Journal feed', () => {
  test.skip(({}, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('redirects to auth when the feed returns 401', async ({ page }) => {
    await page.route('**/functions/v1/api/v1/me/journal', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, error: { code: 'unauthorized', message: 'Missing token' } }),
      });
    });

    await page.goto('/app/journal');
    await page.waitForURL(/\/auth/);
  });

  test('creates a text entry and filters the feed', async ({ page }) => {
    const feedEntries: any[] = [
      {
        id: 'seed-entry',
        ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'text',
        text_raw: 'Respiration du matin #focus',
        preview: 'Respiration du matin',
        summary_120: 'Respiration du matin',
        tags: ['focus'],
        valence: 0.1,
      },
    ];

    await page.route('**/functions/v1/api/v1/me/journal', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, data: { entries: feedEntries } }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/functions/v1/api/v1/journal/text', async (route) => {
      const payloadText = route.request().postData() ?? '{}';
      const payload = JSON.parse(payloadText);
      const createdAt = new Date().toISOString();
      const tagMatches = typeof payload.text_raw === 'string'
        ? (payload.text_raw.match(/#([\p{L}\p{N}_-]{2,24})/gu) ?? []).map((tag: string) => tag.replace('#', '').toLowerCase())
        : [];

      feedEntries.unshift({
        id: `entry-${Date.now()}`,
        ts: createdAt,
        type: 'text',
        text_raw: payload.text_raw ?? '',
        preview: payload.preview ?? '',
        summary_120: payload.preview ?? '',
        tags: tagMatches,
        valence: payload.valence ?? 0,
      });

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, data: { id: feedEntries[0].id, ts: createdAt } }),
      });
    });

    await page.goto('/app/journal');
    await expect(page).toHaveURL(/\/app\/journal/);

    const entriesLocator = page.getByTestId('journal-feed-entry');
    await expect(entriesLocator.first()).toContainText('Respiration du matin');

    await page.getByTestId('journal-textarea').fill('Nouveau test plein de gratitude');
    await page.getByTestId('journal-tag-input').fill('Focus, gratitude');
    await page.getByTestId('journal-submit').click();

    await expect(entriesLocator.first()).toContainText('Nouveau test');
    await expect(entriesLocator.first()).toContainText('#focus');

    await page.getByTestId('journal-search-input').fill('respiration');
    await expect(entriesLocator).toHaveCount(1);
    await expect(entriesLocator.first()).toContainText('Respiration');

    await page.getByTestId('journal-search-input').fill('');
    await page.getByTestId('journal-tag-focus').click();
    await expect(entriesLocator.first()).toContainText('#focus');
    await page.getByTestId('journal-tag-all').click();
  });
});
