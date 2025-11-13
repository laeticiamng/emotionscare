/**
 * Hook pour gérer le statut du service Suno
 */

import { useState, useEffect, useCallback } from 'react';
import { getSunoApiStatus, getUserQueueItems, getQueuePosition } from '@/services/musicQueueService';
import type { SunoApiStatus, QueueItem } from '@/services/musicQueueService';
import { logger } from '@/lib/logger';

export const useSunoServiceStatus = () => {
  const [status, setStatus] = useState<SunoApiStatus | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const apiStatus = await getSunoApiStatus();
      setStatus(apiStatus);
    } catch (error) {
      logger.error('Failed to fetch service status', error as Error, 'MUSIC_STATUS');
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

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      refresh();
    }, 30000);

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
