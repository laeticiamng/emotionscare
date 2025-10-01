// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('FlashGlow session flow', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('start → pause → resume → complete with Supabase logging', async ({ page }) => {
    const consoleMessages: string[] = [];
    const captured: { activity: any; journal: any } = { activity: null, journal: null };

    page.on('console', (message) => {
      if (message.type() === 'warning' || message.type() === 'error') {
        consoleMessages.push(`${message.type()}: ${message.text()}`);
      }
    });

    await page.route('**/auth/v1/user**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ user: { id: 'user-flash' } }),
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
        captured.activity = JSON.parse(rawBody);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'activity-flash-1',
              user_id: 'user-flash',
              activity_type: captured.activity?.activity_type ?? 'flash_glow',
              duration_seconds: captured.activity?.duration_seconds ?? 120,
              session_data: captured.activity?.session_data ?? {},
              mood_before: captured.activity?.mood_before ?? null,
              mood_after: captured.activity?.mood_after ?? null,
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
        const rawBody = request.postData() ?? '{}';
        captured.journal = JSON.parse(rawBody);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'journal-flash-1',
              user_id: 'user-flash',
              content: captured.journal?.content ?? 'FlashGlow terminé. Respiration plus douce.',
              created_at: new Date().toISOString(),
              emotion_analysis: captured.journal?.emotion_analysis ?? {},
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('/app/flash-glow');

    const primaryButton = page.getByRole('button', { name: /Commencer la séance/i });
    await expect(primaryButton).toBeVisible();

    await primaryButton.click();
    await page.waitForTimeout(1100);

    const pauseButton = page.getByRole('button', { name: /Mettre en pause/i });
    await pauseButton.click();
    await page.waitForTimeout(300);

    const resumeButton = page.getByRole('button', { name: /Reprendre/i });
    await resumeButton.click();
    await page.waitForTimeout(600);

    await page.getByRole('button', { name: /Terminer en douceur/i }).click();

    await expect(
      page.getByText(/Séance enregistrée et ajoutée à votre journal/i)
    ).toBeVisible({ timeout: 10_000 });

    expect(captured.activity).not.toBeNull();
    expect(captured.activity.activity_type).toBe('flash_glow');
    expect(typeof captured.activity.duration_seconds).toBe('number');
    expect(captured.activity.session_data?.mood_delta ?? null).not.toBeUndefined();

    expect(captured.journal).not.toBeNull();
    expect(captured.journal.content).toContain('FlashGlow');
    expect(captured.journal.emotion_analysis?.mood_delta ?? null).not.toBeUndefined();

    expect(consoleMessages).toHaveLength(0);
  });
});

