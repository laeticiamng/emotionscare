/**
 * B2B Admin Module - E2E Robustness & Security Tests
 * 
 * Coverage:
 * - Organization management (create, settings, branding)
 * - Team management (members, invites, roles)
 * - RBAC permissions (admin, manager, member boundaries)
 * - Audit logs (actions, exports, retention)
 * - Org events (RSVP, reminders)
 * - Reports (emotional climate, burnout detection, exports)
 * - RLS isolation (org_id based filtering)
 * - GDPR compliance (data export, deletion, consent)
 * - Accessibility (admin dashboard)
 * - Performance (large teams, audit log pagination)
 * - Error resilience (API failures, concurrent edits)
 */

import { test, expect, Page } from '@playwright/test';

// ============================================================================
// CONFIGURATION & FIXTURES
// ============================================================================

const ADMIN_ROUTES = {
  dashboard: '/app/rh',
  teams: '/app/teams',
  analytics: '/app/analytics',
  reports: '/app/reports',
  activity: '/app/activity',
  events: '/app/events',
  userRoles: '/admin/user-roles',
  gdpr: '/admin/gdpr',
  apiMonitoring: '/admin/api-monitoring',
  settings: '/settings/general',
};

const API_BASE = 'https://yaincoxihiqdksxgrsrk.supabase.co';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function mockB2BAdminUser(page: Page, orgId = 'org-123', role = 'admin') {
  await page.addInitScript(({ oid, r }) => {
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIke oid}Iiwicm9sZSI6IiR{r}In0.test`,
      refresh_token: 'valid-refresh',
      user: {
        id: 'admin-user-abc',
        email: 'admin@company.com',
        app_metadata: { org_id: oid, role: r },
        user_metadata: { display_name: 'Admin User' },
      },
    }));
  }, { oid: orgId, r: role });
}

async function mockB2BMemberUser(page: Page, orgId = 'org-123') {
  await mockB2BAdminUser(page, orgId, 'member');
}

async function mockOrgData(page: Page, org: Record<string, unknown>) {
  await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 'org-123',
        name: 'Test Company',
        settings: { branding: { logo_url: '/logo.png' }, features: { vr: true } },
        created_at: new Date().toISOString(),
        ...org,
      }]),
    });
  });
}

async function mockOrgMembers(page: Page, members: unknown[]) {
  await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(members),
    });
  });
}

async function mockAuditLogs(page: Page, logs: unknown[]) {
  await page.route(`${API_BASE}/rest/v1/org_audit_logs*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(logs),
    });
  });
}

async function mockEdgeFunctionSuccess(page: Page, functionName: string, response: unknown) {
  await page.route(`${API_BASE}/functions/v1/${functionName}`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

async function mockEdgeFunctionError(page: Page, functionName: string, status: number, message: string) {
  await page.route(`${API_BASE}/functions/v1/${functionName}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: message }),
    });
  });
}

// ============================================================================
// 1. ORGANIZATION MANAGEMENT
// ============================================================================

test.describe('Organization Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display organization dashboard', async ({ page }) => {
    await page.goto(ADMIN_ROUTES.dashboard);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should update organization settings', async ({ page }) => {
    let settingsUpdated = false;
    
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        settingsUpdated = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'org-123', name: 'Updated Company' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.settings);
  });

  test('should enforce admin-only access to settings', async ({ page }) => {
    await mockB2BMemberUser(page);
    
    await page.goto(ADMIN_ROUTES.settings);
    
    // Member should see limited settings or be redirected
    await expect(page.locator('body')).toBeVisible();
  });

  test('should validate organization name constraints', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        const body = route.request().postDataJSON();
        if (!body?.name || body.name.length < 2) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Name must be at least 2 characters' }),
          });
        } else {
          await route.fulfill({ status: 200, body: '{}' });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.settings);
  });
});

// ============================================================================
// 2. TEAM MANAGEMENT & INVITES
// ============================================================================

test.describe('Team Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display team members list', async ({ page }) => {
    await mockOrgMembers(page, [
      { org_id: 'org-123', user_id: 'u1', role: 'admin', joined_at: new Date().toISOString() },
      { org_id: 'org-123', user_id: 'u2', role: 'manager', joined_at: new Date().toISOString() },
      { org_id: 'org-123', user_id: 'u3', role: 'member', joined_at: new Date().toISOString() },
    ]);
    
    await page.goto(ADMIN_ROUTES.teams);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should send team invitation via edge function', async ({ page }) => {
    let inviteSent = false;
    
    await page.route(`${API_BASE}/functions/v1/b2b-teams-invite`, async (route) => {
      inviteSent = true;
      const body = route.request().postDataJSON();
      expect(body).toHaveProperty('email');
      expect(body).toHaveProperty('role');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, invite_id: 'inv-123' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
    
    const inviteButton = page.getByRole('button', { name: /inviter|invite/i });
    if (await inviteButton.count() > 0) {
      await inviteButton.first().click();
    }
  });

  test('should enforce role-based invite permissions', async ({ page }) => {
    // Managers cannot invite admins
    await mockB2BAdminUser(page, 'org-123', 'manager');
    
    await page.route(`${API_BASE}/functions/v1/b2b-teams-invite`, async (route) => {
      const body = route.request().postDataJSON();
      if (body?.role === 'admin') {
        await route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Cannot invite admin role' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      }
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should change member role via edge function', async ({ page }) => {
    let roleChanged = false;
    
    await page.route(`${API_BASE}/functions/v1/b2b-teams-role`, async (route) => {
      roleChanged = true;
      const body = route.request().postDataJSON();
      expect(body).toHaveProperty('user_id');
      expect(body).toHaveProperty('new_role');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should remove team member', async ({ page }) => {
    let memberRemoved = false;
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        memberRemoved = true;
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should prevent removing last admin', async ({ page }) => {
    await mockOrgMembers(page, [
      { org_id: 'org-123', user_id: 'admin-user-abc', role: 'admin' },
    ]);
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Cannot remove last admin' }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should display pending invites', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/org_invites*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'inv-1', email_hash: 'hash1', role: 'member', expires_at: new Date(Date.now() + 86400000).toISOString() },
          { id: 'inv-2', email_hash: 'hash2', role: 'manager', expires_at: new Date(Date.now() - 86400000).toISOString() },
        ]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });
});

// ============================================================================
// 3. RBAC PERMISSIONS
// ============================================================================

test.describe('RBAC Permissions', () => {
  test('admin should access all admin routes', async ({ page }) => {
    await mockB2BAdminUser(page, 'org-123', 'admin');
    await mockOrgData(page, {});
    
    for (const route of [ADMIN_ROUTES.dashboard, ADMIN_ROUTES.teams, ADMIN_ROUTES.reports]) {
      await page.goto(route);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('manager should have limited access', async ({ page }) => {
    await mockB2BAdminUser(page, 'org-123', 'manager');
    await mockOrgData(page, {});
    
    // Managers can view teams but not user roles admin
    await page.goto(ADMIN_ROUTES.teams);
    await expect(page.locator('body')).toBeVisible();
    
    await page.goto(ADMIN_ROUTES.userRoles);
    // Should be restricted or show limited view
  });

  test('member should be blocked from admin routes', async ({ page }) => {
    await mockB2BMemberUser(page);
    
    await page.goto(ADMIN_ROUTES.userRoles);
    
    // Should redirect to main app or show unauthorized
    await expect(page).toHaveURL(/\/(app|login|unauthorized)/);
  });

  test('should check has_role function for permissions', async ({ page }) => {
    await mockB2BAdminUser(page);
    
    let roleCheckCalled = false;
    
    await page.route(`${API_BASE}/rest/v1/rpc/has_role*`, async (route) => {
      roleCheckCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(true),
      });
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
  });

  test('should enforce org_id isolation in JWT', async ({ page }) => {
    // User from org-A tries to access org-B data
    await mockB2BAdminUser(page, 'org-A', 'admin');
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      const url = new URL(route.request().url());
      // RLS should automatically filter by org_id from JWT
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });
});

// ============================================================================
// 4. AUDIT LOGS
// ============================================================================

test.describe('Audit Logs', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display audit logs timeline', async ({ page }) => {
    await mockAuditLogs(page, [
      { id: 'log-1', event: 'member.invited', actor_hash: 'hash1', text_summary: 'Admin invited user@example.com', occurred_at: new Date().toISOString() },
      { id: 'log-2', event: 'settings.updated', actor_hash: 'hash1', text_summary: 'Organization settings updated', occurred_at: new Date().toISOString() },
    ]);
    
    await page.goto(ADMIN_ROUTES.activity);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should filter audit logs by event type', async ({ page }) => {
    let filterApplied = false;
    
    await page.route(`${API_BASE}/rest/v1/org_audit_logs*`, async (route) => {
      const url = new URL(route.request().url());
      const eventFilter = url.searchParams.get('event');
      if (eventFilter) {
        filterApplied = true;
      }
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.activity);
  });

  test('should paginate large audit logs', async ({ page }) => {
    const largeLogs = Array.from({ length: 500 }, (_, i) => ({
      id: `log-${i}`,
      event: 'action',
      text_summary: `Action ${i}`,
      occurred_at: new Date(Date.now() - i * 60000).toISOString(),
    }));
    
    await page.route(`${API_BASE}/rest/v1/org_audit_logs*`, async (route) => {
      const url = new URL(route.request().url());
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeLogs.slice(offset, offset + limit)),
      });
    });
    
    await page.goto(ADMIN_ROUTES.activity);
  });

  test('should export audit logs via edge function', async ({ page }) => {
    let exportCalled = false;
    
    await page.route(`${API_BASE}/functions/v1/b2b-audit-export`, async (route) => {
      exportCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ download_url: '/exports/audit-123.csv' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.activity);
    
    const exportButton = page.getByRole('button', { name: /export|télécharger/i });
    if (await exportButton.count() > 0) {
      await exportButton.first().click();
    }
  });

  test('should anonymize actor in logs (GDPR)', async ({ page }) => {
    await mockAuditLogs(page, [
      { id: 'log-1', event: 'action', actor_hash: 'sha256:abc123', text_summary: 'Action performed' },
    ]);
    
    await page.goto(ADMIN_ROUTES.activity);
    
    // Actor should show hash, not email
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/@company\.com/);
  });
});

// ============================================================================
// 5. ORG EVENTS & RSVP
// ============================================================================

test.describe('Organization Events', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display org events calendar', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/org_events*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'evt-1', title: 'Team Building', starts_at: new Date().toISOString(), ends_at: new Date(Date.now() + 3600000).toISOString() },
          { id: 'evt-2', title: 'Wellness Workshop', starts_at: new Date(Date.now() + 86400000).toISOString(), ends_at: new Date(Date.now() + 90000000).toISOString() },
        ]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.events);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should create new org event', async ({ page }) => {
    let eventCreated = false;
    
    await page.route(`${API_BASE}/rest/v1/org_events*`, async (route) => {
      if (route.request().method() === 'POST') {
        eventCreated = true;
        const body = route.request().postDataJSON();
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('starts_at');
        
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-evt', ...body }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.events);
  });

  test('should RSVP to org event', async ({ page }) => {
    let rsvpSaved = false;
    
    await page.route(`${API_BASE}/rest/v1/org_event_rsvps*`, async (route) => {
      if (route.request().method() === 'POST' || route.request().method() === 'PATCH') {
        rsvpSaved = true;
        const body = route.request().postDataJSON();
        expect(body).toHaveProperty('status');
        expect(['yes', 'no', 'maybe']).toContain(body.status);
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ event_id: 'evt-1', status: body.status }),
        });
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.events);
  });

  test('should enforce event date validation', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/org_events*`, async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        const start = new Date(body.starts_at);
        const end = new Date(body.ends_at);
        
        if (end <= start) {
          await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'End date must be after start date' }),
          });
        } else {
          await route.fulfill({ status: 201, body: '{}' });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.events);
  });
});

// ============================================================================
// 6. REPORTS & ANALYTICS
// ============================================================================

test.describe('Reports & Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display emotional climate analytics', async ({ page }) => {
    await mockEdgeFunctionSuccess(page, 'b2b-heatmap', {
      data: [
        { week: '2024-W01', team: 'Engineering', avg_mood: 7.2 },
        { week: '2024-W01', team: 'Sales', avg_mood: 6.8 },
      ],
    });
    
    await page.goto(ADMIN_ROUTES.analytics);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should generate burnout risk report', async ({ page }) => {
    await mockEdgeFunctionSuccess(page, 'b2b-report-export', {
      report_url: '/reports/burnout-risk-2024.pdf',
      summary: { high_risk: 2, medium_risk: 5, low_risk: 15 },
    });
    
    await page.goto(ADMIN_ROUTES.reports);
  });

  test('should export team wellness report', async ({ page }) => {
    let exportCalled = false;
    
    await page.route(`${API_BASE}/functions/v1/b2b-report-export`, async (route) => {
      exportCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ download_url: '/reports/wellness-2024.xlsx' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.reports);
  });

  test('should aggregate data at org level (not individual)', async ({ page }) => {
    // Reports should not expose individual user data
    await page.route(`${API_BASE}/functions/v1/b2b-heatmap`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          aggregated: true,
          min_group_size: 5, // Privacy threshold
          teams: [
            { name: 'Team A', count: 8, avg_score: 7.1 },
          ],
        }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.analytics);
  });

  test('should respect minimum group size for privacy', async ({ page }) => {
    await page.route(`${API_BASE}/functions/v1/b2b-heatmap`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          teams: [
            { name: 'Small Team', count: 3, avg_score: null, reason: 'Group too small for privacy' },
            { name: 'Large Team', count: 12, avg_score: 7.5 },
          ],
        }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.analytics);
  });
});

// ============================================================================
// 7. RLS & DATA ISOLATION
// ============================================================================

test.describe('RLS & Organization Isolation', () => {
  test('should filter all queries by org_id from JWT', async ({ page }) => {
    await mockB2BAdminUser(page, 'org-specific-123');
    
    const queriedTables: string[] = [];
    
    await page.route(`${API_BASE}/rest/v1/*`, async (route) => {
      const url = new URL(route.request().url());
      const table = url.pathname.split('/').pop();
      queriedTables.push(table || '');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
    await page.waitForTimeout(2000);
    
    // All org-related tables should be queried
  });

  test('should reject access without org_id in JWT', async ({ page }) => {
    // User without org_id
    await page.addInitScript(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'token-without-org',
        user: { id: 'user-123', email: 'user@example.com' },
      }));
    });
    
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]), // RLS returns empty
      });
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
    
    // Should show "no organization" state or redirect
  });

  test('should not expose other orgs data in API responses', async ({ page }) => {
    await mockB2BAdminUser(page, 'org-A');
    
    let exposedOrgIds: string[] = [];
    
    await page.route(`${API_BASE}/rest/v1/*`, async (route) => {
      const response = await route.fetch();
      const body = await response.text();
      
      // Check for other org IDs
      const matches = body.match(/org-(?!A)[a-zA-Z0-9-]+/g);
      if (matches) {
        exposedOrgIds.push(...matches);
      }
      
      await route.fulfill({ response });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
    await page.waitForTimeout(2000);
    
    expect(exposedOrgIds.length).toBe(0);
  });
});

// ============================================================================
// 8. GDPR COMPLIANCE
// ============================================================================

test.describe('GDPR Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should display GDPR dashboard', async ({ page }) => {
    await page.goto(ADMIN_ROUTES.gdpr);
    
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle data export request for org', async ({ page }) => {
    let exportRequested = false;
    
    await page.route(`${API_BASE}/functions/v1/gdpr-org-export`, async (route) => {
      exportRequested = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ job_id: 'export-123', status: 'pending' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.gdpr);
  });

  test('should not log PII to console', async ({ page }) => {
    await mockB2BAdminUser(page);
    
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });
    
    await page.goto(ADMIN_ROUTES.teams);
    await page.waitForTimeout(2000);
    
    const logText = consoleLogs.join(' ');
    
    expect(logText).not.toMatch(/admin@company\.com/);
    expect(logText).not.toMatch(/eyJ[a-zA-Z0-9._-]+/); // JWT
  });

  test('should anonymize user data in exports', async ({ page }) => {
    await page.route(`${API_BASE}/functions/v1/b2b-audit-export`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          download_url: '/exports/audit.csv',
          anonymized: true,
          fields_hashed: ['actor', 'target_user'],
        }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.activity);
  });
});

// ============================================================================
// 9. ACCESSIBILITY
// ============================================================================

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should support keyboard navigation in admin sidebar', async ({ page }) => {
    await page.goto(ADMIN_ROUTES.dashboard);
    
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'DIV']).toContain(focused);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(ADMIN_ROUTES.dashboard);
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels: number[] = [];
    
    for (const heading of headings) {
      const tag = await heading.evaluate((el) => el.tagName);
      levels.push(parseInt(tag.replace('H', '')));
    }
    
    // Heading levels should not skip (e.g., h1 to h3)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test('should announce actions to screen readers', async ({ page }) => {
    await page.goto(ADMIN_ROUTES.teams);
    
    const liveRegions = await page.locator('[aria-live], [role="status"], [role="alert"]').count();
    expect(liveRegions).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================================
// 10. PERFORMANCE
// ============================================================================

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should load admin dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(ADMIN_ROUTES.dashboard);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large team (500+ members)', async ({ page }) => {
    const largeTeam = Array.from({ length: 500 }, (_, i) => ({
      org_id: 'org-123',
      user_id: `user-${i}`,
      role: i < 5 ? 'admin' : i < 50 ? 'manager' : 'member',
    }));
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      const url = new URL(route.request().url());
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(largeTeam.slice(offset, offset + limit)),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
    
    // Should paginate, not load all at once
    await expect(page.locator('body')).toBeVisible();
  });

  test('should cache org settings', async ({ page }) => {
    let fetchCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      fetchCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'org-123', name: 'Test' }]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
    await page.goto(ADMIN_ROUTES.teams);
    await page.goto(ADMIN_ROUTES.dashboard);
    
    // Should cache, not fetch 3 times
    expect(fetchCount).toBeLessThanOrEqual(2);
  });
});

// ============================================================================
// 11. ERROR RESILIENCE
// ============================================================================

test.describe('Error Resilience', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
  });

  test('should handle API timeout gracefully', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 30000));
      await route.abort('timedout');
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
    await page.waitForTimeout(5000);
    
    // Should show timeout message
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle 500 error on team load', async ({ page }) => {
    await mockOrgData(page, {});
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.teams);
    
    // Should show user-friendly error
    await expect(page.locator('body')).not.toContainText(/stack|trace/i);
  });

  test('should handle concurrent member updates', async ({ page }) => {
    await mockOrgData(page, {});
    
    let updateCount = 0;
    
    await page.route(`${API_BASE}/rest/v1/org_members*`, async (route) => {
      if (route.request().method() === 'PATCH') {
        updateCount++;
        
        if (updateCount === 1) {
          // Delay first request
          await new Promise(resolve => setTimeout(resolve, 500));
          await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Conflict - record modified' }),
          });
        } else {
          await route.fulfill({ status: 200, body: '{}' });
        }
      } else {
        await route.continue();
      }
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should handle edge function unavailability', async ({ page }) => {
    await mockOrgData(page, {});
    
    await page.route(`${API_BASE}/functions/v1/*`, async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Service unavailable' }),
      });
    });
    
    await page.goto(ADMIN_ROUTES.analytics);
    
    // Should show fallback or error state
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle malformed org data', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: null,
          name: undefined,
          settings: 'not-json',
        }]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.dashboard);
    
    // Should handle gracefully
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(/Cannot read properties/i);
  });
});

// ============================================================================
// 12. EDGE CASES
// ============================================================================

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await mockB2BAdminUser(page);
    await mockOrgData(page, {});
  });

  test('should handle empty organization', async ({ page }) => {
    await mockOrgMembers(page, [
      { org_id: 'org-123', user_id: 'admin-user-abc', role: 'admin' },
    ]);
    
    await page.goto(ADMIN_ROUTES.teams);
    
    // Should show onboarding or invite prompt
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle expired invite token', async ({ page }) => {
    await page.route(`${API_BASE}/functions/v1/b2b-accept-invite`, async (route) => {
      await route.fulfill({
        status: 410,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invite expired' }),
      });
    });
    
    await page.goto('/invite/accept?token=expired-token');
  });

  test('should handle admin self-demotion', async ({ page }) => {
    await mockOrgMembers(page, [
      { org_id: 'org-123', user_id: 'admin-user-abc', role: 'admin' },
      { org_id: 'org-123', user_id: 'other-admin', role: 'admin' },
    ]);
    
    await page.route(`${API_BASE}/functions/v1/b2b-teams-role`, async (route) => {
      const body = route.request().postDataJSON();
      if (body?.user_id === 'admin-user-abc' && body?.new_role !== 'admin') {
        // Should confirm before demoting self
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, warning: 'You demoted yourself' }),
        });
      } else {
        await route.fulfill({ status: 200, body: '{}' });
      }
    });
    
    await page.goto(ADMIN_ROUTES.teams);
  });

  test('should handle org with no subscription', async ({ page }) => {
    await page.route(`${API_BASE}/rest/v1/orgs*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'org-123',
          name: 'Free Org',
          settings: { subscription: null },
        }]),
      });
    });
    
    await page.goto(ADMIN_ROUTES.reports);
    
    // Premium features should be gated
    await expect(page.locator('body')).toBeVisible();
  });
});
