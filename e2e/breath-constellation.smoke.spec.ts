import { test, expect } from "@playwright/test";

test("breath constellation smoke", async ({ page }) => {
  await page.goto("/modules/breath-constellation");
  await expect(page).toHaveURL(/\/modules\/breath-constellation/);
  const status = page.locator('main[aria-label="Breath Constellation"]').getByRole("status").first();
  await page.getByRole("button", { name: /Démarrer/i }).click();
  await expect(status).toHaveText(/séance en cours/i);
  await page.getByRole("button", { name: /Pause/i }).click();
  await expect(status).toHaveText(/pause/i);
  await page.getByRole("button", { name: /Reprendre/i }).click();
  await page.getByRole("button", { name: /Terminer/i }).click();
  await expect(status).toHaveText(/séance terminée/i);
});
