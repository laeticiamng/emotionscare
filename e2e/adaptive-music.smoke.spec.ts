import { test, expect } from "@playwright/test";

test("adaptive music smoke", async ({ page }) => {
  await page.goto("/modules/adaptive-music");
  await expect(page).toHaveURL(/\/modules\/adaptive-music/);
  await page.locator('[data-ui="primary-cta"]').click();
  // Pas d'assertion audio, juste pas de crash
});
