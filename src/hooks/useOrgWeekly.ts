// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrgStore, GroupBy } from '@/store/org.store';

export type VibeBucket = 'low' | 'medium' | 'high';
export type Trend = 'up' | 'flat' | 'down';

export interface TeamDay {
  date: string;
  bucket: VibeBucket;
}

export interface TeamRow {
  team_id: string;
  team_name: string;
  size_window: number;
  eligible: boolean;
  days?: TeamDay[];
  trend?: Trend;
}

export interface OrgWeekly {
  from: string;
  to: string;
  group_by: GroupBy;
  min_n: number;
  teams: TeamRow[];
}

interface UseOrgWeeklyParams {
  range: '7d' | '14d' | '30d';
  groupBy: GroupBy;
  site?: string;
  bu?: string;
  minN?: number;
}

const fetchOrgWeekly = async (params: UseOrgWeeklyParams): Promise<OrgWeekly> => {
  const { range, groupBy, site, bu, minN = 5 } = params;
  
  // Calculate date range
  const to = new Date().toISOString().split('T')[0];
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const searchParams = new URLSearchParams({
    from,
    to,
    group_by: groupBy,
    min_n: minN.toString(),
  });

  if (site) searchParams.append('site', site);
  if (bu) searchParams.append('bu', bu);

  const { data, error } = await supabase.functions.invoke('org-dashboard-weekly', {
    body: { params: Object.fromEntries(searchParams) }
  });

  if (error) throw error;
  return data;
};

export const useOrgWeekly = (params?: Partial<UseOrgWeeklyParams>) => {
  const filters = useOrgStore(state => state.filters);
  
  const finalParams = {
    range: params?.range ?? filters.range,
    groupBy: params?.groupBy ?? filters.groupBy,
    site: params?.site ?? filters.site,
    bu: params?.bu ?? filters.bu,
    minN: params?.minN ?? filters.minN,
  };

  return useQuery({
    queryKey: ['org-weekly', finalParams],
    queryFn: () => fetchOrgWeekly(finalParams),
    refetchOnWindowFocus: false,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  });
};