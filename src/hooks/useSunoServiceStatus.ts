/**
 * Hook pour gérer le statut du service Suno avec health check réel
 */

import { useState, useEffect, useCallback } from 'react';
import { getSunoApiStatus, getUserQueueItems, getQueuePosition } from '@/services/musicQueueService';
import type { SunoApiStatus, QueueItem } from '@/services/musicQueueService';
import { logger } from '@/lib/logger';
import { useMusicQueueNotifications } from '@/hooks/useMusicQueueNotifications';
import { supabase } from '@/integrations/supabase/client';

export const useSunoServiceStatus = () => {
  const [status, setStatus] = useState<SunoApiStatus | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    fetchUser();
  }, []);

  useMusicQueueNotifications(userId);

  const fetchStatus = useCallback(async () => {
    try {
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: { action: 'health-check' }
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        const apiStatus = await getSunoApiStatus();
        setStatus(apiStatus);
        return;
      }

      if (data?.status === 'ok' || data?.success) {
        const apiStatus = await getSunoApiStatus();
        setStatus({
          ...apiStatus,
          is_available: true,
          consecutive_failures: 0
        });
      } else {
        const apiStatus = await getSunoApiStatus();
        setStatus(apiStatus);
      }
    } catch (error) {
      logger.error('Failed to fetch service status', error as Error, 'MUSIC_STATUS');
      try {
        const apiStatus = await getSunoApiStatus();
        setStatus(apiStatus);
      } catch {
        // Fallback silently
      }
    }
  }, []);

  const fetchQueueItems = useCallback(async () => {
    try {
      const items = await getUserQueueItems();
      setQueueItems(items);
    } catch (error) {
      logger.error('Failed to fetch queue items', error as Error, 'MUSIC_STATUS');
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchStatus(), fetchQueueItems()]);
    setIsLoading(false);
  }, [fetchStatus, fetchQueueItems]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const getItemPosition = useCallback(async (queueId: string) => {
    return await getQueuePosition(queueId);
  }, []);

  const pendingCount = queueItems.filter(item => item.status === 'pending').length;
  const processingCount = queueItems.filter(item => item.status === 'processing').length;

  return {
    status,
    queueItems,
    pendingCount,
    processingCount,
    isLoading,
    refresh,
    getItemPosition,
  };
};
