/**
 * Hook useOfflineMode - Phase 4
 * Gestion de l'état offline et de la synchronisation
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { offlineQueue, QueueStats } from '@/lib/offlineQueue';
import { logger } from '@/lib/logger';

export interface OfflineModeState {
  isOnline: boolean;
  queueStats: QueueStats;
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncError: string | null;
}

export function useOfflineMode() {
  const [state, setState] = useState<OfflineModeState>({
    isOnline: navigator.onLine,
    queueStats: {
      total: 0,
      pending: 0,
      syncing: 0,
      synced: 0,
      failed: 0,
      conflicts: 0,
    },
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  });

  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Initialiser et mettre en place les listeners
  useEffect(() => {
    // Initialiser la queue
    offlineQueue.initialize().catch((error) => {
      logger.error('Failed to initialize offline queue', error, 'OFFLINE');
    });

    // Listener pour les changements d'état online/offline
    const handleOnline = () => {
      logger.info('Online detected', {}, 'OFFLINE');
      setState((prev) => ({ ...prev, isOnline: true }));
      // Déclencher la synchronisation
      performSync();
    };

    const handleOffline = () => {
      logger.warn('Offline detected', undefined, 'OFFLINE');
      setState((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listener pour les changements de queue
    unsubscribeRef.current = offlineQueue.subscribe((stats) => {
      setState((prev) => ({
        ...prev,
        queueStats: stats,
      }));
    });

    // Synchronisation périodique toutes les 30 secondes si online
    const syncInterval = setInterval(() => {
      if (navigator.onLine && state.queueStats.pending > 0) {
        performSync();
      }
    }, 30 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      clearInterval(syncInterval);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  // Fonction pour synchroniser
  const performSync = useCallback(async () => {
    if (state.isSyncing || !navigator.onLine) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isSyncing: true,
      syncError: null,
    }));

    try {
      const result = await offlineQueue.sync();
      logger.info('Sync completed', result, 'OFFLINE');

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: Date.now(),
        syncError: null,
      }));

      // Déclencher un événement personnalisé pour notifier l'app
      window.dispatchEvent(
        new CustomEvent('offline:sync-complete', {
          detail: result,
        })
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error('Sync failed', error as Error, 'OFFLINE');

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: errorMsg,
      }));
    }
  }, [state.isSyncing]);

  // Fonction manuelle pour ajouter à la queue
  const addToQueue = useCallback(
    async (
      type: Parameters<typeof offlineQueue.addToQueue>[0],
      data: any,
      endpoint: string,
      method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
      priority: 'low' | 'normal' | 'high' = 'normal'
    ) => {
      try {
        const item = await offlineQueue.addToQueue(
          type,
          data,
          endpoint,
          method,
          priority
        );

        logger.info('Item added to queue', { type, id: item.id }, 'OFFLINE');

        // Si online, essayer de synchroniser immédiatement
        if (navigator.onLine) {
          // Attendre un peu avant de synchroniser pour regrouper les changements
          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
          }

          syncTimeoutRef.current = setTimeout(() => {
            performSync();
          }, 1000);
        }

        return item;
      } catch (error) {
        logger.error('Failed to add item to queue', error as Error, 'OFFLINE');
        throw error;
      }
    },
    [performSync]
  );

  const clearQueue = useCallback(async () => {
    try {
      await offlineQueue.clear();
      logger.info('Offline queue cleared', {}, 'OFFLINE');
    } catch (error) {
      logger.error('Failed to clear queue', error as Error, 'OFFLINE');
    }
  }, []);

  const cleanupQueue = useCallback(async () => {
    try {
      const removed = await offlineQueue.cleanup();
      logger.info('Cleanup completed', { removed }, 'OFFLINE');
    } catch (error) {
      logger.error('Cleanup failed', error as Error, 'OFFLINE');
    }
  }, []);

  return {
    ...state,
    sync: performSync,
    addToQueue,
    clearQueue,
    cleanupQueue,
    hasPendingItems: state.queueStats.pending > 0,
    hasFailedItems: state.queueStats.failed > 0,
    hasConflicts: state.queueStats.conflicts > 0,
  };
}
