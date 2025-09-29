/* @vitest-environment node */

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  envStore,
  handlerRef,
  resetTestState,
  supabaseDouble,
  type Handler,
} from './b2b-test-utils';

describe('b2b audit export edge function', () => {
  let handler: Handler;

  beforeAll(async () => {
    resetTestState();
    envStore.set('SUPABASE_URL', 'https://supabase.test');
    envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    envStore.set('FF_B2B_SUITE', 'true');
    envStore.set('B2B_AUDIT_BUCKET', 'test-bucket');
    await import('../../supabase/functions/b2b-audit-export/index.ts');
    handler = handlerRef.current!;
  });

  beforeEach(() => {
    supabaseDouble.reset();
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'admin-2',
          user_metadata: { org_id: 'org-audit', org_role: 'admin' },
        },
      },
      error: null,
    });
  });

  it('builds CSV with allowed columns and hashes fallback signature when storage fails', async () => {
    const auditRows = [
      {
        occurred_at: '2025-07-09T09:00:00.000Z',
        event: 'team.invite.sent',
        target: 'user:abc',
        text_summary: 'Invitation envoyée (hash:1234)',
      },
      {
        occurred_at: '2025-07-09T10:00:00.000Z',
        event: 'event.created',
        target: 'event:xyz',
        text_summary: 'Événement créé',
      },
    ];

    supabaseDouble.queueResponse('select', 'org_audit_logs', { data: auditRows, error: null });
    supabaseDouble.queueStorageUpload('test-bucket', new Error('storage unavailable'));

    const response = await handler(
      new Request('https://edge.local/b2b/audit/export', {
        method: 'POST',
        headers: {
          authorization: 'Bearer admin-token',
        },
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json() as {
      success: boolean;
      fallback: { csv: string; signature: string } | null;
    };
    expect(payload.success).toBe(true);
    expect(payload.fallback).not.toBeNull();
    expect(payload.fallback?.signature).toMatch(/^[a-f0-9]{64}$/);

    const csvLines = payload.fallback?.csv.split('\n') ?? [];
    expect(csvLines[0]).toBe('occurred_at,event,target,text_summary');
    expect(csvLines[1]).toContain('team.invite.sent');
    expect(csvLines[1]).not.toContain('actor_hash');
    expect(csvLines[2]).toContain('event.created');

    const auditLog = supabaseDouble.findLastLog('org_audit_logs', 'insert');
    expect(auditLog?.payload).toMatchObject({
      org_id: 'org-audit',
      event: 'audit.export.generated',
      text_summary: 'Export CSV généré (2 lignes)',
    });
  });
});
