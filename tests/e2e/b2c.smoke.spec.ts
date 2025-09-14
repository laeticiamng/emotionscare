import { test, expect } from '@playwright/test';

test('B2C → dashboard puis 2 modules clés', async ({ page }) => {
  await page.goto('/app/home');
  await expect(page.getByTestId('page-root')).toBeVisible();

  await page.getByRole('link', { name: /Scan Émotionnel/i }).click();
  await expect(page).toHaveURL(/\/app\/scan/);
  await expect(page.getByText(/On prépare le cocon/i)).toBeVisible();

  await page.getByRole('link', { name: /Journal/i }).click();
  await expect(page).toHaveURL(/\/app\/journal/);
  await page.getByTestId('journal-input').fill('Note de test E2E');
  await page.getByRole('button', { name: /Garder|Enregistrer/i }).click();
  await expect(page.getByText(/Bien reçu|Entrée enregistrée/i)).toBeVisible();
});
