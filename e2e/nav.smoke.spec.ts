import { test, expect } from "@playwright/test";

test("navigation de base", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Modules/i }).click();
  await expect(page).toHaveURL(/\/modules$/);
  const firstCta = page.locator('[data-ui="primary-cta"]').first();
  if (await firstCta.count()) await firstCta.click();
});
