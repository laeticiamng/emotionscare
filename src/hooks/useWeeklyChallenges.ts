/**
 * Hook pour les défis hebdomadaires
 * TOP 20 - Complément pour WeeklyChallengesPanel
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_value: number;
  xp_reward: number;
  badge_reward: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface UserWeeklyProgress {
  challenge_id: string;
  current_value: number;
  completed: boolean;
  completed_at: string | null;
}

export function useWeeklyChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([]);
  const [userProgress, setUserProgress] = useState<Map<string, UserWeeklyProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: challengesData } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setChallenges((challengesData || []) as WeeklyChallenge[]);

      if (user) {
        const { data: progressData } = await supabase
          .from('user_weekly_progress')
          .select('*')
          .eq('user_id', user.id);

        const progressMap = new Map<string, UserWeeklyProgress>();
        (progressData || []).forEach((p: UserWeeklyProgress) => {
          progressMap.set(p.challenge_id, p);
        });
        setUserProgress(progressMap);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const claimReward = useCallback(async (challengeId: string) => {
    if (!user) return;
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    await supabase
      .from('user_weekly_progress')
      .update({ completed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('challenge_id', challengeId);

    toast({
      title: '🎉 Récompense réclamée !',
      description: `+${challenge.xp_reward} XP gagnés !`
    });

    await fetchData();
  }, [user, challenges, toast, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { challenges, userProgress, isLoading, claimReward, refresh: fetchData };
}
