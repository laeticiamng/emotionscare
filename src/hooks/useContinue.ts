// @ts-nocheck
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboard.store';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Type de module supporté */
export type ContinueModule =
  | 'story_synth'
  | 'vr_breath'
  | 'music_therapy'
  | 'meditation'
  | 'journal'
  | 'breathing_exercise'
  | 'emotion_scan'
  | 'grit_quest'
  | 'flash_glow';

/** Priorité d'affichage */
export type ContinuePriority = 'high' | 'medium' | 'low';

/** État de progression */
export interface ProgressState {
  current: number;
  total: number;
  percentage: number;
  unit?: string;
}

/** Item continue détaillé */
export interface ContinueItem {
  id: string;
  title: string;
  subtitle: string;
  deeplink: string;
  module: ContinueModule;
  priority: ContinuePriority;
  progress?: ProgressState;
  thumbnailUrl?: string;
  startedAt: Date;
  lastActivityAt: Date;
  estimatedTimeRemaining?: number;
  metadata?: Record<string, unknown>;
}

/** Historique de session */
export interface SessionHistory {
  id: string;
  module: ContinueModule;
  title: string;
  completedAt: Date;
  duration: number;
  completed: boolean;
}

/** Configuration du hook */
export interface UseContinueConfig {
  autoRefresh?: boolean;
  refreshInterval?: number;
  maxItems?: number;
  priorityOrder?: ContinuePriority[];
  enableHistory?: boolean;
  persistState?: boolean;
}

const DEFAULT_CONFIG: UseContinueConfig = {
  autoRefresh: true,
  refreshInterval: 60000,
  maxItems: 5,
  priorityOrder: ['high', 'medium', 'low'],
  enableHistory: true,
  persistState: true
};

const MOCK_CONTINUE_ITEMS: ContinueItem[] = [
  {
    id: 'continue_1',
    title: 'Story Synth',
    subtitle: 'Chapitre 2 - La forêt enchantée',
    deeplink: '/story-synth?resume=chapter2',
    module: 'story_synth',
    priority: 'high',
    progress: { current: 2, total: 5, percentage: 40, unit: 'chapitres' },
    startedAt: new Date(Date.now() - 86400000),
    lastActivityAt: new Date(Date.now() - 3600000),
    estimatedTimeRemaining: 15
  },
  {
    id: 'continue_2',
    title: 'VR Respiration',
    subtitle: 'Session paisible (3 min restantes)',
    deeplink: '/vr-breath?resume=peaceful_3min',
    module: 'vr_breath',
    priority: 'medium',
    progress: { current: 7, total: 10, percentage: 70, unit: 'minutes' },
    startedAt: new Date(Date.now() - 7200000),
    lastActivityAt: new Date(Date.now() - 1800000),
    estimatedTimeRemaining: 3
  },
  {
    id: 'continue_3',
    title: 'Méditation guidée',
    subtitle: 'Relaxation profonde',
    deeplink: '/meditation?resume=deep_relax',
    module: 'meditation',
    priority: 'low',
    progress: { current: 12, total: 20, percentage: 60, unit: 'minutes' },
    startedAt: new Date(Date.now() - 172800000),
    lastActivityAt: new Date(Date.now() - 86400000),
    estimatedTimeRemaining: 8
  }
];

export const useContinue = (config?: Partial<UseContinueConfig>) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const store = useDashboardStore();

  const [items, setItems] = useState<ContinueItem[]>([]);
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Récupérer les items continue
  const fetchContinueItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      store.setLoading('continue', true);

      // Essayer de récupérer depuis Supabase
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user?.id) {
        const { data, error: fetchError } = await supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', userData.user.id)
          .eq('completed', false)
          .order('last_activity_at', { ascending: false })
          .limit(mergedConfig.maxItems!);

        if (!fetchError && data && data.length > 0) {
          const mappedItems: ContinueItem[] = data.map(s => ({
            id: s.id,
            title: s.title || s.module,
            subtitle: s.subtitle || '',
            deeplink: s.deeplink || `/${s.module}`,
            module: s.module as ContinueModule,
            priority: s.priority || 'medium',
            progress: s.progress,
            startedAt: new Date(s.started_at),
            lastActivityAt: new Date(s.last_activity_at),
            estimatedTimeRemaining: s.estimated_time_remaining,
            metadata: s.metadata
          }));

          setItems(mappedItems);
          store.setContinueItem(mappedItems[0] || null);
          setLastFetched(new Date());
          return;
        }
      }

      // Fallback aux données mock
      await new Promise(resolve => setTimeout(resolve, 300));
      const sortedMock = [...MOCK_CONTINUE_ITEMS]
        .sort((a, b) => {
          const priorityA = mergedConfig.priorityOrder!.indexOf(a.priority);
          const priorityB = mergedConfig.priorityOrder!.indexOf(b.priority);
          return priorityA - priorityB;
        })
        .slice(0, mergedConfig.maxItems);

      setItems(sortedMock);
      store.setContinueItem(sortedMock[0] || null);
      setLastFetched(new Date());

    } catch (err) {
      const error = err as Error;
      logger.error('Failed to fetch continue data', error, 'SYSTEM');
      setError(error);
      store.setContinueItem(null);
    } finally {
      setLoading(false);
      store.setLoading('continue', false);
    }
  }, [store, mergedConfig.maxItems, mergedConfig.priorityOrder]);

  // Récupérer l'historique
  const fetchHistory = useCallback(async () => {
    if (!mergedConfig.enableHistory) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setHistory(data.map(s => ({
          id: s.id,
          module: s.module,
          title: s.title,
          completedAt: new Date(s.completed_at),
          duration: s.duration_seconds || 0,
          completed: true
        })));
      }
    } catch (err) {
      logger.error('Failed to fetch session history', err as Error, 'SYSTEM');
    }
  }, [mergedConfig.enableHistory]);

  // Marquer une session comme terminée
  const completeSession = useCallback(async (itemId: string, duration?: number) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return false;

      await supabase
        .from('user_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          duration_seconds: duration
        })
        .eq('id', itemId)
        .eq('user_id', userData.user.id);

      // Retirer de la liste active
      setItems(prev => prev.filter(item => item.id !== itemId));

      // Rafraîchir
      await fetchContinueItems();
      await fetchHistory();

      return true;
    } catch (err) {
      logger.error('Failed to complete session', err as Error, 'SYSTEM');
      return false;
    }
  }, [fetchContinueItems, fetchHistory]);

  // Mettre à jour la progression
  const updateProgress = useCallback(async (
    itemId: string,
    progress: Partial<ProgressState>
  ) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      const item = items.find(i => i.id === itemId);
      if (!item) return;

      const newProgress = { ...item.progress, ...progress };

      await supabase
        .from('user_sessions')
        .update({
          progress: newProgress,
          last_activity_at: new Date().toISOString()
        })
        .eq('id', itemId);

      setItems(prev => prev.map(i =>
        i.id === itemId
          ? { ...i, progress: newProgress as ProgressState, lastActivityAt: new Date() }
          : i
      ));
    } catch (err) {
      logger.error('Failed to update progress', err as Error, 'SYSTEM');
    }
  }, [items]);

  // Reprendre une session
  const resumeSession = useCallback(async (itemId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return null;

      await supabase
        .from('user_sessions')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', itemId);

      const item = items.find(i => i.id === itemId);
      if (item) {
        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'session_resumed', {
            module: item.module,
            progress: item.progress?.percentage
          });
        }
      }

      return item;
    } catch (err) {
      logger.error('Failed to resume session', err as Error, 'SYSTEM');
      return null;
    }
  }, [items]);

  // Supprimer une session
  const dismissSession = useCallback(async (itemId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) {
        // Mode local uniquement
        setItems(prev => prev.filter(i => i.id !== itemId));
        return true;
      }

      await supabase
        .from('user_sessions')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userData.user.id);

      setItems(prev => prev.filter(i => i.id !== itemId));
      return true;
    } catch (err) {
      logger.error('Failed to dismiss session', err as Error, 'SYSTEM');
      return false;
    }
  }, []);

  // Rafraîchir
  const refresh = useCallback(async () => {
    await fetchContinueItems();
    if (mergedConfig.enableHistory) {
      await fetchHistory();
    }
  }, [fetchContinueItems, fetchHistory, mergedConfig.enableHistory]);

  // Item principal
  const primaryItem = useMemo(() => {
    return items[0] || null;
  }, [items]);

  // Items par module
  const itemsByModule = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.module]) acc[item.module] = [];
      acc[item.module].push(item);
      return acc;
    }, {} as Record<ContinueModule, ContinueItem[]>);
  }, [items]);

  // Statistiques
  const stats = useMemo(() => {
    return {
      activeSessionsCount: items.length,
      completedSessionsCount: history.length,
      totalTimeSpent: history.reduce((sum, s) => sum + s.duration, 0),
      mostUsedModule: Object.entries(itemsByModule)
        .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || null,
      averageProgress: items.length > 0
        ? items.reduce((sum, i) => sum + (i.progress?.percentage || 0), 0) / items.length
        : 0
    };
  }, [items, history, itemsByModule]);

  // Chargement initial
  useEffect(() => {
    if (store.continueItem === null && !store.loading.continue) {
      fetchContinueItems();
      if (mergedConfig.enableHistory) {
        fetchHistory();
      }
    }
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!mergedConfig.autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchContinueItems();
    }, mergedConfig.refreshInterval);

    return () => clearInterval(intervalId);
  }, [mergedConfig.autoRefresh, mergedConfig.refreshInterval, fetchContinueItems]);

  return {
    // Items
    item: store.continueItem,
    items,
    primaryItem,
    itemsByModule,

    // État
    loading: loading || store.loading.continue,
    error,
    lastFetched,

    // Historique
    history,

    // Actions
    refresh,
    completeSession,
    updateProgress,
    resumeSession,
    dismissSession,

    // Stats
    stats,

    // Utilitaires
    hasActiveSession: items.length > 0,
    getItemById: (id: string) => items.find(i => i.id === id),
    getItemsByModule: (module: ContinueModule) => itemsByModule[module] || []
  };
};

/** Hook pour un module spécifique */
export function useContinueForModule(module: ContinueModule) {
  const { items, getItemsByModule, ...rest } = useContinue();
  const moduleItems = getItemsByModule(module);

  return {
    ...rest,
    items: moduleItems,
    primaryItem: moduleItems[0] || null,
    hasActiveSession: moduleItems.length > 0
  };
}

export default useContinue;