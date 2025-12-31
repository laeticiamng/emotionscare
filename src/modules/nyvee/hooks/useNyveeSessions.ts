/**
 * useNyveeSessions - Hook React Query pour les sessions Nyvee
 * Gère la persistance et le fetching des sessions
 * Synchronise avec le système d'interconnexion des modules
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useModuleInterconnect } from '@/hooks/useModuleInterconnect';
import type { BreathingIntensity, BadgeType, CocoonType } from '../types';

export interface NyveeSessionRecord {
  id: string;
  user_id: string;
  intensity: BreathingIntensity;
  cycles_completed: number;
  target_cycles: number;
  mood_before: number | null;
  mood_after: number | null;
  mood_delta: number | null;
  badge_earned: BadgeType;
  cocoon_unlocked: CocoonType | null;
  cozy_level: number;
  session_duration: number;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}

interface CreateSessionParams {
  intensity: BreathingIntensity;
  targetCycles?: number;
  moodBefore?: number;
  cozyLevel?: number;
}

interface CompleteSessionParams {
  sessionId: string;
  cyclesCompleted: number;
  moodAfter?: number;
  badgeEarned: BadgeType;
  cocoonUnlocked?: CocoonType;
  durationSeconds: number;
}

// Map pattern DB vers intensity
const patternToIntensity = (pattern: string): BreathingIntensity => {
  if (pattern === '4-2-6' || pattern === 'coherence' || pattern === 'calm') return 'calm';
  if (pattern === '4-7-8' || pattern === 'relaxing' || pattern === 'moderate') return 'moderate';
  if (pattern === 'box' || pattern === 'energizing' || pattern === 'intense') return 'intense';
  return 'calm';
};

// Map intensity vers pattern DB
const intensityToPattern = (intensity: BreathingIntensity): string => {
  switch (intensity) {
    case 'calm': return '4-2-6';
    case 'moderate': return '4-7-8';
    case 'intense': return 'box';
    default: return '4-2-6';
  }
};

export const useNyveeSessions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const userId = user?.id;
  const { syncFromModule, notifyModules } = useModuleInterconnect();

  // Récupérer l'historique des sessions
  const sessionsQuery = useQuery({
    queryKey: ['nyvee-sessions', userId],
    queryFn: async (): Promise<NyveeSessionRecord[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('breathing_vr_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching nyvee sessions:', error);
        return [];
      }

      // Map les données vers le format NyveeSessionRecord
      return (data || []).map((session: any) => ({
        id: session.id,
        user_id: session.user_id,
        intensity: patternToIntensity(session.pattern || ''),
        cycles_completed: session.cycles_completed || 0,
        target_cycles: 6,
        mood_before: session.mood_before,
        mood_after: session.mood_after,
        mood_delta: session.mood_after && session.mood_before ? session.mood_after - session.mood_before : null,
        badge_earned: determineBadgeFromSession(session),
        cocoon_unlocked: null,
        cozy_level: 50,
        session_duration: session.duration_seconds || 0,
        completed: session.completed_at !== null,
        created_at: session.created_at,
        completed_at: session.completed_at,
      }));
    },
    enabled: !!userId,
  });

  // Récupérer les stats (calcul côté client pour éviter dépendance circulaire)
  const statsQuery = useQuery({
    queryKey: ['nyvee-stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Fetch sessions directement ici pour éviter dépendance
      const { data: sessionsData, error } = await supabase
        .from('breathing_vr_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching stats:', error);
        return null;
      }

      const sessions = (sessionsData || []).map((session: any) => ({
        cycles_completed: session.cycles_completed || 0,
        mood_before: session.mood_before,
        mood_after: session.mood_after,
        intensity: patternToIntensity(session.pattern || ''),
        completed: session.completed_at !== null,
        created_at: session.created_at,
        badge_earned: determineBadgeFromSession(session),
      }));

      const completedSessions = sessions.filter(s => s.completed);
      const totalCycles = sessions.reduce((sum, s) => sum + s.cycles_completed, 0);

      // Calculer le streak
      let currentStreak = 0;
      let longestStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sessionDates = sessions
        .filter(s => s.completed)
        .map(s => {
          const date = new Date(s.created_at);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => b - a);

      for (let i = 0; i < sessionDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);

        if (sessionDates[i] === expectedDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculer le plus long streak
      let streak = 1;
      for (let i = 1; i < sessionDates.length; i++) {
        const diff = sessionDates[i - 1] - sessionDates[i];
        if (diff === 86400000) {
          streak++;
          longestStreak = Math.max(longestStreak, streak);
        } else {
          streak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, streak, currentStreak);

      // Calculer l'amélioration d'humeur moyenne
      const sessionsWithMood = sessions.filter(s => s.mood_after !== null && s.mood_before !== null);
      const avgMoodDelta = sessionsWithMood.length > 0
        ? sessionsWithMood.reduce((sum, s) => sum + ((s.mood_after || 0) - (s.mood_before || 0)), 0) / sessionsWithMood.length
        : null;

      // Intensité favorite
      const intensityCounts: Record<BreathingIntensity, number> = { calm: 0, moderate: 0, intense: 0 };
      sessions.forEach(s => {
        intensityCounts[s.intensity]++;
      });
      const favoriteIntensity = Object.entries(intensityCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] as BreathingIntensity | null;

      return {
        totalSessions: sessions.length,
        completedSessions: completedSessions.length,
        totalCycles,
        averageCyclesPerSession: sessions.length > 0 ? totalCycles / sessions.length : 0,
        completionRate: sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0,
        currentStreak,
        longestStreak,
        favoriteIntensity,
        avgMoodDelta,
        badgesEarned: {
          calm: sessions.filter(s => s.badge_earned === 'calm').length,
          partial: sessions.filter(s => s.badge_earned === 'partial').length,
          tense: sessions.filter(s => s.badge_earned === 'tense').length,
        },
      };
    },
    enabled: !!userId,
  });

  // Créer une nouvelle session
  const createSession = useMutation({
    mutationFn: async (params: CreateSessionParams) => {
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('breathing_vr_sessions')
        .insert({
          user_id: userId,
          pattern: intensityToPattern(params.intensity),
          duration_seconds: 0,
          cycles_completed: 0,
          mood_before: params.moodBefore,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-sessions', userId] });
      toast({ title: 'Session Nyvee démarrée' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Compléter une session
  const completeSession = useMutation({
    mutationFn: async (params: CompleteSessionParams) => {
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('breathing_vr_sessions')
        .update({
          cycles_completed: params.cyclesCompleted,
          mood_after: params.moodAfter,
          duration_seconds: params.durationSeconds,
          completed_at: new Date().toISOString(),
        })
        .eq('id', params.sessionId);

      if (error) throw error;
      
      // Sync avec le système d'interconnexion des modules
      try {
        await syncFromModule('nyvee', params.sessionId, {
          duration_seconds: params.durationSeconds,
          mood_after: params.moodAfter,
          xp_earned: params.badgeEarned === 'calm' ? 50 : params.badgeEarned === 'partial' ? 25 : 10,
          metadata: {
            cycles_completed: params.cyclesCompleted,
            badge_earned: params.badgeEarned,
            cocoon_unlocked: params.cocoonUnlocked
          }
        });

        // Notifier les modules connectés
        await notifyModules('nyvee', 'shares_data', {
          event: 'session_completed',
          badge_earned: params.badgeEarned,
          cycles: params.cyclesCompleted,
          duration: params.durationSeconds
        });
      } catch (syncError) {
        console.warn('Module sync failed:', syncError);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nyvee-sessions', userId] });
      queryClient.invalidateQueries({ queryKey: ['nyvee-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['unified-sessions'] });
      toast({ title: 'Session terminée avec succès' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    stats: statsQuery.data,
    isLoading: sessionsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    createSession,
    completeSession,
    refetch: () => {
      sessionsQuery.refetch();
      statsQuery.refetch();
    },
  };
};

// Helper pour déterminer le badge depuis les données de session
function determineBadgeFromSession(session: any): BadgeType {
  const cycles = session.cycles_completed || 0;
  const moodDelta = session.mood_after && session.mood_before 
    ? session.mood_after - session.mood_before 
    : 0;
  
  if (cycles >= 5 && moodDelta >= 0) return 'calm';
  if (cycles >= 3) return 'partial';
  return 'tense';
}
