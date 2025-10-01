// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Breath Constellation session flow', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('runs a guided session and logs both Supabase tables', async ({ page }) => {
    let breathworkInsert: any = null;
    let activityInsert: any = null;

    await page.addInitScript(() => {
      try {
        Object.defineProperty(window.navigator, 'vibrate', {
          configurable: true,
          value: () => false
        });
      } catch (error) {
        console.warn('navigator.vibrate override failed', error);
      }
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-breath' } }),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/breathwork_sessions**', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (request.method() === 'POST') {
        const rawBody = request.postData() ?? '{}';
        breathworkInsert = JSON.parse(rawBody);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'breath-session-1',
              user_id: 'user-breath',
              created_at: new Date().toISOString(),
              technique_type: breathworkInsert?.technique_type ?? 'coherence-5-5',
              duration: breathworkInsert?.duration ?? 240,
              session_data: breathworkInsert?.session_data ?? {},
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.route('**/rest/v1/user_activity_sessions**', async (route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      if (request.method() === 'POST') {
        const rawBody = request.postData() ?? '{}';
        activityInsert = JSON.parse(rawBody);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'activity-session-1',
              user_id: 'user-breath',
              activity_type: activityInsert?.activity_type ?? 'breath_constellation',
              completed_at: activityInsert?.completed_at ?? new Date().toISOString(),
              duration_seconds: activityInsert?.duration_seconds ?? 120,
              satisfaction_score: activityInsert?.satisfaction_score ?? 4,
              session_data: activityInsert?.session_data ?? {},
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/modules/breath-constellation');

    const heading = page.getByRole('heading', { name: /Breath Constellation/i });
    await expect(heading).toBeVisible();

    const protocolSelect = page.getByLabel(/Protocole respiratoire/i);
    await expect(protocolSelect).toBeVisible();
    await expect(protocolSelect).toContainText(/Cohérence cardiaque/i);
    await expect(protocolSelect).toContainText(/4-7-8/i);

    await page.getByRole('button', { name: /Démarrer/i }).click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Terminer/i }).click();

    await expect(
      page.getByText(/Session enregistrée dans votre historique Supabase et votre journal d'activité/i)
    ).toBeVisible({ timeout: 10000 });

    expect(breathworkInsert).toBeTruthy();
    expect(breathworkInsert.technique_type).toBe('coherence-5-5');
    expect(breathworkInsert.session_data?.cycles_planned).toBeGreaterThan(0);
    expect(breathworkInsert.session_data?.density).toBeGreaterThan(0);

    expect(activityInsert).toBeTruthy();
    expect(activityInsert.activity_type).toBe('breath_constellation');
    expect(activityInsert.session_data?.technique).toBeDefined();
    expect(activityInsert.session_data?.cycles_completed).toBeGreaterThanOrEqual(0);
  });
});
