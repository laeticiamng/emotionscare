/**
 * Governance — Client RLS scan helper.
 * @module lib/governance/rlsAudit
 */
import { supabase } from '@/integrations/supabase/client';
import type { GovernanceAudit } from './types';

export interface RlsScanResult {
  ok: boolean;
  audit: GovernanceAudit;
  score: number;
  findings_count: number;
}

/** Triggers the governance-rls-scan edge function (admin only). */
export async function triggerRlsScan(): Promise<RlsScanResult> {
  const { data, error } = await supabase.functions.invoke<RlsScanResult>(
    'governance-rls-scan',
    { body: {} },
  );
  if (error) throw error;
  if (!data) throw new Error('Empty response from RLS scan');
  return data;
}
