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
import {
  inferBucketFromText,
  summarizeCBI,
  summarizeUWES,
  summarizeWEMWBS,
  suggestAction,
  type Bucket,
} from '../../../src/lib/b2b/reporting.ts';

const SUPPORTED_INSTRUMENTS = ['WEMWBS', 'SWEMWBS', 'CBI', 'UWES'] as const;

type SupportedInstrument = (typeof SUPPORTED_INSTRUMENTS)[number];

interface HeatmapRow {
  instrument: SupportedInstrument | string;
  period: string;
  team_id: string | null;
  team_label?: string | null;
  text_summary: string | null;
  bucket?: string | null;
}

interface TrendRow {
  instrument: string;
  team_id: string | null;
  summary_prev: string | null;
  summary_now: string | null;
}

function enforceAvailability(req: Request) {
  if (!isSuiteEnabled() || !isReportsEnabled()) {
    throw jsonResponse(req, 404, { error: 'not_found' });
  }
}

function normalizeInstrument(instrument: string): 'WEMWBS' | 'CBI' | 'UWES' | null {
  if (instrument === 'WEMWBS' || instrument === 'CBI' || instrument === 'UWES') {
    return instrument;
  }
  if (instrument === 'SWEMWBS') {
    return 'WEMWBS';
  }
  return null;
}

function parseBucket(rawBucket: string | null | undefined, fallbackText: string | null | undefined): Bucket {
  if (rawBucket) {
    const normalized = rawBucket.toLowerCase();
    if (normalized.includes('high') || normalized.includes('haut') || normalized.includes('posit')) {
      return 'high';
    }
    if (normalized.includes('mid') || normalized.includes('medium') || normalized.includes('mod')) {
      return 'mid';
    }
    if (normalized.includes('low') || normalized.includes('bas') || normalized.includes('tendu')) {
      return 'low';
    }
  }
  return inferBucketFromText(fallbackText);
}

function describeTrend(trend: TrendRow | undefined): string | null {
  if (!trend) {
    return null;
  }
  const previous = inferBucketFromText(trend.summary_prev);
  const current = inferBucketFromText(trend.summary_now);
  if (previous === 'unknown' || current === 'unknown') {
    return null;
  }
  if (previous === current) {
    return 'Tendance comparable au mois précédent.';
  }
  if (previous === 'low' && (current === 'mid' || current === 'high')) {
    return 'Progression douce par rapport au mois précédent.';
  }
  if (previous === 'high' && current === 'mid') {
    return 'Équilibre toujours présent, légèrement plus vigilant que le mois passé.';
  }
  if ((previous === 'mid' || previous === 'high') && current === 'low') {
    return 'Tension plus sensible que le mois précédent.';
  }
  return null;
}

function ensureThreeSentences(sentences: string[]): string[] {
  return sentences.filter(Boolean).slice(0, 3);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: buildCorsHeaders(req) });
  }

  try {
    enforceAvailability(req);

    if (req.method !== 'GET') {
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

    const url = new URL(req.url);
    const period = url.searchParams.get('period');
    const rawTeamId = url.searchParams.get('team_id');
    const teamId = rawTeamId && rawTeamId !== 'null' ? rawTeamId : null;

    if (teamId && !/^[0-9a-f-]{36}$/i.test(teamId)) {
      return jsonResponse(req, 400, { error: 'invalid_team' });
    }

    if (!period) {
      const { data, error } = await serviceClient
        .from('org_assess_rollups')
        .select('period')
        .eq('org_id', auth.orgId)
        .gte('n', 5)
        .order('period', { ascending: false })
        .limit(24);

      if (error) {
        console.error('[b2b] report periods query failed', { error });
        return jsonResponse(req, 500, { error: 'query_failed' });
      }

      const periods = Array.from(new Set((data ?? []).map((row) => row.period).filter((value): value is string => Boolean(value))));
      return jsonResponse(req, 200, { periods });
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) {
      return jsonResponse(req, 400, { error: 'invalid_period' });
    }

    const { data: heatmapData, error: heatmapError } = await serviceClient
      .from('org_heatmap_mv')
      .select('instrument, period, text_summary, bucket, team_id, team_label')
      .eq('org_id', auth.orgId)
      .eq('period', period)
      .in('instrument', SUPPORTED_INSTRUMENTS);

    if (heatmapError) {
      console.error('[b2b] report heatmap query failed', { error: heatmapError });
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const scopedRows = (heatmapData ?? []).filter((row) => {
      const normalizedTeam = row.team_id ?? null;
      if (teamId) {
        return normalizedTeam === teamId;
      }
      return normalizedTeam === null;
    }) as HeatmapRow[];

    if (scopedRows.length === 0) {
      return jsonResponse(req, 404, { error: 'not_found' });
    }

    const { data: guardData, error: guardError } = await serviceClient
      .from('org_assess_rollups')
      .select('instrument')
      .eq('org_id', auth.orgId)
      .eq('period', period)
      .gte('n', 5);

    if (guardError) {
      console.error('[b2b] report guard query failed', { error: guardError });
      return jsonResponse(req, 500, { error: 'query_failed' });
    }

    const allowed = new Set((guardData ?? []).map((row) => row.instrument));

    const { data: trendData } = await serviceClient
      .from('org_heatmap_trend_mv')
      .select('instrument, team_id, summary_prev, summary_now')
      .eq('org_id', auth.orgId)
      .eq('period', period);

    const trendMap = new Map<string, TrendRow>();
    (trendData ?? []).forEach((row) => {
      const normalizedInstrument = normalizeInstrument(row.instrument);
      const key = `${normalizedInstrument ?? row.instrument}|${row.team_id ?? 'org'}`;
      trendMap.set(key, row as TrendRow);
    });

    let teamLabel: string | null = null;

    const sentenceMap: Record<'WEMWBS' | 'CBI' | 'UWES', string> = {
      WEMWBS: '',
      CBI: '',
      UWES: '',
    };

    (scopedRows ?? []).forEach((row) => {
      const normalizedInstrument = normalizeInstrument(row.instrument ?? '');
      if (!normalizedInstrument) {
        return;
      }
      if (!allowed.has(row.instrument) && !allowed.has(normalizedInstrument)) {
        return;
      }
      const sanitizedSummary = sanitizeAggregateText(row.text_summary ?? '');
      const bucket = parseBucket(row.bucket, row.text_summary ?? '');
      const key = `${normalizedInstrument}|${teamId ?? 'org'}`;
      const trendSentence = describeTrend(trendMap.get(key));
      let sentence: string;
      if (normalizedInstrument === 'WEMWBS') {
        sentence = summarizeWEMWBS(bucket);
      } else if (normalizedInstrument === 'CBI') {
        sentence = summarizeCBI(bucket);
      } else {
        sentence = summarizeUWES(bucket);
      }
      if (trendSentence && !sentence.toLowerCase().includes(trendSentence.toLowerCase())) {
        sentence = `${sentence} ${trendSentence}`.trim();
      }
      if (sanitizedSummary.length > 0) {
        const snippet = sanitizedSummary.split(/[.!?]/)[0]?.replace(/[.!?]+$/g, '').trim();
        if (snippet && !sentence.toLowerCase().includes(snippet.toLowerCase())) {
          sentence = `${sentence} ${snippet}`.trim();
        }
      }
      sentenceMap[normalizedInstrument] = sentence;
      if (teamLabel === null && typeof row.team_label === 'string') {
        teamLabel = row.team_label;
      }
    });

    const sentences = ensureThreeSentences([
      sentenceMap.WEMWBS,
      sentenceMap.CBI,
      sentenceMap.UWES,
    ]);

    if (sentences.length === 0) {
      return jsonResponse(req, 404, { error: 'not_found' });
    }

    const action = suggestAction({
      wemwbs: sentenceMap.WEMWBS,
      cbi: sentenceMap.CBI,
      uwes: sentenceMap.UWES,
    });

    let actionInstrument: 'WEMWBS' | 'CBI' | 'UWES' = 'WEMWBS';
    if (action === 'Réunion courte sans agenda pour relâcher.') {
      actionInstrument = 'CBI';
    } else if (action === 'Bloquer 30 min focus sans sollicitations, en équipe.') {
      actionInstrument = 'UWES';
    }

    try {
      await serviceClient.from('org_action_hints').upsert(
        {
          org_id: auth.orgId,
          period,
          team_id: teamId,
          instrument: actionInstrument,
          action_text: action,
        },
        { onConflict: 'org_id,period,instrument,team_id' },
      );
    } catch (hintError) {
      console.warn('[b2b] unable to store action hint', hintError);
    }

    if (teamId) {
      const hashedTeam = await sha256(teamId);
      addSentryBreadcrumb({
        category: 'b2b:report:opened',
        data: { period, team: hashedTeam, sentences: sentences.length },
      });
    } else {
      addSentryBreadcrumb({
        category: 'b2b:report:opened',
        data: { period, scope: 'org', sentences: sentences.length },
      });
    }

    const title = `Rapport ${teamLabel ?? 'organisation'} — ${period}`;

    return jsonResponse(req, 200, {
      title,
      period,
      team_label: teamLabel,
      summary: sentences,
      action,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error('[b2b] report error', error);
    return jsonResponse(req, 500, { error: 'unexpected_error' });
  }
});
