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

const weekly: VrWeeklyRow[] = [];
const weeklyOrg: VrWeeklyOrgRow[] = [];

export function insertWeekly(row: VrWeeklyRow) {
  weekly.push(row);
}

export function insertWeeklyOrg(row: VrWeeklyOrgRow) {
  weeklyOrg.push(row);
}

export function listWeekly(userHash: string, since: Date): VrWeeklyRow[] {
  return weekly
    .filter(r => r.user_id_hash === userHash && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function listWeeklyOrg(orgId: string, since: Date): VrWeeklyOrgRow[] {
  return weeklyOrg
    .filter(r => r.org_id === orgId && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function clear() {
  weekly.length = 0;
  weeklyOrg.length = 0;
}
