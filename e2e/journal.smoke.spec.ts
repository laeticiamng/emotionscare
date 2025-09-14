import { test, expect } from "@playwright/test";

test("journal smoke", async ({ page }) => {
  await page.goto("/modules/journal");
  await expect(page).toHaveURL(/\/modules\/journal/);
  await page.fill("textarea", "Petit test de journal avec #focus et #gratitude");
  await page.fill('input[type="text"]', "focus, gratitude");
  await page.getByRole("button", { name: /Ajouter/i }).click();
  await expect(page.getByText(/Petit test de journal/)).toBeVisible();
  await page.getByRole("searchbox").fill("gratitude");
  await expect(page.getByText(/gratitude/)).toBeVisible();
});
