/**
 * useScanRealtime - Hook pour les mises à jour temps réel des scans
 * Utilise Supabase Realtime pour synchroniser les données
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';

export interface RealtimeScanEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any;
  timestamp: string;
}

export function useScanRealtime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeScanEvent | null>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`scan-realtime-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clinical_signals',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        logger.info('[useScanRealtime] Event received', { type: payload.eventType }, 'SCAN');
        
        setLastEvent({
          type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
          data: payload.new || payload.old,
          timestamp: new Date().toISOString()
        });

        // Invalider les caches
        queryClient.invalidateQueries({ queryKey: ['scan-history'] });
        queryClient.invalidateQueries({ queryKey: ['multi-source-history'] });
        
        window.dispatchEvent(new CustomEvent('scan-updated'));
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const forceRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['scan-history'] });
  }, [queryClient]);

  return { isConnected, lastEvent, forceRefresh };
}

export default useScanRealtime;
