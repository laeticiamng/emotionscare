// @ts-nocheck
import { createClient } from './supabase.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const metricsClient = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

type EdgeLatencyOutcome = 'success' | 'error' | 'denied';

interface EdgeLatencyMetric {
  route: string;
  durationMs: number;
  status: number;
  hashedUserId?: string | null;
  hashedOrgId?: string | null;
  stage?: string | null;
  outcome?: EdgeLatencyOutcome;
  error?: string | null;
}

function sanitizeMetricNumber(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.round(value);
}

function resolveOutcome(metric: EdgeLatencyMetric): EdgeLatencyOutcome {
  if (metric.outcome) {
    return metric.outcome;
  }
  if (metric.status >= 500) {
    return 'error';
  }
  if (metric.status >= 400) {
    return 'denied';
  }
  return 'success';
}

export async function recordEdgeLatencyMetric(metric: EdgeLatencyMetric): Promise<void> {
  if (!metricsClient) {
    return;
  }

  const eventData = {
    route: metric.route,
    duration_ms: sanitizeMetricNumber(metric.durationMs),
    status: metric.status,
    outcome: resolveOutcome(metric),
    stage: metric.stage ?? null,
    user: metric.hashedUserId ?? null,
    org: metric.hashedOrgId ?? null,
    error: metric.error ?? null,
  } as Record<string, unknown>;

  try {
    await metricsClient.from('analytics_events').insert({
      event_type: 'edge.latency',
      event_data: eventData,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('[observability] failed to record latency metric', error);
  }
}
