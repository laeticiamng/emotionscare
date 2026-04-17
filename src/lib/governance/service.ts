/**
 * Gouvernance — Service d'accès Supabase.
 * @module lib/governance/service
 */
import { supabase } from '@/integrations/supabase/client';
import type {
  GovernanceAudit,
  ModuleLifecycle,
  RouteAuditEntry,
  SLOMetric,
  AuditType,
} from './types';

export const governanceService = {
  /** Récupère les N derniers audits, optionnellement filtrés par type. */
  async listAudits(limit = 25, type?: AuditType): Promise<GovernanceAudit[]> {
    let query = supabase
      .from('governance_audits')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (type) query = query.eq('audit_type', type);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as GovernanceAudit[];
  },

  async createAudit(audit: Omit<GovernanceAudit, 'id' | 'created_at' | 'updated_at'>): Promise<GovernanceAudit> {
    const { data, error } = await supabase
      .from('governance_audits')
      .insert(audit as any)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as GovernanceAudit;
  },

  async listModules(): Promise<ModuleLifecycle[]> {
    const { data, error } = await supabase
      .from('module_lifecycle')
      .select('*')
      .order('display_name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as ModuleLifecycle[];
  },

  async upsertModule(module: Partial<ModuleLifecycle> & { module_key: string; display_name: string }) {
    const { data, error } = await supabase
      .from('module_lifecycle')
      .upsert(module as any, { onConflict: 'module_key' })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ModuleLifecycle;
  },

  async toggleKillSwitch(moduleKey: string, enabled: boolean) {
    const { error } = await supabase
      .from('module_lifecycle')
      .update({ kill_switch_enabled: enabled, last_reviewed_at: new Date().toISOString() } as any)
      .eq('module_key', moduleKey);
    if (error) throw error;
  },

  async listRouteAudits(limit = 50): Promise<RouteAuditEntry[]> {
    const { data, error } = await supabase
      .from('route_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as RouteAuditEntry[];
  },

  async listSLO(moduleKey?: string, limit = 100): Promise<SLOMetric[]> {
    let query = supabase
      .from('slo_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(limit);
    if (moduleKey) query = query.eq('module_key', moduleKey);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as SLOMetric[];
  },
};
