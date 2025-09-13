import { test, expect } from "@playwright/test";

test("scores v2 panel charge et affiche des éléments clés", async ({ page }) => {
  await page.goto("/modules/scores");
  await expect(page).toHaveURL(/\/modules\/scores/);
  // Le flag peut être activé pour l'environnement de test, sinon skip si absent
  const refresh = page.locator('[data-ui="refresh"]');
  if (await refresh.count()) {
    await refresh.click();
  }
  // Pas de crash, page visible
  await expect(page.locator("text=Scores")).toBeVisible();
});
