import { test, expect } from "@playwright/test";

test("boss grit smoke", async ({ page }) => {
  await page.goto("/modules/boss-grit");
  await expect(page).toHaveURL(/\/modules\/boss-grit/);
  await page.getByRole("button", { name: /Démarrer/i }).click();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: /Pause/i }).click();
  await page.getByRole("button", { name: /Reset/i }).click();
  await expect(page.getByText(/Checklist/)).toBeVisible();
});
