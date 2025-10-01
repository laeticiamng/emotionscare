// @ts-nocheck

import { test, expect } from '@playwright/test';
import { routes } from '@/routerV2';

test.describe('Authentication Flows E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('B2C authentication complete flow', async ({ page }) => {
    // Navigate to B2C login
    await page.click('text=Espace Personnel');
    await expect(page).toHaveURL(routes.auth.b2cLogin());

    // Test registration flow
    await page.click('text=Créer un compte');
    await expect(page).toHaveURL(routes.auth.b2cRegister());

    await page.fill('input[name="email"]', 'test-b2c@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(routes.b2c.dashboard());
    
    // Verify dashboard elements
    await expect(page.locator('h1')).toContainText('Tableau de bord');
    await expect(page.locator('[data-testid="emotion-scan-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="journal-card"]')).toBeVisible();
  });

  test('B2B user authentication flow', async ({ page }) => {
    // Navigate to B2B selection
    await page.click('text=Espace Entreprise');
    await expect(page).toHaveURL(routes.b2b.home());

    // Select user option
    await page.click('text=Collaborateur');
    await expect(page).toHaveURL(routes.auth.b2bUserLogin());

    // Login flow
    await page.fill('input[name="email"]', 'user@company.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(routes.b2b.user.dashboard());
    
    // Verify B2B user specific features
    await expect(page.locator('[data-testid="team-activity"]')).toBeVisible();
    await expect(page.locator('[data-testid="social-cocon"]')).toBeVisible();
  });

  test('B2B admin authentication flow', async ({ page }) => {
    await page.click('text=Espace Entreprise');
    await page.click('text=Administrateur RH');
    await expect(page).toHaveURL(routes.auth.b2bAdminLogin());

    await page.fill('input[name="email"]', 'admin@company.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(routes.b2b.admin.dashboard());
    
    // Verify admin specific features
    await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="team-management"]')).toBeVisible();
    await expect(page.locator('[data-testid="reports-section"]')).toBeVisible();
  });

  test('session persistence across page refreshes', async ({ page }) => {
    // Login as B2C user
    await page.goto(routes.auth.b2cLogin());
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(routes.b2c.dashboard());

    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page).toHaveURL(routes.b2c.dashboard());
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('logout flow', async ({ page }) => {
    // Login first
    await page.goto(routes.auth.b2cLogin());
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Déconnexion');

    // Should redirect to home
    await expect(page).toHaveURL(routes.public.home());
    await expect(page.locator('text=Espace Personnel')).toBeVisible();
  });
});
