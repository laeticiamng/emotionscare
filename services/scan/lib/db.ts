export type ScanWeeklyRow = {
  user_id_hash: string;
  week_start: string;
  valence_face_avg: number;
  arousal_sd_face: number;
  joy_face_avg: number;
  valence_voice_avg: number;
  lexical_sentiment_avg: number;
  n_face_sessions: number;
  n_voice_sessions: number;
};

export type ScanWeeklyOrgRow = {
  org_id: string;
  week_start: string;
  members: number;
  org_valence_face: number;
  org_arousal_sd: number;
  org_joy_face: number;
  org_valence_voice: number;
  org_lexical_sentiment: number;
};

const weekly: ScanWeeklyRow[] = [];
const weeklyOrg: ScanWeeklyOrgRow[] = [];

export function insertWeekly(row: ScanWeeklyRow) {
  weekly.push(row);
}

export function insertWeeklyOrg(row: ScanWeeklyOrgRow) {
  weeklyOrg.push(row);
}

export function listWeekly(userHash: string, since: Date): ScanWeeklyRow[] {
  return weekly
    .filter(r => r.user_id_hash === userHash && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function listWeeklyOrg(orgId: string, since: Date): ScanWeeklyOrgRow[] {
  return weeklyOrg
    .filter(r => r.org_id === orgId && new Date(r.week_start) >= since)
    .sort((a, b) => b.week_start.localeCompare(a.week_start));
}

export function clear() {
  weekly.length = 0;
  weeklyOrg.length = 0;
}
