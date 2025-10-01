// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Emotion scan SAM consent flows', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  const mockFeatureFlags = async (page: import('@playwright/test').Page) => {
    await page.route('**/me/feature_flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ flags: { FF_SCAN: true, FF_ASSESS_SAM: true } }),
      });
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-b2c', email: 'demo@user.test' } }),
        });
        return;
      }
      await route.continue();
    });
  };

  test('allows activating SAM consent inline', async ({ page }) => {
    await mockFeatureFlags(page);

    const submissions: Array<{ method: string; body: unknown }> = [];
    await page.route('**/rest/v1/clinical_consents**', async (route) => {
      const request = route.request();
      const method = request.method();

      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }

      if (method === 'POST') {
        submissions.push({ method, body: JSON.parse(request.postData() ?? '{}') });
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'consent-sam-1' }),
        });
        return;
      }

      if (method === 'PATCH') {
        submissions.push({ method, body: JSON.parse(request.postData() ?? '{}') });
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'consent-sam-1' }]) });
        return;
      }

      await route.continue();
    });

    await page.goto('/app/scan');

    const prompt = page.getByRole('heading', { name: /Activer l'évaluation SAM/i });
    await expect(prompt).toBeVisible();

    const consentRequest = page.waitForRequest('**/rest/v1/clinical_consents**', (request) => request.method() === 'POST');
    await page.getByRole('button', { name: /Oui, activer/i }).click();
    await consentRequest;

    await expect(prompt).not.toBeVisible();
    await expect(page.getByRole('heading', { name: /Scan express SAM/i })).toBeVisible();
    expect(submissions.some((entry) => entry.method === 'POST')).toBe(true);
  });

  test('supports declining the SAM consent', async ({ page }) => {
    await mockFeatureFlags(page);

    const declineCalls: string[] = [];
    await page.route('**/rest/v1/clinical_consents**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      if (method === 'POST' || method === 'PATCH') {
        declineCalls.push(method);
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'consent-sam-2' }]) });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/scan');

    const declineButton = page.getByRole('button', { name: /Non merci/i });
    await expect(declineButton).toBeVisible();
    await declineButton.click();

    await expect(page.getByRole('heading', { name: /Activer l'évaluation SAM/i })).not.toBeVisible();
    expect(declineCalls.length).toBeGreaterThan(0);
  });
});
