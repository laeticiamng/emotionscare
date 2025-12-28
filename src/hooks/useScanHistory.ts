import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface ScanHistoryItem {
  id: string;
  valence: number;
  arousal: number;
  source: string;
  created_at: string;
  summary?: string;
}

export function useScanHistory(limit = 3) {
  const queryClient = useQueryClient();
  
  // Écouter les nouveaux scans
  useEffect(() => {
    const handleScanSaved = () => {
      queryClient.invalidateQueries({ queryKey: ['scan-history'] });
      queryClient.invalidateQueries({ queryKey: ['multi-source-history'] });
    };
    
    window.addEventListener('scan-saved', handleScanSaved);
    return () => window.removeEventListener('scan-saved', handleScanSaved);
  }, [queryClient]);
  
  return useQuery({
    queryKey: ['scan-history', limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('clinical_signals')
        .select('id, metadata, created_at, source_instrument')
        .eq('user_id', user.id)
        .in('source_instrument', ['SAM', 'scan_camera', 'scan_sliders', 'voice'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((item): ScanHistoryItem => {
        const metadata = item.metadata as any;
        return {
          id: item.id,
          valence: metadata?.valence ?? 50,
          arousal: metadata?.arousal ?? 50,
          source: item.source_instrument ?? 'scan',
          created_at: item.created_at,
          summary: metadata?.summary,
        };
      });
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false, // Prevent flash by not refetching on mount
  });
}
