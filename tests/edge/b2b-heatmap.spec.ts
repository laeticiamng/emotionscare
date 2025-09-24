/* @vitest-environment node */

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  envStore,
  handlerRef,
  resetTestState,
  supabaseDouble,
  type Handler,
} from './b2b-test-utils';

describe('b2b heatmap endpoint', () => {
  let handler: Handler;

  beforeAll(async () => {
    resetTestState();
    envStore.set('SUPABASE_URL', 'https://supabase.test');
    envStore.set('SUPABASE_SERVICE_ROLE_KEY', 'service-key');
    envStore.set('FF_B2B_SUITE', 'true');
    envStore.set('FF_B2B_HEATMAP', 'true');
    envStore.set('FF_ASSESS_WEMWBS', 'true');
    envStore.set('FF_ASSESS_SWEMWBS', 'true');
    envStore.set('FF_ASSESS_CBI', 'true');
    envStore.set('FF_ASSESS_UWES', 'true');
    await import('../../supabase/functions/b2b-heatmap/index.ts');
    handler = handlerRef.current!;
  });

  beforeEach(() => {
    supabaseDouble.reset();
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-1',
          user_metadata: { org_id: 'org-1', org_role: 'admin' },
        },
      },
      error: null,
    });
  });

  it('groups teams below k-anonymity threshold into aggregated bucket', async () => {
    supabaseDouble.queueResponse('select', 'org_memberships', {
      data: [
        { team_id: 'team-alpha', team_name: 'Équipe Alpha' },
        { team_id: 'team-alpha', team_name: 'Équipe Alpha' },
        { team_id: 'team-alpha', team_name: 'Équipe Alpha' },
        { team_id: 'team-alpha', team_name: 'Équipe Alpha' },
        { team_id: 'team-alpha', team_name: 'Équipe Alpha' },
        { team_id: 'team-beta', team_name: 'Équipe Beta' },
        { team_id: 'team-beta', team_name: 'Équipe Beta' },
        { team_id: 'team-beta', team_name: 'Équipe Beta' },
      ],
      error: null,
    });

    supabaseDouble.queueResponse('select', 'org_heatmap_mv', {
      data: [
        {
          org_id: 'org-1',
          period: '2025-09',
          team_id: 'team-alpha',
          instrument: 'WEMWBS',
          n: 12,
          text_summary: 'Ambiance posée, échanges paisibles.',
        },
        {
          org_id: 'org-1',
          period: '2025-09',
          team_id: 'team-beta',
          instrument: 'CBI',
          n: 5,
          text_summary: 'Fatigue partagée, tempo à alléger.',
        },
        {
          org_id: 'org-1',
          period: '2025-09',
          team_id: null,
          instrument: 'UWES',
          n: 18,
          text_summary: 'Implication stable et volontaire.',
        },
      ],
      error: null,
    });

    const response = await handler(
      new Request('https://edge.local/b2b/heatmap?period=2025-09', {
        method: 'GET',
        headers: { authorization: 'Bearer token-1' },
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json() as { cells: Array<{ team_id: string | null; team_label: string; instrument: string; summary: string }> };
    const aggregated = payload.cells.find((cell) => cell.team_id === 'aggregated');
    expect(aggregated).toBeDefined();
    expect(aggregated?.instrument).toBe('CBI');
    expect(aggregated?.summary).toContain('Fatigue partagée');
    expect(payload.cells.some((cell) => cell.team_id === 'team-beta')).toBe(false);
  });

  it('filters rows by the requested period', async () => {
    supabaseDouble.queueResponse('select', 'org_memberships', { data: [], error: null });
    supabaseDouble.queueResponse('select', 'org_heatmap_mv', { data: [], error: null });

    await handler(
      new Request('https://edge.local/b2b/heatmap?period=2025-08', {
        method: 'GET',
        headers: { authorization: 'Bearer token-1' },
      }),
    );

    const selectLog = supabaseDouble.findLastLog('org_heatmap_mv', 'select');
    expect(selectLog?.filters.some((filter) => filter.method === 'eq' && filter.args[0] === 'period' && filter.args[1] === '2025-08')).toBe(true);
  });

  it('rejects members without manager or admin role', async () => {
    supabaseDouble.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-2',
          user_metadata: { org_id: 'org-1', org_role: 'member' },
        },
      },
      error: null,
    });

    const response = await handler(
      new Request('https://edge.local/b2b/heatmap?period=2025-09', {
        method: 'GET',
        headers: { authorization: 'Bearer token-2' },
      }),
    );

    expect(response.status).toBe(403);
  });
});
