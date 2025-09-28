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

describe('B2B monthly reports client contracts', () => {
  it('lists available periods via GET', async () => {
    const { listReportPeriods } = await import('@/services/b2b/suiteClient');

    server.use(
      http.get('https://api.test/functions/v1/b2b-report', ({ request }) => {
        expect(request.url).not.toContain('period=');
        return HttpResponse.json({ periods: ['2025-01', '2024-12'] });
      }),
    );

    const periods = await listReportPeriods();
    expect(periods).toEqual(['2025-01', '2024-12']);
  });

  it('fetches a textual monthly report without digits', async () => {
    const { fetchMonthlyReport } = await import('@/services/b2b/suiteClient');

    server.use(
      http.get('https://api.test/functions/v1/b2b-report', ({ request }) => {
        expect(request.url).toContain('period=2025-02');
        expect(request.url).toContain('team_id=team-123');
        return HttpResponse.json({
          title: 'Rapport équipe A — 2025-02',
          period: '2025-02',
          team_label: 'Équipe A',
          summary: [
            'Ambiance globalement posée.',
            'Quelques signaux de fatigue à accueillir avec attention.',
            "Implication forte, envie d'avancer partagée.",
          ],
          action: 'Réunion courte sans agenda pour relâcher.',
        });
      }),
    );

    const report = await fetchMonthlyReport('2025-02', 'team-123');
    expect(report.summary).toHaveLength(3);
    const combined = `${report.summary.join(' ')} ${report.action}`;
    expect(/\d/.test(combined)).toBe(false);
  });

  it('exports the report as CSV with allowed columns only', async () => {
    const { exportMonthlyReportCsv } = await import('@/services/b2b/suiteClient');

    server.use(
      http.post('https://api.test/functions/v1/b2b-report-export', async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({ period: '2025-02', team_id: null });
        return HttpResponse.json({
          url: 'https://storage.test/reports/2025-02.csv?signature=abc',
          expires_at: '2025-02-28T10:00:00.000Z',
          fallback: null,
        });
      }),
    );

    const payload = await exportMonthlyReportCsv('2025-02');
    expect(payload.url).toContain('2025-02.csv');
    expect(payload.fallback).toBeNull();
  });
});
