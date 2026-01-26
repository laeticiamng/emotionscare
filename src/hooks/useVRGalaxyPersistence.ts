/**
 * Hook de persistance pour VR Galaxy
 * Gestion des sessions d'exploration spatiale thérapeutique
 */

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

export interface VRGalaxySession {
  id: string;
  user_id: string;
  planet_visited: string;
  duration_seconds: number;
  mood_before?: number;
  mood_after?: number;
  breathing_cycles: number;
  achievements_unlocked: string[];
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface VRGalaxyStats {
  totalSessions: number;
  totalMinutes: number;
  planetsVisited: string[];
  averageMoodImprovement: number;
  totalBreathingCycles: number;
  favoriteplanet: string | null;
  currentStreak: number;
  longestStreak: number;
  totalAchievements: number;
}

export interface CreateVRGalaxySession {
  planet_visited: string;
  mood_before?: number;
}

export interface CompleteVRGalaxySession {
  session_id: string;
  duration_seconds: number;
  mood_after?: number;
  breathing_cycles: number;
  achievements_unlocked?: string[];
  notes?: string;
}

// ============================================================================
// HOOK
// ============================================================================

export function useVRGalaxyPersistence() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<VRGalaxySession[]>([]);
  const [stats, setStats] = useState<VRGalaxyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sessions history
  const fetchSessions = useCallback(async (limit = 20) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Use localStorage as fallback since no dedicated table exists
      const storageKey = `vr_galaxy_history_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      const history: VRGalaxySession[] = stored ? JSON.parse(stored) : [];
      
      setSessions(history.slice(0, limit));
    } catch (err) {
      console.error('Error fetching VR Galaxy sessions:', err);
      setError('Erreur lors du chargement des sessions');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Create a new session
  const createSession = useCallback(async (data: CreateVRGalaxySession): Promise<VRGalaxySession | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    try {
      const session: VRGalaxySession = {
        id: crypto.randomUUID(),
        user_id: user.id,
        planet_visited: data.planet_visited,
        duration_seconds: 0,
        mood_before: data.mood_before,
        breathing_cycles: 0,
        achievements_unlocked: [],
        created_at: new Date().toISOString(),
      };

      // Store active session
      const activeKey = `vr_galaxy_active_${user.id}`;
      localStorage.setItem(activeKey, JSON.stringify(session));

      return session;
    } catch (err) {
      console.error('Error creating VR Galaxy session:', err);
      toast.error('Erreur lors de la création de la session');
      return null;
    }
  }, [user]);

  // Complete a session
  const completeSession = useCallback(async (data: CompleteVRGalaxySession): Promise<VRGalaxySession | null> => {
    if (!user) return null;

    try {
      const activeKey = `vr_galaxy_active_${user.id}`;
      const stored = localStorage.getItem(activeKey);
      
      if (!stored) {
        throw new Error('No active session found');
      }

      const activeSession: VRGalaxySession = JSON.parse(stored);
      
      const completedSession: VRGalaxySession = {
        ...activeSession,
        duration_seconds: data.duration_seconds,
        mood_after: data.mood_after,
        breathing_cycles: data.breathing_cycles,
        achievements_unlocked: data.achievements_unlocked || [],
        notes: data.notes,
        completed_at: new Date().toISOString(),
      };

      // Save to history
      const historyKey = `vr_galaxy_history_${user.id}`;
      const history: VRGalaxySession[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.unshift(completedSession);
      
      // Keep last 100 sessions
      if (history.length > 100) history.pop();
      
      localStorage.setItem(historyKey, JSON.stringify(history));
      localStorage.removeItem(activeKey);

      // Update local state
      setSessions(prev => [completedSession, ...prev].slice(0, 20));

      toast.success('Session VR Galaxy enregistrée !');
      return completedSession;
    } catch (err) {
      console.error('Error completing VR Galaxy session:', err);
      toast.error('Erreur lors de la sauvegarde');
      return null;
    }
  }, [user]);

  // Calculate stats
  const calculateStats = useCallback(async (): Promise<VRGalaxyStats> => {
    if (!user) {
      return getDefaultStats();
    }

    try {
      const historyKey = `vr_galaxy_history_${user.id}`;
      const history: VRGalaxySession[] = JSON.parse(localStorage.getItem(historyKey) || '[]');

      if (history.length === 0) {
        return getDefaultStats();
      }

      const totalSessions = history.length;
      const totalMinutes = Math.round(history.reduce((sum, s) => sum + s.duration_seconds, 0) / 60);
      const planetsVisited = [...new Set(history.map(s => s.planet_visited))];
      
      // Mood improvement
      const sessionsWithMood = history.filter(s => s.mood_before !== undefined && s.mood_after !== undefined);
      const avgMoodImprovement = sessionsWithMood.length > 0
        ? sessionsWithMood.reduce((sum, s) => sum + ((s.mood_after || 0) - (s.mood_before || 0)), 0) / sessionsWithMood.length
        : 0;

      const totalBreathingCycles = history.reduce((sum, s) => sum + s.breathing_cycles, 0);

      // Favorite planet
      const planetCounts: Record<string, number> = {};
      history.forEach(s => {
        planetCounts[s.planet_visited] = (planetCounts[s.planet_visited] || 0) + 1;
      });
      const favoriteplanet = Object.entries(planetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

      // Streak calculation
      const { currentStreak, longestStreak } = calculateStreak(history);

      const totalAchievements = [...new Set(history.flatMap(s => s.achievements_unlocked))].length;

      const stats: VRGalaxyStats = {
        totalSessions,
        totalMinutes,
        planetsVisited,
        averageMoodImprovement: Math.round(avgMoodImprovement * 10) / 10,
        totalBreathingCycles,
        favoriteplanet,
        currentStreak,
        longestStreak,
        totalAchievements,
      };

      setStats(stats);
      return stats;
    } catch (err) {
      console.error('Error calculating VR Galaxy stats:', err);
      return getDefaultStats();
    }
  }, [user]);

  // Fetch on mount
  useEffect(() => {
    if (user) {
      fetchSessions();
      calculateStats();
    }
  }, [user, fetchSessions, calculateStats]);

  return {
    sessions,
    stats,
    isLoading,
    error,
    fetchSessions,
    createSession,
    completeSession,
    calculateStats,
    refetch: fetchSessions,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultStats(): VRGalaxyStats {
  return {
    totalSessions: 0,
    totalMinutes: 0,
    planetsVisited: [],
    averageMoodImprovement: 0,
    totalBreathingCycles: 0,
    favoriteplanet: null,
    currentStreak: 0,
    longestStreak: 0,
    totalAchievements: 0,
  };
}

function calculateStreak(sessions: VRGalaxySession[]): { currentStreak: number; longestStreak: number } {
  if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const today = new Date().toDateString();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: string | null = null;

  const sorted = [...sessions].sort(
    (a, b) => new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime()
  );

  for (const session of sorted) {
    const sessionDate = new Date(session.completed_at || session.created_at).toDateString();
    
    if (lastDate === null) {
      tempStreak = 1;
      if (sessionDate === today) currentStreak = 1;
    } else {
      const lastDateObj = new Date(lastDate);
      const sessionDateObj = new Date(sessionDate);
      const diffDays = Math.floor((lastDateObj.getTime() - sessionDateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        if (currentStreak > 0) currentStreak++;
      } else if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        currentStreak = 0;
      }
    }
    
    lastDate = sessionDate;
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

export default useVRGalaxyPersistence;
