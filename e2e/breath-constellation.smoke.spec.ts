import { test, expect } from "@playwright/test";

test("breath constellation smoke", async ({ page }) => {
  await page.goto("/modules/breath-constellation");
  await expect(page).toHaveURL(/\/modules\/breath-constellation/);
  await page.getByRole("button", { name: /Démarrer/i }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /Pause/i }).click();
  await expect(page.getByText(/Cycle/i)).toBeVisible();
});
