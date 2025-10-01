// @ts-nocheck
import dayjs from 'dayjs';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

export interface BreathRow {
  week: string;
  hrv_stress_idx: number;
  coherence_avg: number;
  mvpa_minutes: number;
  relax_pct: number;
  mindfulness_pct: number;
  mood_avg: number;
}

export interface BreathOrgRow extends BreathRow {
  member_count: number;
}

export const fetchUserWeekly = async (since?: string): Promise<BreathRow[]> => {
  const qs = since ? `?since=${since}` : '';
  const res = await GlobalInterceptor.secureFetch(`/me/breath/weekly${qs}`);
  if (!res) throw new Error('Request failed');
  const { data } = await res.json();
  return data as BreathRow[];
};

export const fetchOrgWeekly = async (
  orgId: string,
  since?: string
): Promise<BreathOrgRow[]> => {
  const qs = since ? `?since=${since}` : '';
  const res = await GlobalInterceptor.secureFetch(
    `/org/${orgId}/breath/weekly${qs}`
  );
  if (!res) throw new Error('Request failed');
  const { data } = await res.json();
  return data as BreathOrgRow[];
};
