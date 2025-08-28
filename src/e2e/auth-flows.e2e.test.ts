
import { test, expect } from '@playwright/test';
import { Routes } from '@/routerV2';

test.describe('Authentication Flows E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('B2C authentication complete flow', async ({ page }) => {
    // Navigate to B2C login
    await page.click('text=Espace Personnel');
    await expect(page).toHaveURL(Routes.login({ segment: 'b2c' }));

    // Test registration flow
    await page.click('text=Créer un compte');
    await expect(page).toHaveURL(Routes.signup({ segment: 'b2c' }));

    await page.fill('input[name="email"]', 'test-b2c@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(Routes.consumerHome());
    
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Tableau de bord');
    await expect(page.locator('[data-testid="emotion-scan-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="journal-card"]')).toBeVisible();
  });

  test('B2B user authentication flow', async ({ page }) => {
    // Navigate to B2B selection
    await page.click('text=Espace Entreprise');
    await expect(page).toHaveURL(Routes.b2bLanding());

    // Select user option
    await page.click('text=Collaborateur');
    await expect(page).toHaveURL(Routes.login({ segment: 'b2b' }));

    // Login flow
    await page.fill('input[name="email"]', 'user@company.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(Routes.employeeHome());
    
    // Verify B2B user specific features
    await expect(page.locator('[data-testid="team-activity"]')).toBeVisible();
    await expect(page.locator('[data-testid="social-cocon"]')).toBeVisible();
  });

  test('B2B admin authentication flow', async ({ page }) => {
    await page.click('text=Espace Entreprise');
    await page.click('text=Administrateur RH');
    await expect(page).toHaveURL(Routes.login({ segment: 'b2b' }));

    await page.fill('input[name="email"]', 'admin@company.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(Routes.managerHome());
    
    // Verify admin specific features
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="team-management"]')).toBeVisible();
    await expect(page.locator('[data-testid="reports-section"]')).toBeVisible();
  });

  test('session persistence across page refreshes', async ({ page }) => {
    // Login as B2C user
    await page.goto(Routes.login({ segment: 'b2c' }));
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(Routes.consumerHome());

    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page).toHaveURL(Routes.consumerHome());
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('logout flow', async ({ page }) => {
    // Login first
    await page.goto(Routes.login({ segment: 'b2c' }));
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');

    // Should redirect to home
    await expect(page).toHaveURL(Routes.home());
    await expect(page.locator('text=Espace Personnel')).toBeVisible();
  });
});
