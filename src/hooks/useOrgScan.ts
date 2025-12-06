import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { GlobalInterceptor } from '@/utils/globalInterceptor';

export interface OrgScanRow {
  week: string;
  ab_avg: number;
  ev_avg: number;
  joy_face_avg: number;
  valence_voice_avg: number;
}

export const useOrgScan = (
  orgId: string,
  since: dayjs.Dayjs = dayjs().subtract(8, 'week')
) => {
  return useQuery(['orgScan', orgId, since], async () => {
    const res = await GlobalInterceptor.secureFetch(
      `/org/${orgId}/scan/weekly?since=${since.format('YYYY-MM-DD')}`
    );
    if (!res) throw new Error('Request failed');
    const { data } = await res.json();
    return data as OrgScanRow[];
  });
};
