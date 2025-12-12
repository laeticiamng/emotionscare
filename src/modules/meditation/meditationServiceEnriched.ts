/**
 * Meditation Service ENRICHED - API calls et business logic avancée
 * Version enrichie avec achievements, recommandations personnalisées, export
 */

import { supabase } from '@/integrations/supabase/client';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import type {
  CreateMeditationSession,
  CompleteMeditationSession,
  MeditationSession,
  MeditationStats,
  MeditationTechnique,
  SessionCompletionData,
} from './types';

// ─────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS
// ─────────────────────────────────────────────────────────────

const ACHIEVEMENTS_KEY = 'meditation-achievements';
const FAVORITES_KEY = 'meditation-favorites';
const LOCAL_STATS_KEY = 'meditation-local-stats';
const GOALS_KEY = 'meditation-goals';

// ─────────────────────────────────────────────────────────────
// TYPES ENRICHIS
// ─────────────────────────────────────────────────────────────

export interface MeditationAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  target: number;
  category: 'streak' | 'duration' | 'technique' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface MeditationGoal {
  id: string;
  type: 'weekly_sessions' | 'weekly_minutes' | 'daily_streak' | 'mood_improvement';
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  completed: boolean;
}

export interface FavoriteTechnique {
  technique: MeditationTechnique;
  savedAt: string;
  notes?: string;
  preferredDuration?: number;
}

export interface MeditationRecommendation {
  technique: MeditationTechnique;
  duration: number;
  reason: string;
  confidence: number;
  basedOn: 'time' | 'mood' | 'history' | 'goal';
}

export interface EnrichedMeditationStats extends MeditationStats {
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  achievements: MeditationAchievement[];
  recommendations: MeditationRecommendation[];
  techniquesExplored: MeditationTechnique[];
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  consistencyScore: number;
  moodImpactScore: number;
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS DEFINITIONS
// ─────────────────────────────────────────────────────────────

const ACHIEVEMENT_DEFINITIONS: Omit<MeditationAchievement, 'progress' | 'unlockedAt'>[] = [
  // Streak achievements
  { id: 'streak_3', name: 'Débutant Zen', description: '3 jours consécutifs', icon: '🌱', target: 3, category: 'streak', rarity: 'common' },
  { id: 'streak_7', name: 'Semaine Sereine', description: '7 jours consécutifs', icon: '🌿', target: 7, category: 'streak', rarity: 'rare' },
  { id: 'streak_30', name: 'Moine du Mois', description: '30 jours consécutifs', icon: '🧘', target: 30, category: 'streak', rarity: 'epic' },
  { id: 'streak_100', name: 'Maître Zen', description: '100 jours consécutifs', icon: '✨', target: 100, category: 'streak', rarity: 'legendary' },
  
  // Duration achievements
  { id: 'duration_1h', name: 'Première Heure', description: '1 heure totale', icon: '⏱️', target: 60, category: 'duration', rarity: 'common' },
  { id: 'duration_10h', name: 'Pratiquant Régulier', description: '10 heures totales', icon: '🕐', target: 600, category: 'duration', rarity: 'rare' },
  { id: 'duration_100h', name: 'Dédié', description: '100 heures totales', icon: '🌟', target: 6000, category: 'duration', rarity: 'epic' },
  
  // Technique achievements
  { id: 'technique_5', name: 'Explorateur', description: '5 techniques essayées', icon: '🧭', target: 5, category: 'technique', rarity: 'rare' },
  { id: 'technique_all', name: 'Maître Polyvalent', description: 'Toutes les techniques', icon: '🎯', target: 10, category: 'technique', rarity: 'legendary' },
  
  // Milestone achievements
  { id: 'sessions_10', name: 'Démarrage', description: '10 sessions complétées', icon: '🏃', target: 10, category: 'milestone', rarity: 'common' },
  { id: 'sessions_50', name: 'Habitué', description: '50 sessions complétées', icon: '🏅', target: 50, category: 'milestone', rarity: 'rare' },
  { id: 'sessions_200', name: 'Vétéran', description: '200 sessions complétées', icon: '🏆', target: 200, category: 'milestone', rarity: 'epic' },
];

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key: string, data: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

function calculateStreaks(sessions: { completed_at?: string; created_at: string }[]): { currentStreak: number; longestStreak: number } {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sessionsByDate = sessions.reduce((acc, s) => {
    const date = new Date(s.completed_at || s.created_at).toDateString();
    acc[date] = true;
    return acc;
  }, {} as Record<string, boolean>);

  const dates = Object.keys(sessionsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate = new Date(dates[0]);

  for (const dateStr of dates) {
    const date = new Date(dateStr);
    const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
      tempStreak++;
      if (currentStreak === 0) currentStreak = tempStreak;
    } else {
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      tempStreak = 1;
    }

    lastDate = date;
  }

  if (tempStreak > longestStreak) longestStreak = tempStreak;

  return { currentStreak, longestStreak };
}

// ─────────────────────────────────────────────────────────────
// ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

export function getAchievements(): MeditationAchievement[] {
  return loadFromStorage<MeditationAchievement[]>(ACHIEVEMENTS_KEY, 
    ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, progress: 0 }))
  );
}

export async function updateAchievements(): Promise<MeditationAchievement[]> {
  const stats = await meditationServiceEnriched.getStats();
  const achievements = getAchievements();
  const sessions = await meditationServiceEnriched.getRecentSessions(1000);
  
  const techniques = new Set(sessions.map(s => s.technique));
  const { currentStreak } = calculateStreaks(sessions as any);
  
  const updated = achievements.map(achievement => {
    let progress = achievement.progress;
    
    switch (achievement.category) {
      case 'streak':
        progress = currentStreak;
        break;
      case 'duration':
        progress = stats.totalDuration / 60; // in minutes
        break;
      case 'technique':
        progress = techniques.size;
        break;
      case 'milestone':
        progress = stats.totalSessions;
        break;
    }
    
    const unlocked = progress >= achievement.target && !achievement.unlockedAt;
    
    return {
      ...achievement,
      progress,
      unlockedAt: unlocked ? new Date().toISOString() : achievement.unlockedAt,
    };
  });
  
  saveToStorage(ACHIEVEMENTS_KEY, updated);
  return updated;
}

export function checkNewAchievements(): MeditationAchievement[] {
  const achievements = getAchievements();
  return achievements.filter(a => {
    const wasUnlocked = a.unlockedAt;
    const now = new Date();
    const unlockedDate = wasUnlocked ? new Date(wasUnlocked) : null;
    return unlockedDate && (now.getTime() - unlockedDate.getTime()) < 60000; // Last minute
  });
}

// ─────────────────────────────────────────────────────────────
// FAVORITES
// ─────────────────────────────────────────────────────────────

export function getFavorites(): FavoriteTechnique[] {
  return loadFromStorage<FavoriteTechnique[]>(FAVORITES_KEY, []);
}

export function addToFavorites(technique: MeditationTechnique, notes?: string, preferredDuration?: number): void {
  const favorites = getFavorites();
  if (!favorites.some(f => f.technique === technique)) {
    favorites.push({
      technique,
      savedAt: new Date().toISOString(),
      notes,
      preferredDuration,
    });
    saveToStorage(FAVORITES_KEY, favorites);
  }
}

export function removeFromFavorites(technique: MeditationTechnique): void {
  const favorites = getFavorites();
  saveToStorage(FAVORITES_KEY, favorites.filter(f => f.technique !== technique));
}

export function isFavorite(technique: MeditationTechnique): boolean {
  return getFavorites().some(f => f.technique === technique);
}

// ─────────────────────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────────────────────

export function getGoals(): MeditationGoal[] {
  return loadFromStorage<MeditationGoal[]>(GOALS_KEY, []);
}

export function setGoal(goal: Omit<MeditationGoal, 'id' | 'current' | 'completed'>): MeditationGoal {
  const goals = getGoals();
  const newGoal: MeditationGoal = {
    ...goal,
    id: `goal_${Date.now()}`,
    current: 0,
    completed: false,
  };
  saveToStorage(GOALS_KEY, [...goals, newGoal]);
  return newGoal;
}

export async function updateGoalProgress(): Promise<MeditationGoal[]> {
  const goals = getGoals();
  const stats = await meditationServiceEnriched.getStats();
  const sessions = await meditationServiceEnriched.getRecentSessions(100);
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklySessions = sessions.filter(s => new Date(s.createdAt) >= weekAgo);
  const weeklyMinutes = weeklySessions.reduce((sum, s) => sum + (s.completedDuration || 0), 0) / 60;
  
  const updated = goals.map(goal => {
    let current = goal.current;
    
    switch (goal.type) {
      case 'weekly_sessions':
        current = weeklySessions.length;
        break;
      case 'weekly_minutes':
        current = weeklyMinutes;
        break;
      case 'daily_streak':
        current = stats.currentStreak;
        break;
      case 'mood_improvement':
        current = stats.avgMoodDelta !== null ? stats.avgMoodDelta * 10 : 0;
        break;
    }
    
    return {
      ...goal,
      current,
      completed: current >= goal.target,
    };
  });
  
  saveToStorage(GOALS_KEY, updated);
  return updated;
}

// ─────────────────────────────────────────────────────────────
// RECOMMENDATIONS
// ─────────────────────────────────────────────────────────────

export async function getRecommendations(options?: {
  currentMood?: number;
  availableTime?: number;
}): Promise<MeditationRecommendation[]> {
  const stats = await meditationServiceEnriched.getStats();
  const favorites = getFavorites();
  const recommendations: MeditationRecommendation[] = [];
  
  const hour = new Date().getHours();
  const availableTime = options?.availableTime || 15;
  
  // Time-based recommendations
  if (hour >= 6 && hour < 10) {
    recommendations.push({
      technique: 'body-scan',
      duration: Math.min(availableTime, 10),
      reason: 'Le scan corporel est idéal pour commencer la journée en pleine conscience',
      confidence: 0.85,
      basedOn: 'time',
    });
  } else if (hour >= 12 && hour < 14) {
    recommendations.push({
      technique: 'breath-focus',
      duration: Math.min(availableTime, 5),
      reason: 'Une courte pause respiration pour se recentrer en milieu de journée',
      confidence: 0.8,
      basedOn: 'time',
    });
  } else if (hour >= 18 && hour < 22) {
    recommendations.push({
      technique: 'loving-kindness',
      duration: Math.min(availableTime, 15),
      reason: 'La méditation de bienveillance aide à relâcher les tensions de la journée',
      confidence: 0.85,
      basedOn: 'time',
    });
  } else if (hour >= 22 || hour < 6) {
    recommendations.push({
      technique: 'body-scan',
      duration: Math.min(availableTime, 20),
      reason: 'Le scan corporel favorise un sommeil réparateur',
      confidence: 0.9,
      basedOn: 'time',
    });
  }
  
  // Mood-based recommendations
  if (options?.currentMood !== undefined) {
    if (options.currentMood < 4) {
      recommendations.push({
        technique: 'loving-kindness',
        duration: 15,
        reason: 'La méditation de bienveillance peut aider à améliorer votre humeur',
        confidence: 0.9,
        basedOn: 'mood',
      });
    } else if (options.currentMood < 6) {
      recommendations.push({
        technique: 'mindfulness',
        duration: 10,
        reason: 'La pleine conscience aide à accueillir les émotions présentes',
        confidence: 0.85,
        basedOn: 'mood',
      });
    }
  }
  }
  
  // History-based - favorite technique
  if (stats.favoriteTechnique) {
    recommendations.push({
      technique: stats.favoriteTechnique,
      duration: Math.round(stats.averageDuration / 60),
      reason: 'Votre technique préférée basée sur vos habitudes',
      confidence: 0.95,
      basedOn: 'history',
    });
  }
  
  // Favorites-based
  if (favorites.length > 0) {
    const fav = favorites[0];
    recommendations.push({
      technique: fav.technique,
      duration: fav.preferredDuration || 10,
      reason: 'Une de vos techniques favorites',
      confidence: 0.9,
      basedOn: 'history',
    });
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 4);
}

// ─────────────────────────────────────────────────────────────
// EXPORT DATA
// ─────────────────────────────────────────────────────────────

export async function exportUserData(): Promise<{
  stats: MeditationStats;
  achievements: MeditationAchievement[];
  favorites: FavoriteTechnique[];
  goals: MeditationGoal[];
  sessions: MeditationSession[];
  exportedAt: string;
}> {
  const stats = await meditationServiceEnriched.getStats();
  const achievements = getAchievements();
  const favorites = getFavorites();
  const goals = getGoals();
  const sessions = await meditationServiceEnriched.getRecentSessions(100);
  
  return {
    stats,
    achievements,
    favorites,
    goals,
    sessions,
    exportedAt: new Date().toISOString(),
  };
}

export function downloadExport(data: Awaited<ReturnType<typeof exportUserData>>): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meditation-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// ENRICHED SERVICE (extends original)
// ─────────────────────────────────────────────────────────────

export const meditationServiceEnriched = {
  /**
   * Créer une nouvelle session de méditation
   */
  async createSession(data: CreateMeditationSession): Promise<MeditationSession> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const sessionData = {
        user_id: user.id,
        technique: data.technique,
        duration: data.duration * 60,
        mood_before: data.moodBefore ?? null,
        with_guidance: data.withGuidance,
        with_music: data.withMusic,
        completed: false,
      };

      const { data: session, error } = await supabase
        .from('meditation_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      Sentry.addBreadcrumb({
        category: 'meditation',
        message: 'Session created',
        data: { technique: data.technique, duration: data.duration },
      });

      return {
        id: session.id,
        userId: session.user_id,
        technique: session.technique as MeditationTechnique,
        duration: session.duration,
        completedDuration: session.completed_duration || 0,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        moodDelta: session.mood_delta,
        withGuidance: session.with_guidance,
        withMusic: session.with_music,
        completed: session.completed,
        createdAt: session.created_at,
        completedAt: session.completed_at,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Compléter une session de méditation
   */
  async completeSession(data: CompleteMeditationSession): Promise<MeditationSession> {
    try {
      const updateData: SessionCompletionData = {
        completed: true,
        completed_duration: data.completedDuration,
        completed_at: new Date().toISOString(),
      };

      if (data.moodAfter !== undefined) {
        updateData.mood_after = data.moodAfter;
      }

      const { data: session, error } = await supabase
        .from('meditation_sessions')
        .update(updateData)
        .eq('id', data.sessionId)
        .select()
        .single();

      if (error) throw error;

      if (session.mood_before !== null && session.mood_after !== null) {
        const moodDelta = session.mood_after - session.mood_before;
        await supabase
          .from('meditation_sessions')
          .update({ mood_delta: moodDelta })
          .eq('id', data.sessionId);
      }

      // Update achievements after session completion
      await updateAchievements();
      await updateGoalProgress();

      Sentry.addBreadcrumb({
        category: 'meditation',
        message: 'Session completed',
        data: { 
          sessionId: data.sessionId, 
          duration: data.completedDuration,
          moodDelta: session.mood_delta 
        },
      });

      return {
        id: session.id,
        userId: session.user_id,
        technique: session.technique as MeditationTechnique,
        duration: session.duration,
        completedDuration: session.completed_duration,
        moodBefore: session.mood_before,
        moodAfter: session.mood_after,
        moodDelta: session.mood_delta,
        withGuidance: session.with_guidance,
        withMusic: session.with_music,
        completed: session.completed,
        createdAt: session.created_at,
        completedAt: session.completed_at,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Obtenir les statistiques utilisateur
   */
  async getStats(): Promise<MeditationStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const completedSessions = sessions?.filter(s => s.completed) || [];
      const totalSessions = completedSessions.length;
      
      if (totalSessions === 0) {
        return {
          totalSessions: 0,
          totalDuration: 0,
          averageDuration: 0,
          favoriteTechnique: null,
          completionRate: 0,
          currentStreak: 0,
          longestStreak: 0,
          avgMoodDelta: null,
        };
      }

      const totalDuration = completedSessions.reduce((sum, s) => sum + (s.completed_duration || 0), 0);
      const averageDuration = totalDuration / totalSessions;

      const techniqueCounts = completedSessions.reduce((acc, s) => {
        acc[s.technique] = (acc[s.technique] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const entries = Object.entries(techniqueCounts) as Array<[string, number]>;
      const topTechnique = entries.sort((a, b) => b[1] - a[1])[0];
      const favoriteTechnique = topTechnique ? topTechnique[0] as MeditationTechnique : null;

      const allSessions = sessions?.length || 0;
      const completionRate = allSessions > 0 ? (totalSessions / allSessions) * 100 : 0;

      const moodDeltas = completedSessions
        .filter(s => s.mood_delta !== null)
        .map(s => s.mood_delta);
      const avgMoodDelta = moodDeltas.length > 0
        ? moodDeltas.reduce((sum, d) => sum + d, 0) / moodDeltas.length
        : null;

      const { currentStreak, longestStreak } = calculateStreaks(completedSessions);

      return {
        totalSessions,
        totalDuration,
        averageDuration,
        favoriteTechnique: favoriteTechnique || null,
        completionRate,
        currentStreak,
        longestStreak,
        avgMoodDelta,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  /**
   * Récupérer les sessions récentes
   */
  async getRecentSessions(limit: number = 10): Promise<MeditationSession[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: sessions, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (sessions || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        technique: s.technique as MeditationTechnique,
        duration: s.duration,
        completedDuration: s.completed_duration || 0,
        moodBefore: s.mood_before,
        moodAfter: s.mood_after,
        moodDelta: s.mood_delta,
        withGuidance: s.with_guidance,
        withMusic: s.with_music,
        completed: s.completed,
        createdAt: s.created_at,
        completedAt: s.completed_at,
      }));
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  },

  // Enriched methods
  getAchievements,
  updateAchievements,
  checkNewAchievements,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getGoals,
  setGoal,
  updateGoalProgress,
  getRecommendations,
  exportUserData,
  downloadExport,
};
