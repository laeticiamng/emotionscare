// @ts-nocheck
import { Sentry } from '@/lib/errors/sentry-compat';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';
import { logger } from '@/lib/logger';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import type { HeatmapCell } from '@/features/b2b/reports/utils';
import { mapSummariesToCells } from '@/features/b2b/reports/utils';

const DEFAULT_INSTRUMENTS = ['WEMWBS', 'SWEMWBS', 'CBI', 'UWES'] as const;

const aggregateSummarySchema = z.object({
  instrument: z.string(),
  period: z.string(),
  text: z.string(),
  team: z.string().optional(),
  action: z.string().optional(),
});

const aggregateResponseSchema = z.object({
  summaries: z.array(aggregateSummarySchema),
});

interface GetHeatmapParams {
  orgId: string;
  period: string;
  instruments?: string[];
}

export interface AggregateSummary {
  instrument: string;
  period: string;
  text: string;
  team?: string;
  action?: string;
}

async function fetchAggregateSummaries({ orgId, period, instruments }: GetHeatmapParams): Promise<AggregateSummary[]> {
  const payload = {
    org_id: orgId,
    period,
    instruments: instruments && instruments.length > 0 ? instruments : [...DEFAULT_INSTRUMENTS],
  };

  Sentry.addBreadcrumb({
    category: 'assess:aggregate:call',
    message: 'start',
    level: 'info',
    data: { period, instruments: payload.instruments },
  });

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token ?? null;
  const start = typeof performance !== 'undefined' ? performance.now() : null;

  try {
    const raw = await invokeSupabaseEdge<typeof payload, unknown>('assess-aggregate', {
      payload,
      accessToken,
      timeoutMs: 12_000,
      retries: 1,
      retryDelayMs: 750,
    });

    const parsed = aggregateResponseSchema.safeParse(raw);
    if (!parsed.success) {
      logger.error('Invalid aggregate payload', { issue: parsed.error.flatten().formErrors }, 'b2b.reports');
      throw new Error('aggregate_payload_invalid');
    }

    const summaries: AggregateSummary[] = parsed.data.summaries.map(summary => ({
      instrument: summary.instrument,
      period: summary.period,
      text: summary.text,
      team: summary.team,
      action: summary.action,
    }));

    const textOnly = summaries.every(summary => typeof summary.text === 'string' && !/\d/.test(summary.text));
    Sentry.setTag('b2b_text_only', textOnly ? 'true' : 'false');

    const cells = mapSummariesToCells(summaries);

    Sentry.addBreadcrumb({
      category: 'assess:aggregate:call',
      message: 'success',
      level: 'info',
      data: {
        instruments: summaries.map(summary => summary.instrument),
        teams: Array.from(new Set(summaries.map(summary => summary.team ?? 'org'))),
      },
    });

    if (start != null && typeof performance !== 'undefined') {
      const duration = performance.now() - start;
      logger.debug('b2b_heatmap_fetch_latency', { duration }, 'b2b.reports');
    }

    return summaries;
  } catch (error) {
    Sentry.addBreadcrumb({
      category: 'assess:aggregate:call',
      message: 'error',
      level: 'error',
      data: { period },
    });
    logger.error('Failed to load aggregate summaries', { error: error instanceof Error ? error.message : 'unknown' }, 'b2b.reports');
    throw error;
  }
}

export async function getHeatmap(params: GetHeatmapParams): Promise<HeatmapCell[]> {
  return fetchHeatmap(params);
}

async function fetchHeatmap(params: GetHeatmapParams): Promise<HeatmapCell[]> {
    const summaries = await fetchAggregateSummaries(params);
    return mapSummariesToCells(
      summaries.map(summary => ({
        instrument: summary.instrument,
        period: summary.period,
        text: summary.text,
        team: summary.team,
        action: summary.action,
      })),
    );
}

export async function getAggregateSummaries(params: GetHeatmapParams): Promise<AggregateSummary[]> {
  return fetchAggregateSummaries(params);
}

interface HeatmapMatrixParams extends UseHeatmapParams {
  periods: string[];
}

export function useHeatmapMatrix(
  { orgId, periods, instruments }: HeatmapMatrixParams,
  options?: HeatmapQueryOptions,
): UseQueryResult<HeatmapCell[], Error> {
  const sortedInstruments = instruments && instruments.length > 0 ? [...instruments].sort() : undefined;
  const instrumentsKey = sortedInstruments?.join('|') ?? 'all';
  const normalizedPeriods = periods.join('|');
  const isEnabled = Boolean(orgId && periods.length > 0) && (options?.enabled ?? true);

  return useQuery<HeatmapCell[], Error, HeatmapCell[], HeatmapQueryKey>({
    queryKey: ['b2b-heatmap', orgId, normalizedPeriods, instrumentsKey],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
    enabled: isEnabled,
    queryFn: async () => {
      if (!orgId || periods.length === 0) {
        return [];
      }

      const start = typeof performance !== 'undefined' ? performance.now() : null;
      const results = await Promise.all(
        periods.map(period =>
          fetchHeatmap({ orgId, period, instruments: sortedInstruments }).then(cells => cells.map(cell => ({ ...cell }))),
        ),
      );
      const flattened = results.flat();
      if (start != null && typeof performance !== 'undefined') {
        performanceMonitor.recordMetric('b2b_reports.fetch_latency', performance.now() - start);
      }
      return flattened;
    },
  });
}

type HeatmapQueryKey = [
  'b2b-heatmap',
  string | undefined,
  string | undefined,
  string,
];

type HeatmapQueryOptions = Omit<
  UseQueryOptions<HeatmapCell[], Error, HeatmapCell[], HeatmapQueryKey>,
  'queryKey' | 'queryFn'
>;

interface UseHeatmapParams {
  orgId?: string;
  period?: string;
  instruments?: string[];
}

export function useHeatmap(
  { orgId, period, instruments }: UseHeatmapParams,
  options?: HeatmapQueryOptions,
): UseQueryResult<HeatmapCell[], Error> {
  const sortedInstruments = instruments && instruments.length > 0 ? [...instruments].sort() : undefined;
  const instrumentsKey = sortedInstruments?.join('|') ?? 'all';
  const isEnabled = Boolean(orgId && period) && (options?.enabled ?? true);

  return useQuery<HeatmapCell[], Error, HeatmapCell[], HeatmapQueryKey>({
    queryKey: ['b2b-heatmap', orgId, period, instrumentsKey],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
    enabled: isEnabled,
    queryFn: async () => {
      if (!orgId || !period) {
        return [];
      }

      const start = typeof performance !== 'undefined' ? performance.now() : null;
      const cells = await fetchHeatmap({ orgId, period, instruments: sortedInstruments });
      if (start != null && typeof performance !== 'undefined') {
        performanceMonitor.recordMetric('b2b_reports.fetch_latency', performance.now() - start);
      }
      return cells;
    },
  });
}

type AggregateSummaryQueryKey = [
  'b2b-report-summaries',
  string | undefined,
  string | undefined,
  string,
];

type AggregateSummaryQueryOptions = Omit<
  UseQueryOptions<AggregateSummary[], Error, AggregateSummary[], AggregateSummaryQueryKey>,
  'queryKey' | 'queryFn'
>;

interface UseAggregateSummariesParams {
  orgId?: string;
  period?: string;
  instruments?: string[];
}

export function useAggregateSummaries(
  { orgId, period, instruments }: UseAggregateSummariesParams,
  options?: AggregateSummaryQueryOptions,
): UseQueryResult<AggregateSummary[], Error> {
  const sortedInstruments = instruments && instruments.length > 0 ? [...instruments].sort() : undefined;
  const instrumentsKey = sortedInstruments?.join('|') ?? 'all';
  const isEnabled = Boolean(orgId && period) && (options?.enabled ?? true);

  return useQuery<AggregateSummary[], Error, AggregateSummary[], AggregateSummaryQueryKey>({
    queryKey: ['b2b-report-summaries', orgId, period, instrumentsKey],
    staleTime: 120_000,
    refetchOnWindowFocus: false,
    ...(options ?? {}),
    enabled: isEnabled,
    queryFn: async () => {
      if (!orgId || !period) {
        return [];
      }

      const start = typeof performance !== 'undefined' ? performance.now() : null;
      const summaries = await fetchAggregateSummaries({ orgId, period, instruments: sortedInstruments });
      if (start != null && typeof performance !== 'undefined') {
        performanceMonitor.recordMetric('b2b_reports.fetch_latency', performance.now() - start);
      }
      return summaries;
    },
  });
}

export { DEFAULT_INSTRUMENTS };
