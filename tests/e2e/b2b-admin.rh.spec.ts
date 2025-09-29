import { test, expect } from '@playwright/test';

test('B2B admin → RH dashboard charge et affiche un contenu', async ({ page }) => {
  await page.goto('/app/rh');
  await expect(page.getByTestId('page-root')).toBeVisible();
  await expect(page.getByText(/Heatmap|Rapports|Actions RH/i)).toBeVisible();
});
