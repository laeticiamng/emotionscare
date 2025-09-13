import { test, expect } from "@playwright/test";

test("onboarding smoke", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page).toHaveURL(/\/onboarding/);
  await page.locator('[data-ui="primary-cta"]').click();
  await page.getByRole("button", { name: /Suivant/i }).click();
  await page.getByRole("button", { name: /Terminer/i }).click();
});
