import { test, expect } from "@playwright/test";
import routes from "../src/ROUTES.reg";

for (const r of Object.values(routes)) {
  test(`smoke ${r.id}`, async ({ page }) => {
    await page.goto(r.path);
    await expect(page).toHaveURL(new RegExp(r.path.replace("/", "\\/")));
    const cta = page.locator("button, a[role=button]").first();
    if (await cta.count()) await cta.click();
  });
}
