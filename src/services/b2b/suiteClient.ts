import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/env';
import { supabase } from '@/integrations/supabase/client';

const EDGE_BASE_URL = `${SUPABASE_URL}/functions/v1`;

interface CallOptions {
  method?: 'GET' | 'POST';
  payload?: Record<string, unknown>;
  search?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
}

async function callEdge<TResult>(name: string, options: CallOptions = {}): Promise<TResult> {
  const { method = 'POST', payload, search, headers: extraHeaders } = options;
  const { data: session } = await supabase.auth.getSession();
  const accessToken = session.session?.access_token ?? SUPABASE_ANON_KEY;

  const url = new URL(`${EDGE_BASE_URL}/${name}`);
  if (search) {
    Object.entries(search).forEach(([key, value]) => {
      if (typeof value === 'undefined' || value === null) return;
      url.searchParams.set(key, String(value));
    });
  }

  const headers = new Headers({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Client-Info': 'b2b-suite-ui',
    ...extraHeaders,
  });

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(payload ?? {}) : undefined,
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Edge ${name} failed (${response.status}): ${text}`);
  }

  if (response.status === 204) {
    return undefined as TResult;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return { raw: text } as unknown as TResult;
  }

  return response.json() as Promise<TResult>;
}

export type B2BMember = {
  id: string;
  role: 'admin' | 'manager' | 'member';
  label: string;
  invited_at?: string | null;
  joined_at?: string | null;
  order: number;
};

export async function fetchMembers(): Promise<B2BMember[]> {
  const payload = await callEdge<{ members: B2BMember[] }>('b2b-security-roles', { method: 'GET' });
  return payload.members;
}

export async function inviteMember(email: string, role: 'manager' | 'member') {
  return callEdge('b2b-teams-invite', { payload: { email, role } });
}

export async function updateMemberRole(userId: string, role: 'admin' | 'manager' | 'member') {
  return callEdge('b2b-teams-role', { payload: { user_id: userId, role } });
}

export type OrgEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  location: string | null;
  reminders: { email: boolean; push: boolean };
  created_at?: string;
};

export async function listEvents(): Promise<OrgEvent[]> {
  const payload = await callEdge<{ events: OrgEvent[] }>('b2b-events-list', { method: 'GET' });
  return payload.events;
}

export async function createEvent(data: {
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  reminders: { email: boolean; push: boolean };
}) {
  return callEdge<{ event: OrgEvent }>('b2b-events-create', { payload: data });
}

export async function updateEvent(eventId: string, updates: Partial<Omit<OrgEvent, 'id'>>) {
  return callEdge<{ event: OrgEvent }>('b2b-events-update', {
    payload: { event_id: eventId, ...updates },
  });
}

export async function deleteEvent(eventId: string) {
  return callEdge('b2b-events-delete', { payload: { event_id: eventId } });
}

export async function sendEventNotifications(eventId: string, channel: 'email' | 'push' | 'both') {
  return callEdge('b2b-events-notify', { payload: { event_id: eventId, channel } });
}

export async function updateEventRsvp(eventId: string, status: 'yes' | 'no' | 'maybe') {
  return callEdge('b2b-events-rsvp', { payload: { event_id: eventId, status } });
}

export type OptimisationSuggestion = {
  id: string;
  title: string;
  description: string;
  period?: string;
};

export async function fetchOptimisation(period?: string): Promise<OptimisationSuggestion[]> {
  const payload = await callEdge<{ suggestions: OptimisationSuggestion[] }>('b2b-optimisation', {
    method: 'GET',
    search: { period },
  });
  return payload.suggestions;
}

export interface MonthlyReportPayload {
  title: string;
  period: string;
  team_label?: string | null;
  summary: string[];
  action: string;
}

export async function listReportPeriods(): Promise<string[]> {
  const payload = await callEdge<{ periods?: string[] }>('b2b-report', {
    method: 'GET',
  });
  return Array.isArray(payload.periods) ? payload.periods : [];
}

export async function fetchMonthlyReport(period: string, teamId?: string | null): Promise<MonthlyReportPayload> {
  const payload = await callEdge<MonthlyReportPayload>('b2b-report', {
    method: 'GET',
    search: {
      period,
      team_id: teamId ?? undefined,
    },
  });
  return payload;
}

export async function exportMonthlyReportCsv(period: string, teamId?: string | null) {
  return callEdge<{ url: string | null; expires_at: string | null; fallback: { signature: string; csv: string } | null }>(
    'b2b-report-export',
    {
      payload: {
        period,
        team_id: teamId ?? null,
      },
    },
  );
}

export type HeatmapCell = {
  team_id: string | null;
  team_label: string;
  instrument: string;
  summary: string;
};

export async function fetchHeatmap(params: { period: string }): Promise<HeatmapCell[]> {
  const payload = await callEdge<{ period: string; cells: HeatmapCell[] }>('b2b-heatmap', {
    method: 'GET',
    search: { period: params.period },
  });
  return payload.cells;
}

export async function fetchHeatmapPeriods(): Promise<string[]> {
  const payload = await callEdge<{ periods: string[] }>('b2b-heatmap-periods', {
    method: 'GET',
  });
  return payload.periods;
}

export type AuditLogItem = {
  occurred_at: string;
  event: string;
  target: string | null;
  text_summary: string;
};

export async function fetchAuditLogs(params: { from?: string; to?: string; event?: string } = {}) {
  const payload = await callEdge<{ items: AuditLogItem[] }>('b2b-audit-list', {
    method: 'GET',
    search: params,
  });
  return payload.items;
}

export async function exportAuditLogs(params: { from?: string; to?: string; event?: string } = {}) {
  return callEdge<{ url: string | null; expires_at: string | null; fallback: { signature: string; csv: string } | null }>(
    'b2b-audit-export',
    { payload: params },
  );
}

export async function rotateKeys(secret?: string) {
  return callEdge('b2b-security-rotate-keys', {
    payload: {},
    headers: secret ? { 'x-service-secret': secret } : undefined,
  });
}

export type SessionInfo = {
  label: string;
  last_seen: string;
};

export async function fetchSessions(): Promise<SessionInfo[]> {
  const payload = await callEdge<{ sessions: SessionInfo[] }>('b2b-security-sessions', { method: 'GET' });
  return payload.sessions;
}
