import { test, expect } from "@playwright/test";
// Route list temporarily empty until Next.js App Router migration exposes paths
// automatically. Populate this list with known paths to keep smoke tests.
const routes: { id: string; path: string }[] = [];

for (const r of routes) {
  test(`smoke ${r.id}`, async ({ page }) => {
    await page.goto(r.path);
    await expect(page).toHaveURL(new RegExp(r.path.replace("/", "\\/")));
    const cta = page.locator("button, a[role=button]").first();
    if (await cta.count()) await cta.click();
  });
}
