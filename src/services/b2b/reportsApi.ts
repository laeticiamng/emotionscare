import * as Sentry from '@sentry/react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';
import { logger } from '@/lib/logger';
import type { HeatmapCell, HeatmapCellInput } from '@/features/b2b/reports/utils';
import { mapSummariesToCells } from '@/features/b2b/reports/utils';

const DEFAULT_INSTRUMENTS = ['WEMWBS', 'CBI', 'UWES'] as const;

const aggregateSummarySchema = z.object({
  instrument: z.string(),
  period: z.string(),
  text: z.string(),
  team: z.string().optional(),
  action: z.string().optional(),
  n: z.number().optional(),
});

const aggregateResponseSchema = z.object({
  summaries: z.array(aggregateSummarySchema),
});

interface GetHeatmapParams {
  orgId: string;
  period: string;
  instruments?: string[];
}

export async function getHeatmap({ orgId, period, instruments }: GetHeatmapParams): Promise<HeatmapCell[]> {
  const payload = {
    org_id: orgId,
    period,
    instruments: instruments && instruments.length > 0 ? instruments : [...DEFAULT_INSTRUMENTS],
  };

  Sentry.addBreadcrumb({
    category: 'b2b:agg:fetch',
    message: 'start',
    level: 'info',
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

    const summaries: HeatmapCellInput[] = parsed.data.summaries.map(summary => ({
      instrument: summary.instrument,
      period: summary.period,
      text: summary.text,
      team: summary.team,
      action: summary.action,
      n: summary.n,
    }));

    const cells = mapSummariesToCells(summaries);

    Sentry.addBreadcrumb({
      category: 'b2b:agg:fetch',
      message: 'success',
      level: 'info',
      data: { instruments: cells.map(cell => cell.instrument), teams: Array.from(new Set(cells.map(cell => cell.team ?? 'org'))) },
    });

    if (start != null && typeof performance !== 'undefined') {
      const duration = performance.now() - start;
      logger.debug('b2b_heatmap_fetch_latency', { duration }, 'b2b.reports');
    }

    return cells;
  } catch (error) {
    Sentry.addBreadcrumb({
      category: 'b2b:agg:fetch',
      message: 'error',
      level: 'error',
    });
    logger.error('Failed to load aggregate summaries', { error: error instanceof Error ? error.message : 'unknown' }, 'b2b.reports');
    throw error;
  }
}

export { DEFAULT_INSTRUMENTS };
export type { HeatmapCell };
