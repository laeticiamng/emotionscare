import { test, expect } from '@playwright/test';

test('B2B user ne peut pas accéder au dashboard RH', async ({ page }) => {
  await page.goto('/app/rh');
  await expect(page).toHaveURL(/\/403$/);
  await expect(page.getByText(/Accès non autorisé|403/i)).toBeVisible();
});
