/* @vitest-environment node */

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

vi.mock('@/lib/env', () => ({
  SUPABASE_ANON_KEY: 'anon-test-key',
  SUPABASE_URL: 'https://api.test',
}));

const getSessionMock = vi.fn(async () => ({
  data: {
    session: { access_token: 'session-token' },
  },
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
    },
  },
}));

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  getSessionMock.mockClear();
});
afterAll(() => server.close());

describe('B2B suite client contracts', () => {
  it('invites a member with the expected payload schema', async () => {
    const { inviteMember } = await import('@/services/b2b/suiteClient');

    server.use(
      http.post('https://api.test/functions/v1/b2b-teams-invite', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ email: 'ally@example.com', role: 'manager' });
        return HttpResponse.json({ success: true, email_hash: 'hash', expires_at: '2025-07-15T00:00:00.000Z' });
      }),
    );

    const response = await inviteMember('ally@example.com', 'manager');
    expect(response).toMatchObject({ success: true });
  });

  it('retrieves audit summaries only', async () => {
    const { fetchAuditLogs } = await import('@/services/b2b/suiteClient');

    server.use(
      http.get('https://api.test/functions/v1/b2b-audit-list', ({ request }) => {
        expect(request.url).toContain('from=2025-07-01');
        expect(request.url).toContain('to=2025-07-31');
        const payload = {
          items: [
            {
              occurred_at: '2025-07-02T12:00:00.000Z',
              event: 'team.invite.sent',
              target: 'org:xyz',
              text_summary: 'Invitation envoyée (hash:abcd)',
            },
          ],
        };
        return HttpResponse.json(payload);
      }),
    );

    const items = await fetchAuditLogs({ from: '2025-07-01', to: '2025-07-31' });
    expect(items).toHaveLength(1);
    expect(Object.keys(items[0])).toEqual(['occurred_at', 'event', 'target', 'text_summary']);
    expect(items[0].text_summary).toContain('hash:');
  });

  it('returns optimisation suggestions without digits', async () => {
    const { fetchOptimisation } = await import('@/services/b2b/suiteClient');

    server.use(
      http.get('https://api.test/functions/v1/b2b-optimisation', ({ request }) => {
        expect(request.url).toContain('period=2025-07');
        return HttpResponse.json({
          suggestions: [
            {
              id: 'sugg-1',
              title: 'Encourager les respirations partagées',
              description: 'Proposer une pause collective douce en fin de journée',
              period: '2025-07',
            },
          ],
        });
      }),
    );

    const suggestions = await fetchOptimisation('2025-07');
    expect(suggestions).toHaveLength(1);
    const combined = `${suggestions[0].title} ${suggestions[0].description}`;
    expect(/\d/.test(combined)).toBe(false);
  });

  it('returns heatmap summaries without numeric content', async () => {
    const { fetchHeatmapCells } = await import('@/services/b2b/heatmapApi');

    server.use(
      http.get('https://api.test/functions/v1/b2b-heatmap', ({ request }) => {
        expect(request.url).toContain('period=2025-09');
        return HttpResponse.json({
          period: '2025-09',
          cells: [
            {
              team_id: null,
              team_label: 'Organisation',
              instrument: 'UWES',
              summary: 'Implication stable et motivante.',
            },
            {
              team_id: 'aggregated',
              team_label: 'Autres (agrégé)',
              instrument: 'CBI',
              summary: 'Synthèse mutualisée : fatigue diffuse, respiration encouragée.',
            },
          ],
        });
      }),
    );

    const cells = await fetchHeatmapCells({ period: '2025-09' });
    expect(cells).toHaveLength(2);
    cells.forEach((cell) => {
      expect(/\d/.test(cell.summary)).toBe(false);
    });
  });
});
