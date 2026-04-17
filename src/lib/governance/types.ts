/**
 * Gouvernance Plateforme — Types partagés
 * @module lib/governance/types
 */

export type AuditType = 'routing' | 'data_rls' | 'observability' | 'modules' | 'global';
export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type ModuleStatus = 'alpha' | 'beta' | 'stable' | 'deprecated' | 'sunset';
export type SLOMetricType =
  | 'uptime'
  | 'latency_p50'
  | 'latency_p95'
  | 'latency_p99'
  | 'error_rate'
  | 'throughput'
  | 'availability';
export type SLOStatus = 'healthy' | 'degraded' | 'critical';
export type RouteAuditAction =
  | 'added'
  | 'removed'
  | 'deprecated'
  | 'redirected'
  | 'segment_changed'
  | 'guard_changed'
  | 'restored';

export interface AuditFinding {
  id: string;
  title: string;
  severity: Severity;
  category?: string;
  description?: string;
  remediation?: string;
  affected?: string[];
}

export interface GovernanceAudit {
  id: string;
  audit_type: AuditType;
  title: string;
  summary: string | null;
  score: number | null;
  severity: Severity;
  findings: AuditFinding[];
  metadata: Record<string, unknown>;
  triggered_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleLifecycle {
  id: string;
  module_key: string;
  display_name: string;
  status: ModuleStatus;
  version: string;
  owner: string | null;
  description: string | null;
  rollout_percentage: number;
  kill_switch_enabled: boolean;
  last_reviewed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface RouteAuditEntry {
  id: string;
  route_path: string;
  route_name: string | null;
  action: RouteAuditAction;
  previous_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
  reason: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface SLOMetric {
  id: string;
  module_key: string;
  metric_type: SLOMetricType;
  value: number;
  unit: string;
  target: number | null;
  status: SLOStatus | null;
  window_start: string;
  window_end: string;
  metadata: Record<string, unknown>;
  recorded_at: string;
}

/** Score global de gouvernance plateforme. */
export interface GovernanceHealthScore {
  global: number;
  routing: number;
  data: number;
  observability: number;
  modules: number;
  computed_at: string;
}
