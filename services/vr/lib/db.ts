import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
const supabase = createClient(supabaseUrl, supabaseKey);

export type VrNebulaSession = {
  id?: string;
  user_id: string;
  user_id_hash?: string;
  ts_start: Date;
  ts_finish?: Date;
  duration_s: number;
  resp_rate_avg?: number;
  hrv_pre?: number;
  hrv_post?: number;
  rmssd_delta?: number;
  coherence_score?: number;
  client?: string;
};

export type VrDomeSession = {
  id?: string;
  session_id: string;
  user_id: string;
  user_id_hash?: string;
  ts: Date;
  ts_join: Date;
  ts_leave?: Date;
  hr_mean?: number;
  hr_std?: number;
  valence?: number;
  valence_avg?: number;
  synchrony_idx?: number;
  group_sync_idx?: number;
  team_pa?: number;
};

export type VrWeeklyRow = {
  user_id_hash: string;
  week_start: string;
  hrv_gain_median: number;
  coherence_avg: number;
};

export type VrWeeklyOrgRow = {
  org_id: string;
  week_start: string;
  members: number;
  org_hrv_gain: number;
  org_coherence: number;
  org_sync_idx: number;
  org_team_pa: number;
};

export async function insertNebula(session: VrNebulaSession): Promise<void> {
  const { error } = await supabase
    .from('vr_nebula_sessions')
    .insert({
      user_id: session.user_id,
      user_id_hash: session.user_id_hash,
      ts_start: session.ts_start.toISOString(),
      ts_finish: session.ts_finish?.toISOString(),
      duration_s: session.duration_s,
      resp_rate_avg: session.resp_rate_avg,
      hrv_pre: session.hrv_pre,
      hrv_post: session.hrv_post,
      client: session.client || 'mobile'
    });
  
  if (error) throw error;
}

export async function insertDome(session: VrDomeSession): Promise<void> {
  const { error } = await supabase
    .from('vr_dome_sessions')
    .insert({
      session_id: session.session_id,
      user_id: session.user_id,
      user_id_hash: session.user_id_hash,
      ts: session.ts.toISOString(),
      ts_join: session.ts_join.toISOString(),
      ts_leave: session.ts_leave?.toISOString(),
      hr_mean: session.hr_mean,
      hr_std: session.hr_std,
      valence: session.valence,
      valence_avg: session.valence_avg
    });
  
  if (error) throw error;
}

export async function listNebula(userId: string, since: Date): Promise<VrNebulaSession[]> {
  const { data, error } = await supabase
    .from('vr_nebula_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('ts_start', since.toISOString())
    .order('ts_start', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(row => ({
    ...row,
    ts_start: new Date(row.ts_start),
    ts_finish: row.ts_finish ? new Date(row.ts_finish) : undefined
  }));
}

export async function listDome(userId: string, since: Date): Promise<VrDomeSession[]> {
  const { data, error } = await supabase
    .from('vr_dome_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('ts', since.toISOString())
    .order('ts', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(row => ({
    ...row,
    ts: new Date(row.ts),
    ts_join: new Date(row.ts_join),
    ts_leave: row.ts_leave ? new Date(row.ts_leave) : undefined
  }));
}

// Weekly aggregates - Using materialized views
export async function listWeekly(userId: string, since: Date): Promise<VrWeeklyRow[]> {
  const { data, error } = await supabase
    .from('vr_combined_weekly_user')
    .select('*')
    .eq('user_id', userId)
    .gte('week_start', since.toISOString())
    .order('week_start', { ascending: false });

  if (error) throw error;

  // Map to expected VrWeeklyRow format
  return (data || []).map(row => ({
    user_id_hash: userId, // Using user_id as hash for now
    week_start: row.week_start,
    hrv_gain_median: row.avg_coherence_score || 0, // Using coherence as proxy for HRV gain
    coherence_avg: row.avg_coherence_score || 0
  }));
}

export async function listWeeklyOrg(orgId: string, since: Date): Promise<VrWeeklyOrgRow[]> {
  const { data, error } = await supabase
    .from('vr_weekly_org')
    .select('*')
    .eq('organization_id', orgId)
    .gte('week_start', since.toISOString())
    .order('week_start', { ascending: false });

  if (error) throw error;

  // Map to expected VrWeeklyOrgRow format
  return (data || []).map(row => ({
    org_id: orgId,
    week_start: row.week_start,
    members: row.active_users || 0,
    org_hrv_gain: row.avg_coherence_score || 0,
    org_coherence: row.avg_coherence_score || 0,
    org_sync_idx: row.avg_synchrony_idx || 0,
    org_team_pa: row.avg_team_pa || 0
  }));
}
