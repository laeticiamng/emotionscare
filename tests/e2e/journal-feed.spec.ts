import { test, expect } from '@playwright/test';

test.describe('Journal feed', () => {
  test('redirects to auth when the feed returns 401', async ({ page }, testInfo) => {
    testInfo.skip(testInfo.project.name !== 'b2c-chromium');
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

  test('creates a text entry and filters the feed', async ({ page }, testInfo) => {
    testInfo.skip(testInfo.project.name !== 'b2c-chromium');
    let idCounter = 2
    const nextUuid = () => {
      const hex = idCounter.toString(16).padStart(12, '0')
      idCounter += 1
      return `00000000-0000-0000-0000-${hex}`
    }

    const feedEntries: any[] = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        ts: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'text',
        content: 'Respiration du matin',
        tags: ['focus'],
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        summary: 'Respiration du matin',
      },
    ];

    await page.route('**/rest/v1/journal_entries**', async (route) => {
      if (route.request().method() === 'GET') {
        const url = new URL(route.request().url())
        let payload = [...feedEntries]
        const contentParam = url.searchParams.get('content')
        if (contentParam && contentParam.includes('ilike.')) {
          const term = contentParam.split('ilike.')[1]?.replace(/%/g, '').toLowerCase() ?? ''
          if (term) {
            payload = payload.filter(entry =>
              String(entry.content ?? '')
                .toLowerCase()
                .includes(term),
            )
          }
        }

        const tagsParam = url.searchParams.get('tags')
        if (tagsParam && tagsParam.startsWith('cs.')) {
          try {
            const parsed = JSON.parse(tagsParam.slice(3)) as string[]
            if (Array.isArray(parsed) && parsed.length) {
              payload = payload.filter(entry =>
                parsed.every(tag => entry.tags?.includes(tag)),
              )
            }
          } catch {
            // ignore parsing errors in mock
          }
        }

        const total = payload.length
        const upperBound = total > 0 ? total - 1 : 0

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'content-range': `0-${upperBound}/${total}`,
          },
          body: JSON.stringify(payload),
        });
        return;
      }
      if (route.request().method() === 'POST') {
        const payloadText = route.request().postData() ?? '[]';
        const payload = JSON.parse(payloadText)[0] ?? {};
        const createdAt = new Date().toISOString();
        feedEntries.unshift({
          id: nextUuid(),
          content: payload.content ?? '',
          tags: payload.tags ?? [],
          created_at: createdAt,
          summary: payload.summary ?? '',
        });
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: feedEntries[0].id }]),
        });
        return;
      }
      await route.continue();
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
