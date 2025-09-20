/* @vitest-environment node */

import { createHash } from 'node:crypto';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  envStore,
  handlerRef,
  resetTestState,
  supabaseDouble,
  type Handler,
} from './b2b-test-utils';

describe('b2b teams invite edge function', () => {
  let handler: Handler;

  beforeAll(async () => {
    resetTestState();
    envStore.set('SUPABASE_URL', 'https://supabase.test');
    envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    envStore.set('FF_B2B_SUITE', 'true');
    envStore.set('B2B_MAGIC_LINK_BASE_URL', 'https://app.emotionscare.com/b2b/join');
    await import('../../supabase/functions/b2b-teams-invite/index.ts');
    handler = handlerRef.current!;
  });

  beforeEach(() => {
    supabaseDouble.reset();
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          user_metadata: { org_id: 'org-abc', org_role: 'admin' },
        },
      },
      error: null,
    });
  });

  it('normalizes email, hashes invite and avoids leaking pii in audit summary', async () => {
    const request = new Request('https://edge.local/b2b/teams/invite', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-123',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email: '  Alice@example.COM ', role: 'manager' }),
    });

    const expectedEmail = 'alice@example.com';
    const expectedHash = createHash('sha256').update(expectedEmail).digest('hex');

    const response = await handler(request);
    expect(response.status).toBe(200);

    const json = await response.json() as { email_hash: string; success: boolean };
    expect(json.success).toBe(true);
    expect(json.email_hash).toBe(expectedHash);

    const inviteLog = supabaseDouble.findLastLog('org_invites', 'insert');
    expect(inviteLog?.payload).toMatchObject({
      org_id: 'org-abc',
      email_hash: expectedHash,
      role: 'manager',
    });

    const auditLog = supabaseDouble.findLastLog('org_audit_logs', 'insert');
    expect(auditLog?.payload).toMatchObject({
      org_id: 'org-abc',
      text_summary: expect.stringContaining('hash:'),
    });
    expect(String((auditLog?.payload as Record<string, unknown>)?.text_summary)).not.toContain(expectedEmail);
  });
});
