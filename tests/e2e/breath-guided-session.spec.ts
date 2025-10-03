import { test, expect } from '@playwright/test';

test.describe('Breath guided module', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('runs a 4-7-8 session and logs Supabase session', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error' || message.type() === 'warning') {
        consoleMessages.push(message.text());
      }
    });

    let sessionInsert: any = null;

    await page.route('**/auth/v1/user**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'breath-user-1' } }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/sessions**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (route.request().method() === 'POST') {
        const body = route.request().postData() ?? '{}';
        sessionInsert = JSON.parse(body);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'session-breath-1' }]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/breath');

    await expect(page.getByRole('heading', { name: /Respiration guidée/i })).toBeVisible();

    await page.getByRole('button', { name: /Démarrer la séance/i }).click();
    await page.waitForTimeout(1_200);
    await page.getByRole('button', { name: /^Terminer$/i }).click();

    await expect(page.getByText(/Session enregistrée dans ton historique/i)).toBeVisible();

    expect(sessionInsert).toBeTruthy();
    expect(sessionInsert.type).toBe('breath');
    expect(sessionInsert.meta?.protocol).toBe('478');
    expect(sessionInsert.meta?.coherence_variant).toBeUndefined();

    expect(consoleMessages).toEqual([]);
  });

  test('supports coherence cardiaque with pause/resume', async ({ page }) => {
    const consoleMessages: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error' || message.type() === 'warning') {
        consoleMessages.push(message.text());
      }
    });

    let sessionInsert: any = null;

    await page.route('**/auth/v1/user**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'breath-user-2' } }),
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/rest/v1/sessions**', async route => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (route.request().method() === 'POST') {
        const body = route.request().postData() ?? '{}';
        sessionInsert = JSON.parse(body);
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'session-breath-2' }]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/breath');

    await page.getByLabel(/Protocole respiratoire/i).selectOption('coherence');
    await page.getByLabel(/Variante de cohérence/i).selectOption('45-55');

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: /Reprendre/i })).toBeVisible();
    await page.keyboard.press('Space');
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: /^Terminer$/i }).click();

    await expect(page.getByText(/Session enregistrée dans ton historique/i)).toBeVisible();

    expect(sessionInsert).toBeTruthy();
    expect(sessionInsert.meta?.protocol).toBe('coherence');
    expect(sessionInsert.meta?.coherence_variant).toBe('45-55');

    expect(consoleMessages).toEqual([]);
  });
});
