import { test, expect } from "@playwright/test";

test("story synth smoke", async ({ page }) => {
  await page.goto("/modules/story-synth");
  await expect(page).toHaveURL(/\/modules\/story-synth/);
  await page.getByRole("button", { name: /Générer/i }).click();
  await expect(page.locator("article p").first()).toBeVisible();
  await page.getByRole("button", { name: /Exporter/i }).click(); // toléré même si sandbox
});
