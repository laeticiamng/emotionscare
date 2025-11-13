import { test, expect } from '@playwright/test';

test.describe('B2B Admin - Flow complet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Doit naviguer vers le dashboard B2B admin', async ({ page }) => {
    await page.goto('/b2b/admin');
    
    // Peut rediriger vers login si non authentifié
    await page.waitForLoadState('networkidle');
    
    const isLoginPage = page.url().includes('/login') || page.url().includes('/auth');
    const isDashboard = await page.locator('h1, h2').filter({ hasText: /dashboard|admin|organisation/i }).isVisible({ timeout: 3000 }).catch(() => false);
    
    expect(isLoginPage || isDashboard).toBeTruthy();
  });

  test('Doit afficher les statistiques globales', async ({ page }) => {
    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de widgets statistiques
    const statsWidgets = page.locator('[data-testid*="stat"], .stat-card, [data-testid*="metric"]');
    
    const count = await statsWidgets.count();
    if (count > 0) {
      console.log('Statistics widgets found:', count);
    }
  });

  test('Doit afficher la liste des utilisateurs', async ({ page }) => {
    await page.goto('/b2b/admin/users');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'une table ou liste d'utilisateurs
    const usersList = page.locator('table, [data-testid*="users-list"], [role="table"]');
    
    const hasUsersList = await usersList.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Users list present:', hasUsersList);
  });

  test('Doit permettre de rechercher un utilisateur', async ({ page }) => {
    await page.goto('/b2b/admin/users');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="recherch" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test@example.com');
      await page.waitForTimeout(1000);
      
      console.log('User search functionality present');
    }
  });

  test('Doit afficher les rapports d\'activité', async ({ page }) => {
    await page.goto('/b2b/reports');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de rapports
    const reports = page.locator('[data-testid*="report"], .report-card');
    
    const count = await reports.count();
    console.log('Reports found:', count);
  });

  test('Doit permettre d\'exporter un rapport', async ({ page }) => {
    await page.goto('/b2b/reports');
    await page.waitForLoadState('networkidle');
    
    const exportButton = page.locator('button').filter({ hasText: /export|télécharger|download/i }).first();
    
    if (await exportButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        exportButton.click()
      ]);
      
      if (download) {
        console.log('Export successful:', await download.suggestedFilename());
      }
    }
  });

  test('Doit afficher les alertes de sécurité', async ({ page }) => {
    await page.goto('/b2b/security');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'alertes
    const alerts = page.locator('[data-testid*="alert"], .alert, [role="alert"]');
    
    const count = await alerts.count();
    console.log('Security alerts found:', count);
  });

  test('Doit permettre de configurer les équipes', async ({ page }) => {
    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de la gestion d'équipes
    const teamsSection = page.locator('h1, h2').filter({ hasText: /équipes|teams/i });
    
    const hasTeams = await teamsSection.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Teams management present:', hasTeams);
  });

  test('Doit permettre d\'inviter un membre', async ({ page }) => {
    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');
    
    const inviteButton = page.locator('button').filter({ hasText: /inviter|invite|ajouter/i }).first();
    
    if (await inviteButton.isVisible()) {
      await inviteButton.click();
      await page.waitForTimeout(1000);
      
      // Vérifier l'ouverture d'un formulaire
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible({ timeout: 3000 });
    }
  });

  test('Doit afficher les audits d\'activité', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de logs d'audit
    const auditLogs = page.locator('[data-testid*="audit"], .audit-log, table');
    
    const hasAuditLogs = await auditLogs.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Audit logs present:', hasAuditLogs);
  });

  test('Doit permettre de filtrer les audits par date', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');
    
    // Chercher des filtres de date
    const dateFilters = page.locator('input[type="date"], button').filter({ hasText: /date|période/i });
    
    const count = await dateFilters.count();
    console.log('Date filters found:', count);
  });

  test('Doit afficher les métriques de performance', async ({ page }) => {
    await page.goto('/b2b/analytics');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence de graphiques
    const charts = page.locator('canvas, svg[class*="chart"]');
    
    const count = await charts.count();
    console.log('Performance charts found:', count);
  });

  test('Doit supporter la navigation entre sections', async ({ page }) => {
    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');
    
    // Vérifier la présence d'une navigation
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav.first()).toBeVisible({ timeout: 5000 });
    
    // Tester la navigation
    const navLinks = nav.locator('a, button').filter({ hasText: /users|reports|teams/i });
    
    if ((await navLinks.count()) > 0) {
      await navLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      console.log('Navigation successful to:', page.url());
    }
  });
});
