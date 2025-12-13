// @ts-nocheck
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Type de classement */
export type LeaderboardType = 'global' | 'monthly' | 'weekly' | 'friends' | 'team';

/** Période du classement */
export type LeaderboardPeriod = 'all_time' | 'this_month' | 'this_week' | 'today';

/** Catégorie de classement */
export type LeaderboardCategory = 'badges' | 'sessions' | 'streaks' | 'points' | 'wellbeing';

/** Entrée du classement */
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  pseudo_anonyme: string;
  avatar_url?: string;
  total_badges: number;
  total_points: number;
  total_sessions: number;
  current_streak: number;
  best_streak: number;
  wellbeing_score: number;
  rank: number | null;
  previous_rank: number | null;
  rank_change: number;
  monthly_badge: boolean;
  zones_completed: any[];
  achievements: string[];
  level: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  last_activity: string;
  created_at: string;
}

/** Statistiques du classement */
export interface LeaderboardStats {
  totalParticipants: number;
  averageBadges: number;
  averagePoints: number;
  topPerformer: LeaderboardEntry | null;
  myPercentile: number;
  myRankChange: number;
}

/** Configuration du hook */
export interface LeaderboardConfig {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  category: LeaderboardCategory;
  limit: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

/** Filtre du classement */
export interface LeaderboardFilter {
  minLevel?: number;
  maxLevel?: number;
  tier?: string;
  hasAchievement?: string;
  teamId?: string;
}

const DEFAULT_CONFIG: LeaderboardConfig = {
  type: 'global',
  period: 'all_time',
  category: 'badges',
  limit: 100,
  autoRefresh: true,
  refreshInterval: 60000
};

/** Calcule le tier basé sur les points */
const calculateTier = (points: number): LeaderboardEntry['tier'] => {
  if (points >= 10000) return 'diamond';
  if (points >= 5000) return 'platinum';
  if (points >= 2000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
};

/** Calcule le niveau basé sur les points */
const calculateLevel = (points: number): number => {
  return Math.floor(Math.sqrt(points / 100)) + 1;
};

export const useLeaderboard = (config?: Partial<LeaderboardConfig>) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeaderboardFilter>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /** Récupérer le classement */
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('user_leaderboard')
        .select('*');

      // Appliquer les filtres de période
      if (mergedConfig.period === 'this_month') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        query = query.gte('last_activity', startOfMonth.toISOString());
      } else if (mergedConfig.period === 'this_week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        query = query.gte('last_activity', startOfWeek.toISOString());
      } else if (mergedConfig.period === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        query = query.gte('last_activity', startOfDay.toISOString());
      }

      // Appliquer les filtres personnalisés
      if (filter.minLevel) {
        query = query.gte('level', filter.minLevel);
      }
      if (filter.maxLevel) {
        query = query.lte('level', filter.maxLevel);
      }
      if (filter.teamId) {
        query = query.eq('team_id', filter.teamId);
      }

      // Trier par catégorie
      const orderColumn = {
        badges: 'total_badges',
        sessions: 'total_sessions',
        streaks: 'current_streak',
        points: 'total_points',
        wellbeing: 'wellbeing_score'
      }[mergedConfig.category] || 'total_badges';

      query = query.order(orderColumn, { ascending: false }).limit(mergedConfig.limit);

      const { data: topEntries, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Enrichir les entrées
      const enrichedEntries = (topEntries || []).map((entry, index) => ({
        ...entry,
        rank: index + 1,
        rank_change: entry.previous_rank ? entry.previous_rank - (index + 1) : 0,
        tier: calculateTier(entry.total_points || 0),
        level: calculateLevel(entry.total_points || 0)
      }));

      setEntries(enrichedEntries);

      // Récupérer l'entrée de l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userEntry, error: userError } = await supabase
          .from('user_leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          logger.error('Error fetching user entry:', userError, 'HOOK');
        } else if (userEntry) {
          const userRank = enrichedEntries.findIndex(e => e.user_id === user.id) + 1;
          setMyEntry({
            ...userEntry,
            rank: userRank || null,
            rank_change: userEntry.previous_rank ? userEntry.previous_rank - userRank : 0,
            tier: calculateTier(userEntry.total_points || 0),
            level: calculateLevel(userEntry.total_points || 0)
          });
        }
      }

      // Calculer les statistiques
      if (enrichedEntries.length > 0) {
        const totalBadges = enrichedEntries.reduce((sum, e) => sum + (e.total_badges || 0), 0);
        const totalPoints = enrichedEntries.reduce((sum, e) => sum + (e.total_points || 0), 0);

        setStats({
          totalParticipants: enrichedEntries.length,
          averageBadges: Math.round(totalBadges / enrichedEntries.length),
          averagePoints: Math.round(totalPoints / enrichedEntries.length),
          topPerformer: enrichedEntries[0] || null,
          myPercentile: myEntry?.rank ? Math.round((1 - myEntry.rank / enrichedEntries.length) * 100) : 0,
          myRankChange: myEntry?.rank_change || 0
        });
      }

      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      logger.error('Error fetching leaderboard:', err, 'HOOK');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [mergedConfig, filter]);

  /** Mettre à jour l'entrée de l'utilisateur */
  const updateMyEntry = useCallback(async (totalBadges: number, zonesCompleted: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('user_leaderboard')
        .select('id, pseudo_anonyme, previous_rank, rank')
        .eq('user_id', user.id)
        .single();

      const updateData = {
        total_badges: totalBadges,
        zones_completed: zonesCompleted,
        last_updated: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        previous_rank: existing?.rank || null
      };

      if (existing) {
        const { data, error } = await supabase
          .from('user_leaderboard')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setMyEntry({
          ...data,
          tier: calculateTier(data.total_points || 0),
          level: calculateLevel(data.total_points || 0)
        });
      } else {
        const { data: pseudoData, error: pseudoError } = await supabase
          .rpc('generate_anonymous_pseudo');

        if (pseudoError) throw pseudoError;

        const { data, error } = await supabase
          .from('user_leaderboard')
          .insert({
            user_id: user.id,
            pseudo_anonyme: pseudoData || `User${Math.floor(Math.random() * 9999)}`,
            total_badges: totalBadges,
            zones_completed: zonesCompleted,
            total_points: 0,
            total_sessions: 0,
            current_streak: 0
          })
          .select()
          .single();

        if (error) throw error;
        setMyEntry({
          ...data,
          tier: calculateTier(0),
          level: calculateLevel(0)
        });
      }

      await supabase.functions.invoke('calculate-rankings');
      await fetchLeaderboard();
    } catch (err: any) {
      logger.error('Error updating leaderboard entry:', err, 'HOOK');
      setError(err.message);
    }
  }, [fetchLeaderboard]);

  /** Ajouter des points */
  const addPoints = useCallback(async (points: number, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: current } = await supabase
        .from('user_leaderboard')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      const newPoints = (current?.total_points || 0) + points;

      await supabase
        .from('user_leaderboard')
        .update({
          total_points: newPoints,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id);

      // Enregistrer l'historique des points
      await supabase.from('points_history').insert({
        user_id: user.id,
        points,
        reason,
        created_at: new Date().toISOString()
      });

      await fetchLeaderboard();
    } catch (err: any) {
      logger.error('Error adding points:', err, 'HOOK');
    }
  }, [fetchLeaderboard]);

  /** Mettre à jour le streak */
  const updateStreak = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: current } = await supabase
        .from('user_leaderboard')
        .select('current_streak, best_streak, last_activity')
        .eq('user_id', user.id)
        .single();

      if (!current) return;

      const lastActivity = new Date(current.last_activity);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      let newStreak = current.current_streak;
      if (diffDays <= 1) {
        newStreak = current.current_streak + 1;
      } else {
        newStreak = 1;
      }

      await supabase
        .from('user_leaderboard')
        .update({
          current_streak: newStreak,
          best_streak: Math.max(newStreak, current.best_streak),
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id);

      await fetchLeaderboard();
    } catch (err: any) {
      logger.error('Error updating streak:', err, 'HOOK');
    }
  }, [fetchLeaderboard]);

  /** Récupérer les voisins de rang */
  const getNearbyRanks = useCallback(async (range: number = 3): Promise<LeaderboardEntry[]> => {
    if (!myEntry?.rank) return [];

    const startRank = Math.max(1, myEntry.rank - range);
    const endRank = myEntry.rank + range;

    return entries.filter(e => e.rank && e.rank >= startRank && e.rank <= endRank);
  }, [myEntry, entries]);

  /** Entrées filtrées */
  const filteredEntries = useMemo(() => {
    let result = entries;

    if (filter.tier) {
      result = result.filter(e => e.tier === filter.tier);
    }

    return result;
  }, [entries, filter]);

  /** Top 3 */
  const podium = useMemo(() => {
    return entries.slice(0, 3);
  }, [entries]);

  // Charger au montage
  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_leaderboard'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  // Auto-refresh
  useEffect(() => {
    if (!mergedConfig.autoRefresh) return;

    const interval = setInterval(fetchLeaderboard, mergedConfig.refreshInterval);
    return () => clearInterval(interval);
  }, [mergedConfig.autoRefresh, mergedConfig.refreshInterval, fetchLeaderboard]);

  return {
    // Données
    entries: filteredEntries,
    myEntry,
    stats,
    podium,
    loading,
    error,
    lastUpdated,

    // Actions
    updateMyEntry,
    addPoints,
    updateStreak,
    refresh: fetchLeaderboard,

    // Filtres
    filter,
    setFilter,

    // Utilitaires
    getNearbyRanks,
    calculateTier,
    calculateLevel
  };
};
