/**
 * Hook pour gérer la synchronisation hors ligne
 * Utilise le Service Worker pour sauvegarder et sync les données
 */
import { useState, useEffect, useCallback } from 'react';

export interface OfflineSyncState {
  isOnline: boolean;
  pendingJournalDrafts: number;
  pendingBreathSessions: number;
  lastSyncAt: Date | null;
}

export interface UseOfflineSyncReturn {
  state: OfflineSyncState;
  saveJournalDraft: (draft: JournalDraft) => Promise<boolean>;
  saveBreathSession: (session: BreathSession) => Promise<boolean>;
  getBreathPatterns: () => Promise<Record<string, BreathPattern>>;
  requestSync: () => void;
}

export interface JournalDraft {
  content: string;
  mood?: string;
  createdAt: string;
}

export interface BreathSession {
  pattern: string;
  duration: number;
  completedAt: string;
  cycles: number;
}

export interface BreathPattern {
  inhale: number;
  hold: number;
  exhale: number;
  holdEmpty?: number;
  name: string;
}

export const useOfflineSync = (): UseOfflineSyncReturn => {
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: navigator.onLine,
    pendingJournalDrafts: 0,
    pendingBreathSessions: 0,
    lastSyncAt: null,
  });

  // Écouter les changements de connectivité
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      requestSync();
    };
    
    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Communication avec le Service Worker
  const sendToSW = useCallback(<T>(type: string, data?: Record<string, unknown>): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker?.controller) {
        reject(new Error('Service Worker not available'));
        return;
      }

      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data as T);
      };

      navigator.serviceWorker.controller.postMessage(
        { type, ...data },
        [channel.port2]
      );

      // Timeout après 5 secondes
      setTimeout(() => reject(new Error('SW timeout')), 5000);
    });
  }, []);

  // Sauvegarder brouillon journal
  const saveJournalDraft = useCallback(async (draft: JournalDraft): Promise<boolean> => {
    try {
      await sendToSW('SAVE_JOURNAL_DRAFT', { draft });
      setState(prev => ({
        ...prev,
        pendingJournalDrafts: prev.pendingJournalDrafts + 1,
      }));
      return true;
    } catch {
      // Fallback localStorage
      let drafts: Array<JournalDraft & { savedAt: number }> = [];
      try {
        drafts = JSON.parse(localStorage.getItem('offline_journal_drafts') || '[]');
      } catch {
        // Corrupted data — reset
      }
      drafts.push({ ...draft, savedAt: Date.now() });
      localStorage.setItem('offline_journal_drafts', JSON.stringify(drafts));
      return true;
    }
  }, [sendToSW]);

  // Sauvegarder session respiration
  const saveBreathSession = useCallback(async (session: BreathSession): Promise<boolean> => {
    try {
      await sendToSW('SAVE_BREATH_SESSION', { session });
      setState(prev => ({
        ...prev,
        pendingBreathSessions: prev.pendingBreathSessions + 1,
      }));
      return true;
    } catch {
      // Fallback localStorage
      let sessions: Array<BreathSession & { savedAt: number }> = [];
      try {
        sessions = JSON.parse(localStorage.getItem('offline_breath_sessions') || '[]');
      } catch {
        // Corrupted data — reset
      }
      sessions.push({ ...session, savedAt: Date.now() });
      localStorage.setItem('offline_breath_sessions', JSON.stringify(sessions));
      return true;
    }
  }, [sendToSW]);

  // Récupérer patterns de respiration (toujours disponible)
  const getBreathPatterns = useCallback(async (): Promise<Record<string, BreathPattern>> => {
    try {
      const response = await sendToSW<{ patterns: Record<string, BreathPattern> }>('GET_BREATH_PATTERNS');
      return response.patterns;
    } catch {
      // Fallback patterns hardcodés
      return {
        '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Relaxation' },
        '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4, name: 'Carré' },
        '4-6-8': { inhale: 4, hold: 6, exhale: 8, name: 'Cohérence' },
        '2-0-4': { inhale: 2, hold: 0, exhale: 4, name: 'Calmant' },
      };
    }
  }, [sendToSW]);

  // Demander synchronisation
  const requestSync = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Background Sync API (si disponible)
        const reg = registration as ServiceWorkerRegistration & { 
          sync?: { register: (tag: string) => Promise<void> } 
        };
        
        if (reg.sync) {
          reg.sync.register('sync-journal-drafts');
          reg.sync.register('sync-breath-sessions');
        }
        
        setState(prev => ({
          ...prev,
          lastSyncAt: new Date(),
          pendingJournalDrafts: 0,
          pendingBreathSessions: 0,
        }));
      });
    }
  }, []);

  return {
    state,
    saveJournalDraft,
    saveBreathSession,
    getBreathPatterns,
    requestSync,
  };
};
