import { test, expect } from "@playwright/test";

test("emotion scan smoke", async ({ page }) => {
  await page.goto("/modules/emotion-scan");
  await expect(page).toHaveURL(/\/modules\/emotion-scan/);

  // Remplir 3-4 lignes au hasard (on coche la valeur 4)
  await page.locator('input[name="active"][id="active-4"]').check();
  await page.locator('input[name="determined"][id="determined-4"]').check();
  await page.locator('input[name="upset"][id="upset-2"]').check();
  await page.locator('input[name="nervous"][id="nervous-2"]').check();

  // Soumettre (toléré même si pas 10/10 remplis)
  await page.locator('[data-ui="primary-cta"]').click();
  await expect(page.getByText(/Résultat/)).toBeVisible();
});
