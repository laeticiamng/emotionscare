import { test, expect } from "@playwright/test";

test("flash glow ultra smoke", async ({ page }) => {
  await page.goto("/modules/flash-glow-ultra");
  await expect(page).toHaveURL(/\/modules\/flash-glow-ultra/);
  await page.getByRole("button", { name: /Démarrer/i }).click();
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: /Arrêter|Pause/i }).click();
  await expect(page.getByText(/Sécurité anti-flash/i)).toBeVisible();
});
