// @ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ScanHistoryItem {
  id: string;
  valence: number;
  arousal: number;
  source: string;
  created_at: string;
  summary?: string;
}

export function useScanHistory(limit = 3) {
  return useQuery({
    queryKey: ['scan-history', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clinical_signals')
        .select('id, context_data, created_at')
        .eq('user_id', user.id)
        .in('source_instrument', ['SAM', 'scan_camera', 'scan_sliders'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((item): ScanHistoryItem => {
        const context = item.context_data as any;
        return {
          id: item.id,
          valence: context?.valence ?? 50,
          arousal: context?.arousal ?? 50,
          source: context?.source ?? 'scan',
          created_at: item.created_at,
          summary: context?.summary,
        };
      });
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false, // Prevent flash by not refetching on mount
  });
}
