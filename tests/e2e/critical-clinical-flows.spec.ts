// @ts-nocheck
import { expect, test } from '@playwright/test';

test.describe('Critical clinical flows', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('allows email login and lands on the wellness dashboard', async ({ page }) => {
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            access_token: 'mock-access',
            refresh_token: 'mock-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: { id: 'user-b2c' },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'user-b2c',
              email: 'demo@user.test',
              user_metadata: { segment: 'b2c' },
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/me/feature_flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ flags: { FF_DASHBOARD: true } }),
      });
    });

    await page.route('**/rest/v1/**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      await route.fulfill({ status: 204, body: '' });
    });

    await page.route('**/functions/v1/**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/login');

    await page.getByLabel('Email').fill('demo@user.test');
    await page.getByLabel('Mot de passe').fill('secret123');

    const requestPromise = page.waitForRequest('**/auth/v1/token?grant_type=password');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await requestPromise;

    await expect(page.getByText('Connexion réussie ! Redirection...')).toBeVisible();
    await page.waitForURL('**/app/home', { timeout: 10_000 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('Nyvée STAI-6 opt-in and submissions adapt the experience', async ({ page }) => {
    const submissions: Array<{ instrument: string; answers: Record<string, number> }> = [];

    await page.route('**/me/feature_flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ flags: { FF_ASSESS_STAI6: true, FF_NYVEE: true } }),
      });
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'user-b2c',
              email: 'demo@user.test',
              user_metadata: { role: 'member', segment: 'b2c' },
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/clinical_consents**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'consent-1' }),
        });
        return;
      }
      if (method === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'consent-1' }]) });
        return;
      }
      await route.continue();
    });

    await page.route('**/assess/start', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          instrument: 'STAI6',
          locale: 'fr',
          expiry_minutes: 15,
          items: [
            { id: 's1', prompt: 'Je me sens calme.', type: 'scale', min: 1, max: 4 },
            { id: 's2', prompt: 'Je me sens en sécurité.', type: 'scale', min: 1, max: 4 },
            { id: 's3', prompt: 'Je me sens tendu·e.', type: 'scale', min: 1, max: 4 },
            { id: 's4', prompt: 'Je me sens à l’aise.', type: 'scale', min: 1, max: 4 },
            { id: 's5', prompt: 'Je me sens inquiet/inquiète.', type: 'scale', min: 1, max: 4 },
            { id: 's6', prompt: 'Je me sens détendu·e.', type: 'scale', min: 1, max: 4 },
          ],
        }),
      });
    });

    await page.route('**/assess/submit', async (route) => {
      if (route.request().method() === 'POST') {
        const payload = JSON.parse(route.request().postData() ?? '{}');
        submissions.push(payload);
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/nyvee-cocon');

    const consentRequest = page.waitForRequest('**/rest/v1/clinical_consents**', (request) => request.method() === 'POST');
    await page.getByRole('button', { name: 'Oui, personnaliser' }).click();
    await consentRequest;

    const toggle = page.getByRole('switch', { name: 'Activer le suivi STAI-6' });
    await expect(toggle).toBeEnabled();
    await toggle.click();

    const selectOption = async (phase: 'before' | 'after', item: string, value: string) => {
      await page.locator(`#${phase}-${item}-${value}`).click();
    };

    for (const item of ['s1', 's2', 's3', 's4', 's5', 's6']) {
      await selectOption('before', item, '3');
    }
    const beforeSubmit = page.waitForRequest('**/assess/submit');
    await page.getByRole('button', { name: 'Enregistrer' }).first().click();
    await beforeSubmit;
    await expect(page.getByText('Merci, c’est pris en compte.')).toBeVisible();

    for (const item of ['s1', 's2', 's3', 's4', 's5', 's6']) {
      await selectOption('after', item, '2');
    }
    const afterSubmit = page.waitForRequest('**/assess/submit');
    await page.getByRole('button', { name: 'Enregistrer' }).last().click();
    await afterSubmit;

    expect(submissions).toHaveLength(2);
    expect(submissions.every(entry => entry.instrument === 'STAI6')).toBe(true);

  });

  test('Declining the STAI-6 prompt never blocks navigation', async ({ page }) => {
    await page.route('**/me/feature_flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ flags: { FF_ASSESS_STAI6: true, FF_NYVEE: true } }),
      });
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'user-b2c',
              email: 'demo@user.test',
              user_metadata: { role: 'member', segment: 'b2c' },
            },
          }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/clinical_consents**', async (route) => {
      const method = route.request().method();
      if (method === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
        return;
      }
      if (method === 'POST' || method === 'PATCH') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: 'consent-1' }]) });
        return;
      }
      await route.continue();
    });

    await page.goto('/app/nyvee-cocon');

    const declineRequest = page.waitForRequest('**/rest/v1/clinical_consents**', (request) => request.method() === 'PATCH');
    await page.getByRole('button', { name: 'Non merci' }).click();
    await declineRequest;

    await page.goto('/app/home');
    await expect(page).toHaveURL(/\/app\/home/);
  });
});
