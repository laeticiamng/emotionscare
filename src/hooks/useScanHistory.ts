import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useCallback } from 'react';

export interface ScanHistoryItem {
  id: string;
  valence: number;
  arousal: number;
  source: string;
  created_at: string;
  summary?: string;
  emotion?: string;
}

export function useScanHistory(limit = 3) {
  const queryClient = useQueryClient();
  
  // Écouter les nouveaux scans via événement window
  useEffect(() => {
    const handleScanSaved = () => {
      queryClient.invalidateQueries({ queryKey: ['scan-history'] });
      queryClient.invalidateQueries({ queryKey: ['multi-source-history'] });
    };
    
    window.addEventListener('scan-saved', handleScanSaved);
    return () => window.removeEventListener('scan-saved', handleScanSaved);
  }, [queryClient]);
  
  // Souscription Realtime pour mises à jour automatiques
  useEffect(() => {
    let userId: string | null = null;
    
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;
      
      const channel = supabase
        .channel('scan-history-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'clinical_signals',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            // Invalider le cache pour récupérer les nouvelles données
            queryClient.invalidateQueries({ queryKey: ['scan-history'] });
            queryClient.invalidateQueries({ queryKey: ['multi-source-history'] });
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    };
    
    setupRealtime();
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
        .in('source_instrument', ['SAM', 'scan_camera', 'scan_sliders', 'voice', 'scan_text', 'scan_facial', 'scan_voice', 'self-report', 'scan_image'])
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
          emotion: metadata?.emotion,
        };
      });
    },
    staleTime: 10_000, // Rafraîchir toutes les 10s
    gcTime: 5 * 60_000,
    refetchOnMount: true, // Rafraîchir à chaque montage
    refetchOnWindowFocus: true,
  });
}
