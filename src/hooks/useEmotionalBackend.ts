/**
 * Hook React pour utiliser l'API Backend Émotionnelle
 *
 * @module useEmotionalBackend
 * @version 1.0.0
 * @created 2025-11-14
 */

import { useState, useCallback, useEffect } from 'react';
import {
  EmotionalBackendService,
  Achievement,
  EmotionalStats,
  EmotionalPattern,
  EmotionalInsight,
  EmotionalTrend,
  DashboardSummary,
  LeaderboardEntry,
} from '@/services/EmotionalBackendService';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface UseEmotionalBackendOptions {
  autoLoad?: boolean; // Charger automatiquement au montage (défaut: false)
  showErrorToast?: boolean; // Afficher toast en cas d'erreur (défaut: true)
  onNewAchievement?: (achievement: Achievement) => void;
}

export interface UseEmotionalBackendReturn {
  // État
  stats: EmotionalStats | null;
  achievements: Achievement[];
  insights: EmotionalInsight[];
  patterns: EmotionalPattern[];
  trends: EmotionalTrend[];
  dashboard: DashboardSummary | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: Error | null;

  // Méthodes - Stats
  loadStats: () => Promise<void>;
  refreshStats: () => Promise<void>;

  // Méthodes - Achievements
  loadAchievements: () => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  getNewAchievements: () => Promise<Achievement[]>;
  getNextAchievements: () => Promise<any[]>;

  // Méthodes - Dashboard
  loadDashboard: () => Promise<void>;
  loadDashboardOverview: () => Promise<void>;

  // Méthodes - Insights
  loadInsights: (unreadOnly?: boolean) => Promise<void>;
  markInsightAsRead: (insightId: string) => Promise<void>;
  generateInsights: () => Promise<EmotionalInsight[]>;

  // Méthodes - Patterns
  loadPatterns: () => Promise<void>;

  // Méthodes - Trends
  loadTrends: (period?: 'day' | 'week' | 'month' | 'year') => Promise<void>;

  // Méthodes - Leaderboard
  loadLeaderboard: (limit?: number) => Promise<void>;

  // Utilitaires
  reset: () => void;
}

/**
 * Hook pour utiliser l'API Backend Émotionnelle
 *
 * @example
 * ```tsx
 * const {
 *   stats,
 *   achievements,
 *   loadStats,
 *   checkAchievements,
 *   isLoading
 * } = useEmotionalBackend({ autoLoad: true });
 *
 * // Charger les stats
 * useEffect(() => {
 *   loadStats();
 * }, []);
 *
 * // Vérifier les achievements
 * const handleAfterScan = async () => {
 *   const newAchievements = await checkAchievements();
 *   if (newAchievements.length > 0) {
 *     toast({ title: `${newAchievements.length} nouveau(x) achievement(s) !` });
 *   }
 * };
 * ```
 */
export function useEmotionalBackend(
  options: UseEmotionalBackendOptions = {}
): UseEmotionalBackendReturn {
  const {
    autoLoad = false,
    showErrorToast = true,
    onNewAchievement,
  } = options;

  const { toast } = useToast();

  // État
  const [stats, setStats] = useState<EmotionalStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [insights, setInsights] = useState<EmotionalInsight[]>([]);
  const [patterns, setPatterns] = useState<EmotionalPattern[]>([]);
  const [trends, setTrends] = useState<EmotionalTrend[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Gère les erreurs
   */
  const handleError = useCallback(
    (err: Error, context: string) => {
      setError(err);
      logger.error(`useEmotionalBackend: ${context}`, err, 'BACKEND_HOOK');

      if (showErrorToast) {
        toast({
          title: 'Erreur',
          description: err.message,
          variant: 'destructive',
        });
      }
    },
    [showErrorToast, toast]
  );

  /**
   * Charger les statistiques
   */
  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EmotionalBackendService.getStats();
      setStats(data);
    } catch (err) {
      handleError(err as Error, 'loadStats');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Rafraîchir les statistiques
   */
  const refreshStats = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  /**
   * Charger les achievements
   */
  const loadAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EmotionalBackendService.getAchievements();
      setAchievements(data);
    } catch (err) {
      handleError(err as Error, 'loadAchievements');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Vérifier et débloquer les achievements
   */
  const checkAchievements = useCallback(async (): Promise<Achievement[]> => {
    try {
      const data = await EmotionalBackendService.checkAchievements();
      setAchievements(data);

      // Notifier les nouveaux achievements
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const newAchievements = data.filter(a => new Date(a.unlocked_at) > yesterday);

      newAchievements.forEach(achievement => {
        onNewAchievement?.(achievement);
      });

      return data;
    } catch (err) {
      handleError(err as Error, 'checkAchievements');
      return [];
    }
  }, [handleError, onNewAchievement]);

  /**
   * Récupérer les nouveaux achievements
   */
  const getNewAchievements = useCallback(async (): Promise<Achievement[]> => {
    try {
      return await EmotionalBackendService.getNewAchievements();
    } catch (err) {
      handleError(err as Error, 'getNewAchievements');
      return [];
    }
  }, [handleError]);

  /**
   * Récupérer les prochains achievements à débloquer
   */
  const getNextAchievements = useCallback(async () => {
    if (!stats) {
      return [];
    }

    try {
      return await EmotionalBackendService.getNextAchievements(stats);
    } catch (err) {
      handleError(err as Error, 'getNextAchievements');
      return [];
    }
  }, [stats, handleError]);

  /**
   * Charger le dashboard
   */
  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EmotionalBackendService.getDashboard();
      setDashboard(data);
    } catch (err) {
      handleError(err as Error, 'loadDashboard');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Charger le dashboard complet (overview)
   */
  const loadDashboardOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EmotionalBackendService.getDashboardOverview();
      setStats(data.stats);
      setAchievements(data.achievements);
      setInsights(data.insights);
      setPatterns(data.patterns);
      setDashboard(data.dashboard);
    } catch (err) {
      handleError(err as Error, 'loadDashboardOverview');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Charger les insights
   */
  const loadInsights = useCallback(
    async (unreadOnly = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await EmotionalBackendService.getInsights(unreadOnly);
        setInsights(data);
      } catch (err) {
        handleError(err as Error, 'loadInsights');
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  /**
   * Marquer un insight comme lu
   */
  const markInsightAsRead = useCallback(
    async (insightId: string) => {
      try {
        const updatedInsight = await EmotionalBackendService.markInsightAsRead(insightId);

        // Mettre à jour l'état local
        setInsights(prev =>
          prev.map(insight => (insight.id === insightId ? updatedInsight : insight))
        );
      } catch (err) {
        handleError(err as Error, 'markInsightAsRead');
      }
    },
    [handleError]
  );

  /**
   * Générer des insights
   */
  const generateInsights = useCallback(async (): Promise<EmotionalInsight[]> => {
    try {
      const data = await EmotionalBackendService.generateInsights();
      setInsights(prev => [...data, ...prev]);
      return data;
    } catch (err) {
      handleError(err as Error, 'generateInsights');
      return [];
    }
  }, [handleError]);

  /**
   * Charger les patterns
   */
  const loadPatterns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await EmotionalBackendService.getPatterns();
      setPatterns(data);
    } catch (err) {
      handleError(err as Error, 'loadPatterns');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  /**
   * Charger les tendances
   */
  const loadTrends = useCallback(
    async (period: 'day' | 'week' | 'month' | 'year' = 'week') => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await EmotionalBackendService.getTrends(period);
        setTrends(data);
      } catch (err) {
        handleError(err as Error, 'loadTrends');
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  /**
   * Charger le leaderboard
   */
  const loadLeaderboard = useCallback(
    async (limit = 10) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await EmotionalBackendService.getLeaderboard(limit);
        setLeaderboard(data);
      } catch (err) {
        handleError(err as Error, 'loadLeaderboard');
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setStats(null);
    setAchievements([]);
    setInsights([]);
    setPatterns([]);
    setTrends([]);
    setDashboard(null);
    setLeaderboard([]);
    setError(null);
    setIsLoading(false);
  }, []);

  // Auto-load au montage si demandé
  useEffect(() => {
    if (autoLoad) {
      loadDashboardOverview();
    }
  }, [autoLoad, loadDashboardOverview]);

  return {
    // État
    stats,
    achievements,
    insights,
    patterns,
    trends,
    dashboard,
    leaderboard,
    isLoading,
    error,

    // Méthodes
    loadStats,
    refreshStats,
    loadAchievements,
    checkAchievements,
    getNewAchievements,
    getNextAchievements,
    loadDashboard,
    loadDashboardOverview,
    loadInsights,
    markInsightAsRead,
    generateInsights,
    loadPatterns,
    loadTrends,
    loadLeaderboard,
    reset,
  };
}

/**
 * Hook simplifié pour récupérer uniquement les stats
 */
export function useEmotionalStats() {
  const { stats, loadStats, isLoading, error } = useEmotionalBackend();
  return { stats, loadStats, isLoading, error };
}

/**
 * Hook simplifié pour récupérer uniquement les achievements
 */
export function useEmotionalAchievements() {
  const { achievements, loadAchievements, checkAchievements, isLoading, error } = useEmotionalBackend();
  return { achievements, loadAchievements, checkAchievements, isLoading, error };
}

/**
 * Hook simplifié pour récupérer uniquement les insights
 */
export function useEmotionalInsights() {
  const { insights, loadInsights, markInsightAsRead, generateInsights, isLoading, error } =
    useEmotionalBackend();
  return { insights, loadInsights, markInsightAsRead, generateInsights, isLoading, error };
}
