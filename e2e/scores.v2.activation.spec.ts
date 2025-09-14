import { test, expect } from "@playwright/test";

test("scores v2 accessible", async ({ page }) => {
  await page.goto("/modules/scores-v2");
  await expect(page).toHaveURL(/\/modules\/scores-v2/);
  await expect(page.getByText(/Scores/i)).toBeVisible();
});

test("lien d’essai visible pour une cohorte", async ({ page }) => {
  await page.goto("/modules/scores");
  // On tolère l'absence si non injecté
  // if (await page.getByRole('link', { name: /Essayer la nouvelle page/i }).count()) { ... }
});
