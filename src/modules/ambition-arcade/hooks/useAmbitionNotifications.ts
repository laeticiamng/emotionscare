/**
 * Hook pour les notifications réactives Ambition Arcade
 * Utilise Supabase Realtime pour les mises à jour en temps réel
 */
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AmbitionNotification {
  type: 'quest_completed' | 'artifact_earned' | 'goal_completed' | 'level_up';
  title: string;
  message: string;
  icon?: string;
}

export function useAmbitionNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const showNotification = useCallback((notification: AmbitionNotification) => {
    const icons: Record<string, string> = {
      quest_completed: '✅',
      artifact_earned: '🏆',
      goal_completed: '🎯',
      level_up: '⬆️',
    };

    toast({
      title: `${icons[notification.type] || '🔔'} ${notification.title}`,
      description: notification.message,
    });
  }, [toast]);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to quests changes
    const questsChannel = supabase
      .channel('ambition-quests-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ambition_quests',
          filter: `status=eq.completed`,
        },
        (payload) => {
          const quest = payload.new as { title?: string; xp_reward?: number };
          showNotification({
            type: 'quest_completed',
            title: 'Quête complétée !',
            message: `${quest.title || 'Quête'} (+${quest.xp_reward || 0} XP)`,
          });
          queryClient.invalidateQueries({ queryKey: ['ambition-quests'] });
          queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
        }
      )
      .subscribe();

    // Subscribe to artifacts
    const artifactsChannel = supabase
      .channel('ambition-artifacts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ambition_artifacts',
        },
        (payload) => {
          const artifact = payload.new as { name?: string; rarity?: string };
          showNotification({
            type: 'artifact_earned',
            title: 'Nouvel artefact !',
            message: `${artifact.name || 'Artefact'} (${artifact.rarity || 'common'})`,
          });
          queryClient.invalidateQueries({ queryKey: ['ambition-artifacts'] });
          queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
        }
      )
      .subscribe();

    // Subscribe to runs (goal) completions
    const runsChannel = supabase
      .channel('ambition-runs-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ambition_runs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const run = payload.new as { status?: string; objective?: string };
          if (run.status === 'completed') {
            showNotification({
              type: 'goal_completed',
              title: 'Objectif atteint !',
              message: run.objective || 'Félicitations !',
            });
          }
          queryClient.invalidateQueries({ queryKey: ['ambition-goals'] });
          queryClient.invalidateQueries({ queryKey: ['ambition-stats'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(questsChannel);
      supabase.removeChannel(artifactsChannel);
      supabase.removeChannel(runsChannel);
    };
  }, [user?.id, showNotification, queryClient]);

  return { showNotification };
}
