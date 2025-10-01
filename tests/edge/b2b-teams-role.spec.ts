/* @vitest-environment node */
// @ts-nocheck

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  envStore,
  handlerRef,
  resetTestState,
  supabaseDouble,
  type Handler,
} from './b2b-test-utils';

describe('b2b teams role edge function', () => {
  let handler: Handler;

  beforeAll(async () => {
    resetTestState();
    envStore.set('SUPABASE_URL', 'https://supabase.test');
    envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    envStore.set('FF_B2B_SUITE', 'true');
    await import('../../supabase/functions/b2b-teams-role/index.ts');
    handler = handlerRef.current!;
  });

  beforeEach(() => {
    supabaseDouble.reset();
  });

  it('denies role updates when requester is not an admin', async () => {
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-456',
          user_metadata: { org_id: 'org-xyz', org_role: 'manager' },
        },
      },
      error: null,
    });

    const response = await handler(
      new Request('https://edge.local/b2b/teams/role', {
        method: 'POST',
        headers: {
          authorization: 'Bearer token-456',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ user_id: 'member-1', role: 'member' }),
      }),
    );

    expect(response.status).toBe(403);
  });

  it('updates the member role and enforces org scoping for admins', async () => {
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'admin-1',
          user_metadata: { org_id: 'org-xyz', org_role: 'admin' },
        },
      },
      error: null,
    });

    supabaseDouble.queueResponse('select', 'org_members', { data: { org_id: 'org-xyz' }, error: null });
    supabaseDouble.queueResponse('update', 'org_members', { data: { id: 'member-1' }, error: null });

    supabaseDouble.auth.admin.getUserById.mockResolvedValue({ user: { user_metadata: {} } });
    supabaseDouble.auth.admin.updateUserById.mockResolvedValue();

    const response = await handler(
      new Request('https://edge.local/b2b/teams/role', {
        method: 'POST',
        headers: {
          authorization: 'Bearer admin-token',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ user_id: 'member-1', role: 'manager' }),
      }),
    );

    expect(response.status).toBe(200);

    const selectEntry = supabaseDouble.findLastLog('org_members', 'select');
    expect(selectEntry?.filters.map((filter) => filter.args)).toContainEqual(['org_id', 'org-xyz']);
    expect(selectEntry?.filters.map((filter) => filter.args)).toContainEqual(['user_id', 'member-1']);

    const updateEntry = supabaseDouble.findLastLog('org_members', 'update');
    expect(updateEntry?.payload).toEqual({ role: 'manager' });
    expect(updateEntry?.filters.map((filter) => filter.args)).toContainEqual(['org_id', 'org-xyz']);
    expect(updateEntry?.filters.map((filter) => filter.args)).toContainEqual(['user_id', 'member-1']);

    const auditLog = supabaseDouble.findLastLog('org_audit_logs', 'insert');
    expect(auditLog?.payload).toMatchObject({
      org_id: 'org-xyz',
      target: 'user:member-1',
      text_summary: 'Rôle mis à jour vers manager',
    });
  });
});
