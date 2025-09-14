import { test, expect } from "@playwright/test";

test("coach smoke", async ({ page }) => {
  await page.goto("/modules/coach");
  await expect(page).toHaveURL(/\/modules\/coach/);
  const cta = page.locator('[data-ui="primary-cta"]').first();
  if (await cta.count()) await cta.click();
  await expect(page).toHaveTitle(/./);
});
