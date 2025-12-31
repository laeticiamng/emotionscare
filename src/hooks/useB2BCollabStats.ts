/**
 * Hook pour les statistiques personnelles d'un collaborateur B2B
 * Données individuelles confidentielles
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CollabStats {
  currentMood: 'calm' | 'energized' | 'stressed' | 'neutral';
  moodLabel: string;
  weeklyProgress: {
    emotionalBalance: number;
    activityEngagement: number;
    stressManagement: number;
  };
  goals: Array<{
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
  }>;
  streak: number;
  totalSessions: number;
  suggestions: Array<{
    id: string;
    emoji: string;
    title: string;
    description: string;
    link: string;
    variant: 'info' | 'success' | 'warning';
  }>;
}

const DEFAULT_STATS: CollabStats = {
  currentMood: 'neutral',
  moodLabel: 'En attente de scan',
  weeklyProgress: {
    emotionalBalance: 0,
    activityEngagement: 0,
    stressManagement: 0,
  },
  goals: [],
  streak: 0,
  totalSessions: 0,
  suggestions: [
    {
      id: 'screen-silk',
      emoji: '💙',
      title: 'Moment de calme',
      description: 'Votre journée semble chargée. Que diriez-vous d\'une pause Screen-Silk ?',
      link: '/app/screen-silk',
      variant: 'info',
    },
    {
      id: 'mood-mixer',
      emoji: '🎵',
      title: 'Boost d\'énergie',
      description: 'Un peu de Mood Mixer pour dynamiser cette fin d\'après-midi ?',
      link: '/app/mood-mixer',
      variant: 'success',
    },
  ],
};

async function fetchCollabStats(userId: string): Promise<CollabStats> {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [scansRes, goalsRes, statsRes, sessionsRes] = await Promise.all([
      // Dernier scan pour l'humeur actuelle
      supabase
        .from('scan_history')
        .select('normalized_balance, dominant_emotion, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1),
      
      // Objectifs personnels
      supabase
        .from('user_goals')
        .select('id, title, description, completed')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Stats utilisateur
      supabase
        .from('user_stats')
        .select('streak_days, total_points')
        .eq('user_id', userId)
        .maybeSingle(),
      
      // Sessions cette semaine
      supabase
        .from('activity_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('started_at', weekAgo),
    ]);

    // Déterminer l'humeur
    let currentMood: CollabStats['currentMood'] = 'neutral';
    let moodLabel = 'En attente de scan';
    
    if (scansRes.data && scansRes.data.length > 0) {
      const balance = scansRes.data[0].normalized_balance || 50;
      if (balance >= 70) {
        currentMood = 'calm';
        moodLabel = 'Serein(e)';
      } else if (balance >= 50) {
        currentMood = 'energized';
        moodLabel = 'Énergique';
      } else if (balance >= 30) {
        currentMood = 'neutral';
        moodLabel = 'Neutre';
      } else {
        currentMood = 'stressed';
        moodLabel = 'Tendu(e)';
      }
    }

    // Calculer la progression hebdomadaire
    const totalSessions = sessionsRes.count || 0;
    const emotionalBalance = Math.min(100, 50 + totalSessions * 5);
    const activityEngagement = Math.min(100, totalSessions * 10);
    const stressManagement = Math.min(100, 60 + totalSessions * 3);

    // Mapper les objectifs
    const goals = (goalsRes.data || []).map((goal: any) => ({
      id: goal.id,
      title: goal.title || 'Objectif',
      description: goal.description || '',
      status: goal.completed 
        ? 'completed' as const
        : goal.description?.includes('commenc') 
          ? 'pending' as const 
          : 'in_progress' as const,
    }));

    // Suggestions dynamiques basées sur l'humeur
    const suggestions: CollabStats['suggestions'] = [];
    
    if (currentMood === 'stressed') {
      suggestions.push({
        id: 'breath',
        emoji: '🌬️',
        title: 'Respiration guidée',
        description: 'Prenez 2 minutes pour vous recentrer avec une respiration profonde',
        link: '/app/breath',
        variant: 'info',
      });
    }
    
    if (currentMood !== 'calm') {
      suggestions.push({
        id: 'screen-silk',
        emoji: '💙',
        title: 'Moment de calme',
        description: 'Une pause Screen-Silk pour décompresser',
        link: '/app/screen-silk',
        variant: 'info',
      });
    }
    
    suggestions.push({
      id: 'mood-mixer',
      emoji: '🎵',
      title: 'Boost musical',
      description: 'Mood Mixer adapte la musique à votre état',
      link: '/app/mood-mixer',
      variant: 'success',
    });

    return {
      currentMood,
      moodLabel,
      weeklyProgress: {
        emotionalBalance,
        activityEngagement,
        stressManagement,
      },
      goals: goals.length > 0 ? goals : [
        { id: '1', title: 'Méditation quotidienne', description: '5 jours cette semaine', status: 'completed' },
        { id: '2', title: 'Gestion stress', description: '3 sessions Flash Glow', status: 'in_progress' },
        { id: '3', title: 'Journal émotionnel', description: 'Quotidien ce mois', status: 'pending' },
      ],
      streak: statsRes.data?.streak_days || 0,
      totalSessions,
      suggestions: suggestions.slice(0, 2),
    };
  } catch (error) {
    logger.error('Error fetching collab stats', error as Error, 'B2B');
    return DEFAULT_STATS;
  }
}

export function useB2BCollabStats() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['b2b-collab-stats', user?.id],
    queryFn: () => fetchCollabStats(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    stats: query.data || DEFAULT_STATS,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
