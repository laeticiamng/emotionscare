/**
 * Contexte Offline - Phase 4
 * Partage l'état offline à travers l'application
 */

import { createContext, useContext, ReactNode } from 'react';
import { useOfflineMode, OfflineModeState } from '@/hooks/useOfflineMode';

interface OfflineContextValue extends ReturnType<typeof useOfflineMode> {}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const offlineState = useOfflineMode();

  return (
    <OfflineContext.Provider value={offlineState}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}

/**
 * Hook pour obtenir seulement l'état (sans actions)
 */
export function useOfflineState(): OfflineModeState {
  const context = useOffline();
  return {
    isOnline: context.isOnline,
    queueStats: context.queueStats,
    isSyncing: context.isSyncing,
    lastSyncTime: context.lastSyncTime,
    syncError: context.syncError,
  };
}

/**
 * Hook pour les actions
 */
export function useOfflineActions() {
  const context = useOffline();
  return {
    sync: context.sync,
    addToQueue: context.addToQueue,
    clearQueue: context.clearQueue,
    cleanupQueue: context.cleanupQueue,
  };
}
