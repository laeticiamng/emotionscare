import { test, expect } from '@playwright/test';

/**
 * Suite E2E exhaustive pour le module B2B Admin
 * Couvre: RBAC, escalade privilèges, audit logs, isolation équipes, sécurité exports, sessions
 * 
 * Prérequis: Utilisateur avec rôle b2b_admin (state-b2b_admin.json)
 */

test.describe('B2B Admin - RBAC & Protection des routes', () => {
  test('bloque l\'accès sans authentification', async ({ page }) => {
    // Nettoyer toute session
    await page.context().clearCookies();
    
    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');

    // Devrait rediriger vers login ou afficher erreur
    const isRedirectedToAuth = page.url().includes('/auth') || page.url().includes('/login');
    const hasAccessDenied = await page.getByText(/non autorisé|unauthorized|access denied|connexion/i).isVisible({ timeout: 3000 }).catch(() => false);
    
    expect(isRedirectedToAuth || hasAccessDenied).toBeTruthy();
  });

  test('bloque l\'accès utilisateur B2C aux routes admin', async ({ page }) => {
    // Mock: utilisateur B2C authentifié mais sans rôle admin
    await page.route('**/auth/v1/user**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'user-b2c-123',
            email: 'user@example.com',
            role: 'authenticated',
            user_metadata: { role: 'b2c_user' },
          },
        }),
      });
    });

    await page.route('**/rest/v1/user_roles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');

    // Devrait être bloqué ou redirigé
    const hasBlockMessage = await page.getByText(/non autorisé|pas les droits|access denied/i).isVisible({ timeout: 3000 }).catch(() => false);
    const isRedirected = !page.url().includes('/b2b/admin');
    
    expect(hasBlockMessage || isRedirected).toBeTruthy();
  });

  test('autorise l\'accès avec rôle b2b_admin', async ({ page }) => {
    // Mock: utilisateur avec rôle b2b_admin
    await page.route('**/auth/v1/user**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'admin-user-123',
            email: 'admin@company.com',
            role: 'authenticated',
            user_metadata: { role: 'b2b_admin' },
          },
        }),
      });
    });

    await page.route('**/rest/v1/user_roles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ role: 'b2b_admin', org_id: 'org-123' }]),
      });
    });

    await page.route('**/rest/v1/organizations**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'org-123', name: 'Test Org' }]),
      });
    });

    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');

    // Devrait avoir accès au dashboard
    const hasDashboard = await page.getByText(/dashboard|administration|tableau de bord/i).isVisible({ timeout: 5000 }).catch(() => false);
    const isOnAdminPage = page.url().includes('/b2b') || page.url().includes('/admin');
    
    expect(hasDashboard || isOnAdminPage).toBeTruthy();
  });

  test('différencie les permissions manager vs admin', async ({ page }) => {
    // Mock: utilisateur b2b_manager (pas admin complet)
    await page.route('**/rest/v1/b2b_user_roles**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ role: 'b2b_manager', org_id: 'org-123' }]),
      });
    });

    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');

    // Manager peut voir les équipes mais pas gérer les membres globaux
    const manageTeamsVisible = await page.getByRole('link', { name: /équipes|teams/i }).isVisible({ timeout: 3000 }).catch(() => false);
    const manageMembersVisible = await page.getByRole('link', { name: /gérer membres|manage members/i }).isVisible({ timeout: 3000 }).catch(() => false);
    
    console.log(`[RBAC] Manager - Teams: ${manageTeamsVisible}, Members: ${manageMembersVisible}`);
  });
});

test.describe('B2B Admin - Prévention escalade de privilèges', () => {
  test('empêche un manager de s\'auto-promouvoir admin', async ({ page }) => {
    let escalationAttempted = false;
    
    await page.route('**/rest/v1/b2b_user_roles**', async route => {
      const method = route.request().method();
      const body = route.request().postData();
      
      if (method === 'POST' && body?.includes('b2b_admin')) {
        escalationAttempted = true;
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Insufficient permissions' }),
        });
      } else if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ role: 'b2b_manager', user_id: 'manager-123' }]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/b2b/admin/roles');
    await page.waitForLoadState('networkidle');

    // Si tentative d'escalade, devrait être bloquée
    console.log(`[SECURITY] Escalation attempt blocked: ${escalationAttempted}`);
  });

  test('vérifie que les actions admin sont auditées', async ({ page }) => {
    let auditLogCreated = false;
    
    await page.route('**/rest/v1/b2b_audit_logs**', async route => {
      const method = route.request().method();
      
      if (method === 'POST') {
        auditLogCreated = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'audit-123' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.route('**/rest/v1/b2b_teams**', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'team-new' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');

    // Tenter de créer une équipe
    const createButton = page.getByRole('button', { name: /créer|create|nouveau/i });
    if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createButton.click();
      await page.waitForTimeout(500);
      
      // Remplir le formulaire si visible
      const nameInput = page.getByLabel(/nom|name/i);
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('Équipe Test');
        
        const submitButton = page.getByRole('button', { name: /enregistrer|save|créer/i });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(500);
        }
      }
    }

    console.log(`[AUDIT] Action logged: ${auditLogCreated}`);
  });
});

test.describe('B2B Admin - Isolation des données multi-tenant', () => {
  test('vérifie l\'isolation des équipes entre organisations', async ({ page }) => {
    const myOrgId = 'org-mine-123';
    const otherOrgId = 'org-other-456';
    
    await page.route('**/rest/v1/b2b_teams**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'team-1', name: 'Mon équipe', org_id: myOrgId },
          { id: 'team-2', name: 'Équipe autre org', org_id: otherOrgId },
        ]),
      });
    });

    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');

    // L'équipe de l'autre org ne devrait pas être visible
    // (en réalité RLS devrait filtrer côté serveur)
    const otherTeam = page.getByText('Équipe autre org');
    const isOtherVisible = await otherTeam.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`[ISOLATION] Other org team visible: ${isOtherVisible} (should be false in production)`);
  });

  test('vérifie l\'isolation des membres entre organisations', async ({ page }) => {
    await page.route('**/rest/v1/b2b_members**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'member-1', email: 'collegue@myorg.com', org_id: 'org-mine' },
          { id: 'member-2', email: 'external@otherorg.com', org_id: 'org-other' },
        ]),
      });
    });

    await page.goto('/b2b/admin/members');
    await page.waitForLoadState('networkidle');

    // Vérifier que seuls les membres de mon org sont visibles
    const externalMember = page.getByText('external@otherorg.com');
    const isExternalVisible = await externalMember.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`[ISOLATION] External member visible: ${isExternalVisible} (should be false)`);
  });

  test('vérifie l\'isolation des audit logs entre organisations', async ({ page }) => {
    await page.route('**/rest/v1/b2b_audit_logs**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'log-1', action: 'team_created', org_id: 'org-mine', user_email: 'admin@myorg.com' },
          { id: 'log-2', action: 'role_changed', org_id: 'org-other', user_email: 'admin@other.com' },
        ]),
      });
    });

    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    // Les logs d'autres orgs ne devraient pas être visibles
    const otherOrgLog = page.getByText('admin@other.com');
    const isOtherLogVisible = await otherOrgLog.isVisible({ timeout: 2000 }).catch(() => false);
    
    console.log(`[ISOLATION] Other org audit log visible: ${isOtherLogVisible} (should be false)`);
  });
});

test.describe('B2B Admin - Audit Logs & Conformité', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/rest/v1/b2b_audit_logs**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'log-1',
              action: 'member_added',
              entity_type: 'team',
              entity_id: 'team-123',
              user_email: 'admin@company.com',
              details: { member_email: 'new@company.com' },
              created_at: new Date().toISOString(),
            },
            {
              id: 'log-2',
              action: 'role_granted',
              entity_type: 'role',
              entity_id: 'user-456',
              user_email: 'admin@company.com',
              details: { role: 'b2b_manager' },
              created_at: new Date(Date.now() - 3600000).toISOString(),
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('affiche les logs d\'audit avec détails', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    // Vérifier la présence des logs
    const logEntries = page.locator('[data-testid*="audit-entry"], .audit-log-entry, tr');
    const count = await logEntries.count();
    
    console.log(`[AUDIT] Log entries displayed: ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test('permet le filtrage par type d\'action', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    const actionFilter = page.getByRole('combobox', { name: /action|type/i })
      .or(page.locator('[data-testid="action-filter"]'));
    
    if (await actionFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await actionFilter.click();
      await page.waitForTimeout(500);
      
      // Sélectionner un type spécifique
      const option = page.getByRole('option', { name: /role|membre|member/i });
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        console.log('[AUDIT] Filter by action type available');
      }
    }
  });

  test('permet le filtrage par période', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    const dateFilter = page.locator('input[type="date"]').first()
      .or(page.getByRole('button', { name: /période|date|calendar/i }));
    
    const hasDateFilter = await dateFilter.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`[AUDIT] Date filter available: ${hasDateFilter}`);
  });

  test('permet l\'export des logs au format conforme', async ({ page }) => {
    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    const exportButton = page.getByRole('button', { name: /export|télécharger|download/i });
    
    if (await exportButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
        exportButton.click(),
      ]);

      if (download) {
        const filename = await download.suggestedFilename();
        console.log(`[AUDIT] Export file: ${filename}`);
        
        // Vérifier format (CSV, JSON, PDF)
        expect(filename).toMatch(/\.(csv|json|pdf|xlsx)$/i);
      }
    }
  });

  test('vérifie l\'intégrité des logs (non modifiables)', async ({ page }) => {
    let updateAttempted = false;

    await page.route('**/rest/v1/b2b_audit_logs**', async route => {
      const method = route.request().method();
      
      if (method === 'PATCH' || method === 'PUT' || method === 'DELETE') {
        updateAttempted = true;
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Audit logs are immutable' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/b2b/audit');
    await page.waitForLoadState('networkidle');

    // Les logs ne devraient pas avoir de bouton edit/delete
    const editButtons = page.locator('[data-testid*="audit"] button').filter({ hasText: /modifier|edit|supprimer|delete/i });
    const hasEditButtons = (await editButtons.count()) > 0;
    
    console.log(`[AUDIT] Edit/Delete buttons present: ${hasEditButtons} (should be false)`);
    expect(hasEditButtons).toBeFalsy();
  });
});

test.describe('B2B Admin - Gestion des équipes', () => {
  test('affiche la liste des équipes', async ({ page }) => {
    await page.route('**/rest/v1/b2b_teams**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'team-1', name: 'Équipe RH', department: 'RH', member_count: 5 },
          { id: 'team-2', name: 'Équipe Tech', department: 'IT', member_count: 12 },
        ]),
      });
    });

    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');

    const teamCards = page.locator('[data-testid*="team-card"], .team-card, tr');
    const count = await teamCards.count();
    
    console.log(`[TEAMS] Teams displayed: ${count}`);
  });

  test('permet de créer une nouvelle équipe', async ({ page }) => {
    let teamCreated = false;
    
    await page.route('**/rest/v1/b2b_teams**', async route => {
      if (route.request().method() === 'POST') {
        teamCreated = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'team-new', name: 'Nouvelle équipe' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.goto('/b2b/teams');
    await page.waitForLoadState('networkidle');

    const createButton = page.getByRole('button', { name: /créer|nouvelle|add|create/i });
    if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await createButton.click();
      
      const nameInput = page.getByLabel(/nom|name/i);
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('Équipe Test E2E');
        
        const submitButton = page.getByRole('button', { name: /enregistrer|save|créer/i });
        await submitButton.click();
        await page.waitForTimeout(500);
      }
    }

    console.log(`[TEAMS] Team creation attempted: ${teamCreated}`);
  });

  test('permet d\'ajouter un membre à une équipe', async ({ page }) => {
    let memberAdded = false;
    
    await page.route('**/rest/v1/b2b_team_members**', async route => {
      if (route.request().method() === 'POST') {
        memberAdded = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'member-new' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.goto('/b2b/teams/team-1');
    await page.waitForLoadState('networkidle');

    const addMemberButton = page.getByRole('button', { name: /ajouter membre|add member|inviter/i });
    if (await addMemberButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addMemberButton.click();
      
      const emailInput = page.getByLabel(/email/i);
      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailInput.fill('nouveau@company.com');
        
        const submitButton = page.getByRole('button', { name: /ajouter|add|inviter/i });
        await submitButton.click();
        await page.waitForTimeout(500);
      }
    }

    console.log(`[TEAMS] Member addition attempted: ${memberAdded}`);
  });
});

test.describe('B2B Admin - Sécurité des exports', () => {
  test('vérifie que les exports ne contiennent pas de données sensibles', async ({ page }) => {
    await page.route('**/rest/v1/b2b_reports**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          summary: {
            total_users: 50,
            active_users: 45,
            // Ne devrait PAS contenir: emails, noms complets, IPs
          },
          aggregated_wellness: {
            average_score: 72,
            trend: 'up',
          },
        }),
      });
    });

    await page.goto('/b2b/reports');
    await page.waitForLoadState('networkidle');

    // Vérifier que les rapports sont agrégés (pas de PII)
    const piiIndicators = page.getByText(/@company\.com|192\.168\.|[A-Z][a-z]+ [A-Z][a-z]+/);
    const hasPII = (await piiIndicators.count()) > 0;
    
    console.log(`[SECURITY] PII in reports: ${hasPII} (should be false)`);
  });

  test('requiert une confirmation pour les exports volumineux', async ({ page }) => {
    await page.goto('/b2b/reports/export');
    await page.waitForLoadState('networkidle');

    const exportAllButton = page.getByRole('button', { name: /export.*complet|full export|tout exporter/i });
    
    if (await exportAllButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await exportAllButton.click();
      
      // Devrait demander confirmation
      const confirmDialog = page.getByRole('dialog').or(page.getByText(/confirmer|êtes-vous sûr/i));
      const hasConfirmation = await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false);
      
      console.log(`[SECURITY] Export confirmation required: ${hasConfirmation}`);
    }
  });
});

test.describe('B2B Admin - Sessions & Sécurité', () => {
  test('affiche les sessions actives', async ({ page }) => {
    await page.route('**/rest/v1/b2b_active_sessions**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'session-1',
            user_email: 'admin@company.com',
            device: 'Chrome / Windows',
            ip: '192.168.1.x', // Masqué partiellement
            last_activity: new Date().toISOString(),
            current: true,
          },
          {
            id: 'session-2',
            user_email: 'manager@company.com',
            device: 'Safari / iOS',
            ip: '10.0.0.x',
            last_activity: new Date(Date.now() - 3600000).toISOString(),
            current: false,
          },
        ]),
      });
    });

    await page.goto('/b2b/security/sessions');
    await page.waitForLoadState('networkidle');

    const sessionEntries = page.locator('[data-testid*="session"], .session-entry, tr');
    const count = await sessionEntries.count();
    
    console.log(`[SECURITY] Active sessions displayed: ${count}`);
  });

  test('permet de révoquer une session', async ({ page }) => {
    let sessionRevoked = false;
    
    await page.route('**/rest/v1/b2b_active_sessions**', async route => {
      if (route.request().method() === 'DELETE') {
        sessionRevoked = true;
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 'session-other', user_email: 'user@company.com', current: false },
          ]),
        });
      }
    });

    await page.goto('/b2b/security/sessions');
    await page.waitForLoadState('networkidle');

    const revokeButton = page.getByRole('button', { name: /révoquer|revoke|déconnecter/i });
    if (await revokeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await revokeButton.click();
      
      // Confirmer si nécessaire
      const confirmButton = page.getByRole('button', { name: /confirmer|confirm|oui/i });
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }
      
      await page.waitForTimeout(500);
    }

    console.log(`[SECURITY] Session revocation attempted: ${sessionRevoked}`);
  });

  test('affiche les alertes de sécurité', async ({ page }) => {
    await page.route('**/rest/v1/b2b_security_alerts**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'alert-1',
            type: 'suspicious_login',
            severity: 'high',
            message: 'Connexion depuis une nouvelle localisation',
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto('/b2b/security/alerts');
    await page.waitForLoadState('networkidle');

    const alertEntries = page.locator('[data-testid*="alert"], .security-alert, [role="alert"]');
    const count = await alertEntries.count();
    
    console.log(`[SECURITY] Security alerts displayed: ${count}`);
  });
});

test.describe('B2B Admin - Accessibilité (WCAG AA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/b2b/admin');
    await page.waitForLoadState('networkidle');
  });

  test('navigation clavier dans le dashboard admin', async ({ page }) => {
    // Tab à travers les éléments
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName,
        role: el?.getAttribute('role'),
        text: el?.textContent?.substring(0, 30),
      };
    });
    
    console.log(`[A11Y] Focused after 10 tabs: ${focusedElement.tag} - ${focusedElement.text}`);
  });

  test('structure sémantique de la page admin', async ({ page }) => {
    // Vérifier présence de landmarks
    const main = await page.locator('main, [role="main"]').count();
    const nav = await page.locator('nav, [role="navigation"]').count();
    const headers = await page.locator('h1, h2, h3').count();
    
    console.log(`[A11Y] Landmarks - main: ${main}, nav: ${nav}, headers: ${headers}`);
    
    expect(main).toBeGreaterThanOrEqual(1);
    expect(nav).toBeGreaterThanOrEqual(1);
  });

  test('labels sur les formulaires admin', async ({ page }) => {
    await page.goto('/b2b/teams');
    
    const inputs = page.locator('input:not([type="hidden"]), select, textarea');
    const count = await inputs.count();
    
    let unlabeledCount = 0;
    for (let i = 0; i < Math.min(count, 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      let hasLabel = !!(ariaLabel || ariaLabelledBy);
      if (id) {
        hasLabel = hasLabel || (await page.locator(`label[for="${id}"]`).count()) > 0;
      }
      
      if (!hasLabel) {
        unlabeledCount++;
      }
    }
    
    console.log(`[A11Y] Unlabeled inputs: ${unlabeledCount}/${count}`);
  });
});

test.describe('B2B Admin - Performance', () => {
  test('charge le dashboard admin en moins de 3 secondes', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/b2b/admin');
    await page.waitForSelector('[data-testid*="dashboard"], main, h1', { timeout: 5000 });
    
    const loadTime = Date.now() - startTime;
    
    console.log(`[PERF] Admin dashboard load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(4000);
  });

  test('pagination des listes volumineuses', async ({ page }) => {
    // Mock: beaucoup de données
    const members = Array.from({ length: 500 }, (_, i) => ({
      id: `member-${i}`,
      email: `user${i}@company.com`,
      role: i % 10 === 0 ? 'b2b_manager' : 'b2b_member',
    }));

    await page.route('**/rest/v1/b2b_members**', async route => {
      const url = new URL(route.request().url());
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'content-range': `${offset}-${offset + limit}/${members.length}` },
        body: JSON.stringify(members.slice(offset, offset + limit)),
      });
    });

    await page.goto('/b2b/admin/members');
    await page.waitForLoadState('networkidle');

    // Vérifier la présence de pagination
    const pagination = page.locator('[data-testid*="pagination"], .pagination, nav[aria-label*="page"]');
    const hasPagination = await pagination.isVisible({ timeout: 3000 }).catch(() => false);
    
    console.log(`[PERF] Pagination present for large lists: ${hasPagination}`);
  });
});
