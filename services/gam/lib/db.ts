export type GamWeeklyRow = {
  user_id_hash: string;
  week_start: string;
  pa_avg: number;
  laugh_genuine_ratio: number;
  conn_depth_avg: number;
  shares_total: number;
  mvpa_min: number;
  streak_ratio: number;
};

export type GamWeeklyOrgRow = {
  org_id: string;
  week_start: string;
  n_members: number;
  pa_avg: number;
  laugh_genuine_ratio: number;
  conn_depth_avg: number;
  shares_total: number;
  mvpa_min: number;
  streak_ratio: number;
};

const weekly: GamWeeklyRow[] = [];
const weeklyOrg: GamWeeklyOrgRow[] = [];

export function insertWeekly(row: GamWeeklyRow) {
  weekly.push(row);
}

export function insertWeeklyOrg(row: GamWeeklyOrgRow) {
  weeklyOrg.push(row);
}

export function listWeekly(userHash: string, since: Date): GamWeeklyRow[] {
  return weekly
    .filter(r => r.user_id_hash === userHash && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function listWeeklyOrg(orgId: string, since: Date): GamWeeklyOrgRow[] {
  return weeklyOrg
    .filter(r => r.org_id === orgId && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function clear() {
  weekly.length = 0;
  weeklyOrg.length = 0;
}
