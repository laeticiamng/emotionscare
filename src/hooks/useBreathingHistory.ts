/**
 * useBreathingHistory - Hook pour l'historique des sessions de respiration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface BreathingSessionRecord {
  id: string;
  user_id: string;
  protocol: string;
  duration_seconds: number;
  feedback: 'better' | 'same' | 'worse' | null;
  completed: boolean;
  created_at: string;
}

export interface BreathingStats {
  totalSessions: number;
  totalMinutes: number;
  favoriteProtocol: string | null;
  thisWeekSessions: number;
  thisWeekMinutes: number;
}

export const useBreathingHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer l'historique
  const historyQuery = useQuery({
    queryKey: ['breathing-sessions', user?.id],
    queryFn: async (): Promise<BreathingSessionRecord[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('breathing_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('Error fetching breathing history', error instanceof Error ? error : new Error(String(error)), 'BREATH');
        throw error;
      }

      return (data || []) as BreathingSessionRecord[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  // Calculer les statistiques
  const stats: BreathingStats = (() => {
    const sessions = historyQuery.data || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const thisWeekSessions = sessions.filter(
      s => new Date(s.created_at) >= weekAgo
    );

    // Trouver le protocole favori
    const protocolCounts: Record<string, number> = {};
    sessions.forEach(s => {
      protocolCounts[s.protocol] = (protocolCounts[s.protocol] || 0) + 1;
    });
    const favoriteProtocol = Object.entries(protocolCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      totalSessions: sessions.length,
      totalMinutes: Math.round(
        sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60
      ),
      favoriteProtocol,
      thisWeekSessions: thisWeekSessions.length,
      thisWeekMinutes: Math.round(
        thisWeekSessions.reduce((sum, s) => sum + s.duration_seconds, 0) / 60
      ),
    };
  })();

  // Sauvegarder une session
  const saveSessionMutation = useMutation({
    mutationFn: async (session: {
      protocol: string;
      duration_seconds: number;
      feedback?: 'better' | 'same' | 'worse';
      completed?: boolean;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('breathing_sessions')
        .insert({
          user_id: user.id,
          protocol: session.protocol,
          duration_seconds: session.duration_seconds,
          feedback: session.feedback || null,
          completed: session.completed ?? true,
        })
        .select()
        .single();

      if (error) {
        logger.error('Error saving breathing session', error instanceof Error ? error : new Error(String(error)), 'BREATH');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing-sessions', user?.id] });
      toast.success('Session enregistrée !');
    },
    onError: (error) => {
      logger.error('Error saving session', error instanceof Error ? error : new Error(String(error)), 'BREATH');
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  return {
    history: historyQuery.data || [],
    stats,
    isLoading: historyQuery.isLoading,
    saveSession: saveSessionMutation.mutateAsync,
    isSaving: saveSessionMutation.isPending,
  };
};

export default useBreathingHistory;
