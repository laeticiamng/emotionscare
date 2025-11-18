import { subWeeks, format } from 'date-fns';
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
  since: Date = subWeeks(new Date(), 8)
) => {
  return useQuery(['orgScan', orgId, since], async () => {
    const res = await GlobalInterceptor.secureFetch(
      `/org/${orgId}/scan/weekly?since=${format(since, 'yyyy-MM-dd')}`
    );
    if (!res) throw new Error('Request failed');
    const { data } = await res.json();
    return data as OrgScanRow[];
  });
};
