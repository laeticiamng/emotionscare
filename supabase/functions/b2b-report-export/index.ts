// @ts-nocheck
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

import {
  buildCorsHeaders,
  getAuthContext,
  isReportsEnabled,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';
import { sanitizeAggregateText } from '../_shared/clinical_text.ts';
import { addSentryBreadcrumb } from '../_shared/sentry.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const EXPORT_BUCKET = Deno.env.get('B2B_REPORTS_BUCKET') ?? 'b2b-reports-exports';
const SUPPORTED_INSTRUMENTS = ['WEMWBS', 'SWEMWBS', 'CBI', 'UWES'] as const;

type ExportRow = {
  team_label: string;
  instrument: string;
  n: number | null;
  text_summary: string;
  action_text: string | null;
};

function enforceAvailability(req: Request) {
  if (!isSuiteEnabled() || !isReportsEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function normalizeInstrument(instrument: string): string {
  if (instrument === 'SWEMWBS') {
    return 'WEMWBS';
  }
  return instrument;
}

function buildCsv(rows: ExportRow[]): string {
  const header = 'team_label,instrument,n,text_summary,action_text';
  const escape = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) {
      return '""';
    }
    const stringified = String(value);
    return `"${stringified.replace(/"/g, '""')}"`;
  };
  const lines = rows.map((row) =>
    [row.team_label, row.instrument, row.n ?? '', row.text_summary, row.action_text ?? ''].map(escape).join(','),
  );
  return [header, ...lines].join('\n');
}

serve(async (req) => {
  const corsHeaders = {
    ...buildCorsHeaders(req),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    enforceAvailability(req);

    if (req.method !== 'POST') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const auth = await getAuthContext(req).catch((error) => {
      if (error instanceof Response) return error;
      return jsonResponse(req, 401, { error: 'unauthorized' });
    });

    if (auth instanceof Response) {
      return auth;
    }

    if (auth.orgRole !== 'admin' && auth.orgRole !== 'manager') {
      return jsonResponse(req, 403, { error: 'forbidden' });
    }

    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'b2b-report-export',
      userId: auth.userId,
      limit: 20,
      windowMs: 60_000,
      description: 'B2B report export API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const body = (await req.json().catch(() => null)) as { period?: string; team_id?: string | null } | null;
    if (!body || typeof body.period !== 'string') {
      return jsonResponse(req, 422, { error: 'invalid_body' });
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(body.period)) {
      return jsonResponse(req, 400, { error: 'invalid_period' });
    }

    const teamId = body.team_id && body.team_id !== 'null' ? body.team_id : null;
    if (teamId && !/^[0-9a-f-]{36}$/i.test(teamId)) {
      return jsonResponse(req, 400, { error: 'invalid_team' });
    }

    const { data: heatmapData, error: heatmapError } = await serviceClient
      .from('org_heatmap_mv')
      .select('team_label, team_id, instrument, period, text_summary, n')
      .eq('org_id', auth.orgId)
      .eq('period', body.period)
      .in('instrument', SUPPORTED_INSTRUMENTS);

    if (heatmapError) {
      console.error('[b2b] report export heatmap query failed', { error: heatmapError });
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const scopedRows = (heatmapData ?? []).filter((row) => {
      const normalizedTeam = row.team_id ?? null;
      if (teamId) {
        return normalizedTeam === teamId;
      }
      return normalizedTeam === null;
    }) as Array<{ team_label?: string | null; team_id: string | null; instrument: string; text_summary: string | null; n?: number | null }>;

    if (scopedRows.length === 0) {
      return jsonResponse(req, 404, { error: 'not_found' });
    }

    const { data: actionsData } = await serviceClient
      .from('org_action_hints')
      .select('team_id, instrument, action_text')
      .eq('org_id', auth.orgId)
      .eq('period', body.period);

    const actionMap = new Map<string, string>();
    (actionsData ?? []).forEach((row) => {
      const key = `${normalizeInstrument(row.instrument ?? '')}|${row.team_id ?? 'org'}`;
      if (typeof row.action_text === 'string' && row.action_text.length > 0) {
        actionMap.set(key, row.action_text);
      }
    });

    const rows: ExportRow[] = scopedRows.map((row) => {
      const normalizedInstrument = normalizeInstrument(row.instrument ?? '');
      const key = `${normalizedInstrument}|${row.team_id ?? 'org'}`;
      const sanitizedSummary = sanitizeAggregateText(row.text_summary ?? '');
      return {
        team_label: row.team_label ?? (row.team_id ? 'Équipe' : 'Organisation'),
        instrument: normalizedInstrument,
        n: typeof row.n === 'number' ? row.n : null,
        text_summary: sanitizedSummary,
        action_text: actionMap.get(key) ?? null,
      };
    });

    const csv = buildCsv(rows);
    const fileNameParts = ['report', auth.orgId, body.period];
    if (teamId) {
      fileNameParts.push(teamId);
    }
    const fileName = `${fileNameParts.join('-')}.csv`;
    const filePath = `${auth.orgId}/${fileName}`;

    let signedUrl: string | null = null;
    let expiresAt: string | null = null;
    let fallback: { signature: string; csv: string } | null = null;

    try {
      const blob = new Blob([csv], { type: 'text/csv' });
      const { error: uploadError } = await serviceClient.storage.from(EXPORT_BUCKET).upload(filePath, blob, {
        cacheControl: '600',
        upsert: true,
        contentType: 'text/csv',
      });
      if (uploadError) {
        throw uploadError;
      }

      const { data: signed } = await serviceClient.storage.from(EXPORT_BUCKET).createSignedUrl(filePath, 600);
      if (signed?.signedUrl) {
        signedUrl = signed.signedUrl;
        expiresAt = new Date(Date.now() + 600 * 1000).toISOString();
      }
    } catch (error) {
      console.warn('[b2b] report export storage fallback', error);
      const signature = await sha256(csv);
      fallback = { signature, csv };
    }

    if (teamId) {
      const hashedTeam = await sha256(teamId);
      addSentryBreadcrumb({
        category: 'b2b:export:csv',
        data: { period: body.period, team: hashedTeam, rows: rows.length },
      });
    } else {
      addSentryBreadcrumb({
        category: 'b2b:export:csv',
        data: { period: body.period, scope: 'org', rows: rows.length },
      });
    }

    return jsonResponse(req, 200, {
      url: signedUrl,
      expires_at: expiresAt,
      fallback,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] report export error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
