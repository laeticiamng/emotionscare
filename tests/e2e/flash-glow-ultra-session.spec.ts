import { test, expect } from '@playwright/test';

test.describe('Flash Glow Ultra session', () => {
  test.skip(({ }, testInfo) => testInfo.project.name !== 'b2c-chromium');

  test('completes a session with journaling and Supabase logging', async ({ page }) => {
    let capturedPayload: any = null;

    await page.route('**/functions/v1/flash-glow-metrics**', async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204 });
        return;
      }

      const rawBody = route.request().postData() ?? '{}';
      capturedPayload = JSON.parse(rawBody);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Session Flash Glow enregistrée',
          next_session_in: '4h',
          session_id: 'session-ultra-123',
          activity_session_id: 'activity-ultra-456',
          mood_delta: capturedPayload?.metadata?.moodDelta ?? 12,
          satisfaction_score: 5
        })
      });
    });

    await page.addInitScript(() => {
      try {
        Object.defineProperty(window.navigator, 'vibrate', {
          configurable: true,
          value: () => false
        });
      } catch (error) {
        console.warn('vibrate override failed', error);
      }
    });

    await page.goto('/modules/flash-glow-ultra');

    await expect(page.getByRole('heading', { name: /Flash Glow Ultra/i })).toBeVisible();

    await page.getByRole('button', { name: /Démarrer/i }).click();

    await page.waitForTimeout(1200);

    const moodAfterSlider = page.getByLabel(/Humeur après séance/);
    await moodAfterSlider.evaluate((element, value) => {
      const input = element as unknown as { value: string; dispatchEvent: (event: Event) => void };
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, '82');

    await page.getByRole('button', { name: /Terminer/i }).click();

    await expect(page.getByText(/Session enregistrée automatiquement/)).toBeVisible({ timeout: 10000 });

    expect(capturedPayload).not.toBeNull();
    expect(typeof capturedPayload.duration_s).toBe('number');
    expect(capturedPayload.label).toBeDefined();
    expect(capturedPayload.metadata).toBeDefined();
    expect(capturedPayload.metadata?.moodDelta).toBeGreaterThan(0);
    expect(Array.isArray(capturedPayload.metadata?.stages)).toBe(true);
    expect((capturedPayload.metadata?.stages ?? []).length).toBeGreaterThan(0);

    const entries = await page.evaluate(() => {
      const raw = window.localStorage.getItem('journal_entries');
      return raw ? JSON.parse(raw) : [];
    });

    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]?.summary).toContain('Flash Glow Ultra');
  });
});
