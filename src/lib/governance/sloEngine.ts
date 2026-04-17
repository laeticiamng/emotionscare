/**
 * Governance — SLO aggregation helpers.
 * @module lib/governance/sloEngine
 */
import type { SLOMetric, SLOStatus, SLOMetricType } from './types';

export interface ModuleSLOSnapshot {
  module_key: string;
  uptime: number | null;
  latencyP95: number | null;
  errorRate: number | null;
  status: SLOStatus;
  series: Record<SLOMetricType, Array<{ ts: string; value: number }>>;
}

const empty = (): ModuleSLOSnapshot['series'] => ({
  uptime: [],
  latency_p50: [],
  latency_p95: [],
  latency_p99: [],
  error_rate: [],
  throughput: [],
  availability: [],
});

const worstStatus = (...s: Array<SLOStatus | null | undefined>): SLOStatus => {
  if (s.some((x) => x === 'critical')) return 'critical';
  if (s.some((x) => x === 'degraded')) return 'degraded';
  return 'healthy';
};

export function aggregateSLO(metrics: SLOMetric[]): ModuleSLOSnapshot[] {
  const map = new Map<string, ModuleSLOSnapshot>();

  // Sort ascending so series are chronological
  const sorted = [...metrics].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );

  for (const m of sorted) {
    let snap = map.get(m.module_key);
    if (!snap) {
      snap = {
        module_key: m.module_key,
        uptime: null,
        latencyP95: null,
        errorRate: null,
        status: 'healthy',
        series: empty(),
      };
      map.set(m.module_key, snap);
    }
    snap.series[m.metric_type].push({ ts: m.recorded_at, value: Number(m.value) });
    snap.status = worstStatus(snap.status, m.status);
  }

  // Compute latest values per module
  for (const snap of map.values()) {
    const lastOf = (k: SLOMetricType) => {
      const arr = snap.series[k];
      return arr.length ? arr[arr.length - 1].value : null;
    };
    snap.uptime = lastOf('uptime');
    snap.latencyP95 = lastOf('latency_p95');
    snap.errorRate = lastOf('error_rate');
  }

  return Array.from(map.values()).sort((a, b) => a.module_key.localeCompare(b.module_key));
}

export function computeGlobalScore(snapshots: ModuleSLOSnapshot[]): number {
  if (snapshots.length === 0) return 100;
  const weights = { healthy: 100, degraded: 60, critical: 20 } as const;
  const sum = snapshots.reduce((acc, s) => acc + weights[s.status], 0);
  return Math.round(sum / snapshots.length);
}
