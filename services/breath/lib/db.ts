import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yaincoxihiqdksxgrsrk.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaW5jb3hpaGlxZGtzeGdyc3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTE4MjcsImV4cCI6MjA1ODM4NzgyN30.HBfwymB2F9VBvb3uyeTtHBMZFZYXzL0wQmS5fqd65yU';
const supabase = createClient(supabaseUrl, supabaseKey);

export type BreathWeeklyRow = {
  user_id_hash?: string;
  user_id?: string;
  week_start: string;
  hrv_stress_idx: number | null;
  coherence_avg: number | null;
  mvpa_week: number | null;
  relax_idx: number | null;
  mindfulness_avg: number | null;
  mood_score: number | null;
};

export type BreathWeeklyOrgRow = {
  org_id: string;
  week_start: string;
  members: number;
  org_hrv_idx: number | null;
  org_coherence: number | null;
  org_mvpa: number | null;
  org_relax: number | null;
  org_mindfulness: number | null;
  org_mood: number | null;
};

export async function insertWeekly(row: BreathWeeklyRow): Promise<void> {
  const { error } = await supabase
    .from('breath_weekly_metrics')
    .upsert({
      user_id: row.user_id,
      week_start: row.week_start,
      hrv_stress_idx: row.hrv_stress_idx,
      coherence_avg: row.coherence_avg,
      mvpa_week: row.mvpa_week,
      relax_idx: row.relax_idx,
      mindfulness_avg: row.mindfulness_avg,
      mood_score: row.mood_score
    }, {
      onConflict: 'user_id,week_start'
    });
  
  if (error) throw error;
}

export async function insertWeeklyOrg(row: BreathWeeklyOrgRow): Promise<void> {
  const { error } = await supabase
    .from('breath_weekly_org_metrics')
    .upsert({
      org_id: row.org_id,
      week_start: row.week_start,
      members: row.members,
      org_hrv_idx: row.org_hrv_idx,
      org_coherence: row.org_coherence,
      org_mvpa: row.org_mvpa,
      org_relax: row.org_relax,
      org_mindfulness: row.org_mindfulness,
      org_mood: row.org_mood
    }, {
      onConflict: 'org_id,week_start'
    });
  
  if (error) throw error;
}

export async function listWeekly(userId: string, since: Date): Promise<BreathWeeklyRow[]> {
  const { data, error } = await supabase
    .from('breath_weekly_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('week_start', since.toISOString().split('T')[0])
    .order('week_start', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function listWeeklyOrg(orgId: string, since: Date): Promise<BreathWeeklyOrgRow[]> {
  const { data, error } = await supabase
    .from('breath_weekly_org_metrics')
    .select('*')
    .eq('org_id', orgId)
    .gte('week_start', since.toISOString().split('T')[0])
    .order('week_start', { ascending: false });
  
  if (error) throw error;
  return data || [];
}
