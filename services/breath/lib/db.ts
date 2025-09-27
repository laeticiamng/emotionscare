export type BreathWeeklyRow = {
  user_id_hash: string;
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

const weekly: BreathWeeklyRow[] = [];
const weeklyOrg: BreathWeeklyOrgRow[] = [];

export function insertWeekly(row: BreathWeeklyRow) {
  weekly.push(row);
}

export function insertWeeklyOrg(row: BreathWeeklyOrgRow) {
  weeklyOrg.push(row);
}

export function listWeekly(userHash: string, since: Date): BreathWeeklyRow[] {
  return weekly
    .filter(r => r.user_id_hash === userHash && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function listWeeklyOrg(orgId: string, since: Date): BreathWeeklyOrgRow[] {
  return weeklyOrg
    .filter(r => r.org_id === orgId && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function clear() {
  weekly.length = 0;
  weeklyOrg.length = 0;
}
