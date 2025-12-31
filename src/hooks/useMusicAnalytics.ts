/**
 * useMusicAnalytics Hook
 * Statistiques et analytics musicales utilisateur
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { logger } from '@/lib/logger';

export interface MusicStats {
  totalListeningTime: number; // en minutes
  totalTracks: number;
  totalSessions: number;
  averageSessionDuration: number;
  averageMoodImprovement: number;
  favoriteGenres: string[];
  therapeuticEffectiveness: number;
  weeklyActivity: WeeklyActivity[];
  moodTrends: MoodTrend[];
  topTracks: TrackStat[];
  emotionalJourneyStats: EmotionalJourneyStats;
}

export interface WeeklyActivity {
  day: string;
  minutes: number;
  sessions: number;
}

export interface MoodTrend {
  date: string;
  avgMoodBefore: number;
  avgMoodAfter: number;
  improvement: number;
}

export interface TrackStat {
  id: string;
  title: string;
  artist: string;
  playCount: number;
  totalDuration: number;
  avgMoodImpact: number;
}

export interface EmotionalJourneyStats {
  totalPoints: number;
  avgSessionImprovement: number;
  bestSession: {
    date: string;
    improvement: number;
  } | null;
  adaptationCount: number;
}

interface UseMusicAnalyticsOptions {
  period?: 'week' | 'month' | 'year' | 'all';
  enabled?: boolean;
}

export function useMusicAnalytics(options: UseMusicAnalyticsOptions = {}) {
  const { period = 'month', enabled = true } = options;
  const { user } = useAuth();

  // Calcul de la période
  const dateRange = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date('2020-01-01');
    }

    return { start: startDate.toISOString(), end: now.toISOString() };
  }, [period]);

  // Query principale pour les stats
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['music-analytics', user?.id, period],
    queryFn: async (): Promise<MusicStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Fetch sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('music_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Calcul des stats de base
      const totalSessions = sessions?.length || 0;
      const totalListeningTime = Math.round(
        (sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0) / 60
      );
      
      const totalTracks = sessions?.reduce(
        (sum, s) => sum + (Array.isArray(s.tracks_played) ? s.tracks_played.length : 0), 
        0
      ) || 0;

      const averageSessionDuration = totalSessions > 0 
        ? Math.round(totalListeningTime / totalSessions) 
        : 0;

      // Calcul amélioration humeur
      const sessionsWithMood = sessions?.filter(s => s.mood_before && s.mood_after) || [];
      const avgMoodImprovement = sessionsWithMood.length > 0
        ? sessionsWithMood.reduce((sum, s) => sum + ((s.mood_after || 0) - (s.mood_before || 0)), 0) / sessionsWithMood.length
        : 0;

      // Efficacité thérapeutique
      const therapeuticEffectiveness = sessionsWithMood.length > 0
        ? (sessionsWithMood.filter(s => (s.mood_after || 0) > (s.mood_before || 0)).length / sessionsWithMood.length) * 100
        : 0;

      // Activité hebdomadaire
      const weeklyActivity = calculateWeeklyActivity(sessions || []);

      // Tendances humeur
      const moodTrends = calculateMoodTrends(sessions || []);

      // Top tracks (basé sur les tracks_played)
      const topTracks = calculateTopTracks(sessions || []);

      // Stats parcours émotionnel
      const emotionalJourneyStats = calculateEmotionalJourneyStats(sessions || []);

      // Genres favoris (à partir des tags ou playlists)
      const favoriteGenres = extractFavoriteGenres(sessions || []);

      return {
        totalListeningTime,
        totalTracks,
        totalSessions,
        averageSessionDuration,
        averageMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
        favoriteGenres,
        therapeuticEffectiveness: Math.round(therapeuticEffectiveness),
        weeklyActivity,
        moodTrends,
        topTracks,
        emotionalJourneyStats,
      };
    },
    enabled: enabled && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Export des données en CSV
  const exportToCSV = useCallback(async () => {
    if (!stats) return null;

    const csvContent = [
      ['Métrique', 'Valeur'],
      ['Temps d\'écoute total (min)', stats.totalListeningTime],
      ['Nombre de pistes', stats.totalTracks],
      ['Sessions totales', stats.totalSessions],
      ['Durée moyenne session (min)', stats.averageSessionDuration],
      ['Amélioration humeur moyenne', stats.averageMoodImprovement],
      ['Efficacité thérapeutique (%)', stats.therapeuticEffectiveness],
      ['Genres favoris', stats.favoriteGenres.join(', ')],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `music-analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  }, [stats, period]);

  return {
    stats,
    isLoading,
    error: error as Error | null,
    refetch,
    exportToCSV,
    period,
  };
}

// === Fonctions utilitaires ===

function calculateWeeklyActivity(sessions: any[]): WeeklyActivity[] {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const activity: Record<number, { minutes: number; sessions: number }> = {};
  
  // Initialiser tous les jours
  for (let i = 0; i < 7; i++) {
    activity[i] = { minutes: 0, sessions: 0 };
  }

  sessions.forEach(session => {
    const date = new Date(session.created_at);
    const dayIndex = date.getDay();
    activity[dayIndex].minutes += Math.round((session.duration_seconds || 0) / 60);
    activity[dayIndex].sessions += 1;
  });

  return days.map((day, i) => ({
    day,
    minutes: activity[i].minutes,
    sessions: activity[i].sessions,
  }));
}

function calculateMoodTrends(sessions: any[]): MoodTrend[] {
  const groupedByDate: Record<string, any[]> = {};

  sessions.forEach(session => {
    if (!session.mood_before || !session.mood_after) return;
    const date = new Date(session.created_at).toISOString().split('T')[0];
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(session);
  });

  return Object.entries(groupedByDate)
    .map(([date, daySessions]) => {
      const avgBefore = daySessions.reduce((sum, s) => sum + s.mood_before, 0) / daySessions.length;
      const avgAfter = daySessions.reduce((sum, s) => sum + s.mood_after, 0) / daySessions.length;
      return {
        date,
        avgMoodBefore: Math.round(avgBefore),
        avgMoodAfter: Math.round(avgAfter),
        improvement: Math.round(avgAfter - avgBefore),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // 14 derniers jours
}

function calculateTopTracks(sessions: any[]): TrackStat[] {
  const trackStats: Record<string, { count: number; duration: number; moodImpacts: number[] }> = {};

  sessions.forEach(session => {
    const tracks = session.tracks_played || [];
    const moodImpact = (session.mood_after || 0) - (session.mood_before || 0);
    const durationPerTrack = tracks.length > 0 ? (session.duration_seconds || 0) / tracks.length : 0;

    tracks.forEach((trackId: string) => {
      if (!trackStats[trackId]) {
        trackStats[trackId] = { count: 0, duration: 0, moodImpacts: [] };
      }
      trackStats[trackId].count += 1;
      trackStats[trackId].duration += durationPerTrack;
      if (session.mood_before && session.mood_after) {
        trackStats[trackId].moodImpacts.push(moodImpact);
      }
    });
  });

  return Object.entries(trackStats)
    .map(([id, data]) => ({
      id,
      title: `Track ${id.slice(0, 6)}`, // Placeholder, à enrichir avec données réelles
      artist: 'Suno AI',
      playCount: data.count,
      totalDuration: Math.round(data.duration / 60),
      avgMoodImpact: data.moodImpacts.length > 0
        ? Math.round(data.moodImpacts.reduce((a, b) => a + b, 0) / data.moodImpacts.length * 10) / 10
        : 0,
    }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 10);
}

function calculateEmotionalJourneyStats(sessions: any[]): EmotionalJourneyStats {
  const sessionsWithJourney = sessions.filter(s => 
    Array.isArray(s.emotional_journey) && s.emotional_journey.length > 0
  );

  const totalPoints = sessionsWithJourney.reduce(
    (sum, s) => sum + (s.emotional_journey?.length || 0), 
    0
  );

  const improvements = sessionsWithJourney
    .filter(s => s.mood_before && s.mood_after)
    .map(s => (s.mood_after || 0) - (s.mood_before || 0));

  const avgSessionImprovement = improvements.length > 0
    ? Math.round(improvements.reduce((a, b) => a + b, 0) / improvements.length * 10) / 10
    : 0;

  const bestSession = sessionsWithJourney
    .filter(s => s.mood_before && s.mood_after)
    .reduce<{ date: string; improvement: number } | null>((best, session) => {
      const improvement = (session.mood_after || 0) - (session.mood_before || 0);
      if (!best || improvement > best.improvement) {
        return {
          date: new Date(session.created_at).toLocaleDateString('fr-FR'),
          improvement,
        };
      }
      return best;
    }, null);

  const adaptationCount = sessionsWithJourney.reduce(
    (sum, s) => sum + (s.ai_adaptations || 0), 
    0
  );

  return {
    totalPoints,
    avgSessionImprovement,
    bestSession,
    adaptationCount,
  };
}

function extractFavoriteGenres(sessions: any[]): string[] {
  // Genres par défaut basés sur les catégories de vinyles
  const genreCounts: Record<string, number> = {
    'Ambient': 0,
    'Relaxation': 0,
    'Focus': 0,
    'Thérapeutique': 0,
    'Énergisant': 0,
  };

  sessions.forEach(session => {
    // Heuristique basée sur l'heure et les moods
    const hour = new Date(session.created_at).getHours();
    
    if (hour >= 6 && hour < 10) genreCounts['Énergisant'] += 1;
    else if (hour >= 10 && hour < 14) genreCounts['Focus'] += 1;
    else if (hour >= 14 && hour < 18) genreCounts['Ambient'] += 1;
    else if (hour >= 18 && hour < 22) genreCounts['Relaxation'] += 1;
    else genreCounts['Thérapeutique'] += 1;
  });

  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0)
    .slice(0, 4)
    .map(([genre]) => genre);
}

export default useMusicAnalytics;
