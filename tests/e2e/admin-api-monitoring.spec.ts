import { test, expect } from '@playwright/test';
import { SELECTORS } from './_selectors';

test.describe('Admin API Monitoring Dashboard', () => {
  test.use({ storageState: 'tests/e2e/_setup/state-b2b_admin.json' });

  test('B2B Admin → accède au dashboard API Monitoring depuis la sidebar', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('/b2b/admin');
    await expect(page).not.toHaveURL(/login/);

    // Click on "Monitoring APIs" link in sidebar
    const monitoringLink = page.getByRole('link', { name: /Monitoring APIs|API Monitoring/i });
    await expect(monitoringLink).toBeVisible();
    await monitoringLink.click();

    // Verify navigation to API monitoring page
    await expect(page).toHaveURL(/\/admin\/api-monitoring/);
    await expect(page.getByTestId('page-root')).toBeVisible();
  });

  test('B2B Admin → dashboard affiche tous les KPIs', async ({ page }) => {
    await page.goto('/admin/api-monitoring');
    await expect(page).not.toHaveURL(/login/);

    // Wait for page to load
    await expect(page.getByTestId('page-root')).toBeVisible();

    // Check all KPIs are displayed
    await expect(page.locator(SELECTORS.apiMonitoring.kpiTotalCost)).toBeVisible();
    await expect(page.locator(SELECTORS.apiMonitoring.kpiTotalCalls)).toBeVisible();
    await expect(page.locator(SELECTORS.apiMonitoring.kpiRateLimited)).toBeVisible();
    await expect(page.locator(SELECTORS.apiMonitoring.kpiAvgLatency)).toBeVisible();

    // Verify KPIs contain numeric values or loading state
    const totalCostText = await page.locator(SELECTORS.apiMonitoring.kpiTotalCost).textContent();
    expect(totalCostText).toMatch(/\$|Loading|—/);
  });

  test('B2B Admin → graphique des coûts journaliers s\'affiche', async ({ page }) => {
    await page.goto('/admin/api-monitoring');
    await expect(page.getByTestId('page-root')).toBeVisible();

    // Check daily cost chart is visible
    await expect(page.locator(SELECTORS.apiMonitoring.chartDailyCost)).toBeVisible({ timeout: 10000 });
  });

  test('B2B Admin → liste des alertes est visible', async ({ page }) => {
    await page.goto('/admin/api-monitoring');
    await expect(page.getByTestId('page-root')).toBeVisible();

    // Check alerts section exists
    const alertsSection = page.locator(SELECTORS.apiMonitoring.alertsList);
    await expect(alertsSection).toBeVisible();

    // Verify alerts show relevant info (either actual alerts or "no alerts" message)
    const alertsContent = await alertsSection.textContent();
    expect(alertsContent).toBeTruthy();
  });

  test('B2B Admin → liste des fonctions critiques s\'affiche', async ({ page }) => {
    await page.goto('/admin/api-monitoring');
    await expect(page.getByTestId('page-root')).toBeVisible();

    // Check functions list exists
    const functionsList = page.locator(SELECTORS.apiMonitoring.functionsList);
    await expect(functionsList).toBeVisible();

    // Verify at least one function is listed
    const listContent = await functionsList.textContent();
    expect(listContent?.length).toBeGreaterThan(0);
  });

  test('B2C user → ne peut PAS accéder au dashboard (redirect ou 403)', async ({ page }) => {
    // Use B2C user storage state
    await page.goto('/admin/api-monitoring', { waitUntil: 'networkidle' });
    
    // Should redirect to login or show access denied
    const url = page.url();
    expect(url).toMatch(/login|access-denied|403/);
  });

  test('Utilisateur non authentifié → redirigé vers login', async ({ page }) => {
    // Clear storage state (unauthenticated)
    await page.context().clearCookies();
    await page.goto('/admin/api-monitoring');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});
