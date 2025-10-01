// @ts-nocheck

import { test, expect } from '@playwright/test';
import { routes } from '@/routerV2';

test.describe('Admin Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(routes.auth.b2bAdminLogin());
    await page.fill('input[name="email"]', 'admin@company.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(routes.b2b.admin.dashboard());
  });

  test('team management functionality', async ({ page }) => {
    await page.click('[data-testid="teams-tab"]');
    await expect(page).toHaveURL(routes.b2b.teams());

    // Test team creation
    await page.click('[data-testid="create-team-button"]');
    await page.fill('[data-testid="team-name"]', 'Équipe Marketing');
    await page.fill('[data-testid="team-description"]', 'Équipe en charge du marketing digital');
    
    // Add team members
    await page.click('[data-testid="add-member"]');
    await page.selectOption('[data-testid="member-select"]', 'user1@company.com');
    
    await page.click('[data-testid="save-team"]');
    
    // Should appear in teams list
    await expect(page.locator('[data-testid="teams-list"]')).toContainText('Équipe Marketing');
  });

  test('reports and analytics access', async ({ page }) => {
    await page.click('[data-testid="reports-tab"]');
    await expect(page).toHaveURL(routes.b2b.reports());

    // Test report generation
    await page.selectOption('[data-testid="report-type"]', 'emotional-health');
    await page.selectOption('[data-testid="time-period"]', 'last-month');
    
    await page.click('[data-testid="generate-report"]');
    
    // Should show loading then results
    await expect(page.locator('[data-testid="report-loading"]')).toBeVisible();
    await expect(page.locator('[data-testid="report-results"]')).toBeVisible({ timeout: 10000 });
    
    // Test export functionality
    await page.click('[data-testid="export-report"]');
    // File download should trigger
  });

  test('user activity monitoring', async ({ page }) => {
    await page.click('[data-testid="activity-tab"]');
    
    // Should show user activity table
    await expect(page.locator('[data-testid="activity-table"]')).toBeVisible();
    
    // Test filtering
    await page.selectOption('[data-testid="activity-filter"]', 'login');
    await expect(page.locator('[data-testid="activity-rows"]')).toContainText('Connexion');
    
    // Test user detail view
    await page.click('[data-testid="user-detail-link"]');
    await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-stats"]')).toBeVisible();
  });

  test('organization settings management', async ({ page }) => {
    await page.click('[data-testid="settings-tab"]');
    await expect(page).toHaveURL(routes.b2c.settings());

    // Test organization info update
    await page.fill('[data-testid="org-name"]', 'TechCorp Updated');
    await page.fill('[data-testid="org-description"]', 'Leading technology company');
    
    // Test notification settings
    await page.check('[data-testid="email-notifications"]');
    await page.check('[data-testid="weekly-reports"]');
    
    // Save settings
    await page.click('[data-testid="save-settings"]');
    await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
  });

  test('invitation management flow', async ({ page }) => {
    await page.click('[data-testid="invitations-tab"]');
    
    // Send new invitation
    await page.click('[data-testid="send-invitation"]');
    await page.fill('[data-testid="invite-email"]', 'newuser@company.com');
    await page.selectOption('[data-testid="invite-role"]', 'b2b_user');
    
    await page.click('[data-testid="send-invite"]');
    
    // Should appear in pending invitations
    await expect(page.locator('[data-testid="pending-invites"]')).toContainText('newuser@company.com');
    
    // Test resend invitation
    await page.click('[data-testid="resend-invite"]');
    await expect(page.locator('[data-testid="resend-success"]')).toBeVisible();
  });
});
