import { test, expect } from '@playwright/test';

test('Journal sanitize XSS', async ({ page }) => {
  const entries: any[] = []

  await page.route('**/rest/v1/journal_entries**', async (route) => {
    if (route.request().method() === 'POST') {
      const payloadText = route.request().postData() ?? '[]'
      const payload = JSON.parse(payloadText)[0] ?? {}
      entries.unshift({
        id: '00000000-0000-0000-0000-000000000010',
        content: payload.content ?? '',
        tags: payload.tags ?? [],
        created_at: new Date().toISOString(),
      })
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify([{ id: entries[0].id }]),
      })
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'content-range': '0-0/0' },
      body: JSON.stringify(entries),
    })
  })

  await page.goto('/app/journal');
  await page.getByTestId('journal-textarea').fill('<img src=x onerror=alert(1)> Hello');
  await page.getByTestId('journal-submit').click();
  const entry = page.getByText('Hello');
  await expect(entry).toBeVisible();
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
});
