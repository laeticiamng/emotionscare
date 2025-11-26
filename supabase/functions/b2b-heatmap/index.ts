import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import {
  appendAuditLog,
  buildCorsHeaders,
  getAuthContext,
  isSuiteEnabled,
  jsonResponse,
  serviceClient,
  sha256,
} from '../_shared/b2b.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const REQUIRED_INSTRUMENT_FLAGS = ['FF_ASSESS_WEMWBS', 'FF_ASSESS_SWEMWBS', 'FF_ASSESS_CBI', 'FF_ASSESS_UWES'] as const;
const INSTRUMENT_ORDER = ['WEMWBS', 'SWEMWBS', 'CBI', 'UWES'];
const PERIOD_PATTERN = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

function isFeatureEnabled(): boolean {
  return (Deno.env.get('FF_B2B_HEATMAP') ?? 'false').toLowerCase() === 'true';
}

function isInstrumentEnabled(flag: (typeof REQUIRED_INSTRUMENT_FLAGS)[number]): boolean {
  return (Deno.env.get(flag) ?? 'false').toLowerCase() === 'true';
}

function activeInstruments(): string[] {
  return INSTRUMENT_ORDER.filter((instrument) => isInstrumentEnabled(`FF_ASSESS_${instrument}` as (typeof REQUIRED_INSTRUMENT_FLAGS)[number]));
}

type RawHeatmapRow = {
  org_id: string;
  period: string;
  team_id: string | null;
  instrument: string;
  n: number | null;
  text_summary: string | null;
};

type DirectoryRow = {
  team_id?: string | null;
  team_name?: string | null;
};

type DirectoryEntry = {
  label: string;
  count: number;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

function sanitizeSummary(text: string | null | undefined): string {
  return (text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function registerDirectoryEntry(map: Map<string, DirectoryEntry>, keys: string[], entry: DirectoryEntry) {
  keys.forEach((key) => {
    const normalized = key.trim();
    if (!normalized) return;
    if (!map.has(normalized)) {
      map.set(normalized, entry);
    }
  });
}

async function loadDirectory(orgId: string): Promise<Map<string, DirectoryEntry>> {
  const directory = new Map<string, DirectoryEntry>();

  const { data, error } = await serviceClient
    .from('org_memberships')
    .select('team_id, team_name')
    .eq('org_id', orgId);

  if (error) {
    console.warn('[b2b:heatmap] directory lookup failed, falling back to empty map', { error: error.message });
    return directory;
  }

  (data as DirectoryRow[] | null)?.forEach((row) => {
    const label = (row.team_name ?? '').trim();
    if (!label) return;
    const primaryKey = (row.team_id ?? '').trim() || slugify(label);
    if (!primaryKey) return;

    const existing = directory.get(primaryKey) ?? { label, count: 0 } satisfies DirectoryEntry;
    existing.count += 1;
    if (existing.label.length === 0) {
      existing.label = label;
    }

    const aliasKeys = new Set<string>([primaryKey, label, slugify(label)]);
    registerDirectoryEntry(directory, Array.from(aliasKeys), existing);
  });

  return directory;
}

function resolveTeam(
  row: RawHeatmapRow,
  directory: Map<string, DirectoryEntry>,
): { id: string | null; label: string; memberCount: number } {
  if (!row.team_id) {
    return { id: null, label: 'Organisation', memberCount: Number.POSITIVE_INFINITY };
  }

  const trimmed = row.team_id.trim();
  if (!trimmed) {
    return { id: null, label: 'Organisation', memberCount: Number.POSITIVE_INFINITY };
  }

  const directoryEntry =
    directory.get(trimmed) ??
    directory.get(slugify(trimmed)) ??
    directory.get(trimmed.toLowerCase());

  if (!directoryEntry) {
    return { id: trimmed, label: trimmed, memberCount: 0 };
  }

  return {
    id: trimmed,
    label: directoryEntry.label,
    memberCount: directoryEntry.count,
  };
}

function combineSummaries(values: string[]): string {
  const unique = Array.from(new Set(values.filter((value) => value.length > 0)));
  if (unique.length === 0) {
    return 'Synthèse mutualisée pour micro-équipes, données confidentielles.';
  }
  return `Synthèse mutualisée : ${unique.join(' · ')}`;
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
    if (!isSuiteEnabled() || !isFeatureEnabled()) {
      return jsonResponse(req, 404, { error: 'not_found' });
    }

    if (req.method !== 'GET') {
      return jsonResponse(req, 405, { error: 'method_not_allowed' });
    }

    const instruments = activeInstruments();
    if (instruments.length === 0) {
      return jsonResponse(req, 404, { error: 'feature_disabled' });
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
      route: 'b2b-heatmap',
      userId: auth.userId,
      limit: 30,
      windowMs: 60_000,
      description: 'B2B heatmap API',
    });

    if (!rateLimit.allowed) {
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        error: 'Too many requests',
        retryAfter: rateLimit.retryAfter,
      });
    }

    const url = new URL(req.url);
    const period = url.searchParams.get('period');

    if (!period || !PERIOD_PATTERN.test(period)) {
      return jsonResponse(req, 400, { error: 'invalid_period' });
    }

    const [directory, heatmapResponse] = await Promise.all([
      loadDirectory(auth.orgId),
      serviceClient
        .from('org_heatmap_mv')
        .select('org_id, period, team_id, instrument, n, text_summary')
        .eq('org_id', auth.orgId)
        .eq('period', period)
        .in('instrument', instruments)
        .order('instrument', { ascending: true }),
    ]);

    if (heatmapResponse.error) {
      console.error('[b2b:heatmap] failed to read aggregates', { error: heatmapResponse.error.message });
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const aggregatedBuckets = new Map<string, string[]>();
    const cells: Array<{ team_id: string | null; team_label: string; instrument: string; summary: string }> = [];

    (heatmapResponse.data as RawHeatmapRow[] | null)?.forEach((row) => {
      if (!row || typeof row.instrument !== 'string') return;
      if (typeof row.n === 'number' && row.n < 5) {
        return;
      }
      const summary = sanitizeSummary(row.text_summary);
      if (!summary || /\d/.test(summary)) {
        return;
      }

      const teamInfo = resolveTeam(row, directory);
      if (teamInfo.memberCount > 0 && teamInfo.memberCount < 5 && teamInfo.id) {
        const bucket = aggregatedBuckets.get(row.instrument) ?? [];
        bucket.push(summary);
        aggregatedBuckets.set(row.instrument, bucket);
        return;
      }

      cells.push({
        team_id: teamInfo.id,
        team_label: teamInfo.label,
        instrument: row.instrument,
        summary,
      });
    });

    aggregatedBuckets.forEach((summaries, instrument) => {
      const summary = combineSummaries(summaries);
      cells.push({
        team_id: 'aggregated',
        team_label: 'Autres (agrégé)',
        instrument,
        summary,
      });
    });

    const hashedTeams = await Promise.all(
      cells
        .map((cell) => cell.team_id)
        .filter((teamId): teamId is string => typeof teamId === 'string' && teamId.length > 0)
        .map(async (teamId) => ({ original: teamId, hash: await sha256(teamId) })),
    );

    if (hashedTeams.length > 0) {
      console.info('[b2b:heatmap] cells served', {
        org: await sha256(auth.orgId),
        period,
        teams: hashedTeams.map((entry) => entry.hash.slice(0, 12)),
      });
    }

    await appendAuditLog({
      orgId: auth.orgId,
      actorId: auth.userId,
      event: 'heatmap.viewed',
      target: `org:${auth.orgId}`,
      summary: `Consultation heatmap (${period})`,
    });

    return jsonResponse(req, 200, {
      period,
      cells: cells.sort((a, b) => {
        if (a.team_id === b.team_id) {
          const left = INSTRUMENT_ORDER.indexOf(a.instrument);
          const right = INSTRUMENT_ORDER.indexOf(b.instrument);
          return left - right;
        }
        if (a.team_id === null) return -1;
        if (b.team_id === null) return 1;
        if (a.team_id === 'aggregated' && b.team_id !== 'aggregated') return 1;
        if (b.team_id === 'aggregated' && a.team_id !== 'aggregated') return -1;
        return a.team_label.localeCompare(b.team_label, 'fr');
      }),
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b:heatmap] unexpected error', { error: error instanceof Error ? error.message : 'unknown' });
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
