// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DailyChallenge {
  id: string;
  type: string;
  objective: string;
  reward_type: string;
  reward_value: any;
  emotional_profile: string;
}

export interface ChallengeProgress {
  id: string;
  challenge_id: string;
  completed: boolean;
  completed_at: string | null;
  streak_days: number;
  progress: { current: number; target: number };
}

export const useDailyChallenges = (emotionalProfile: string = 'all') => {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [progress, setProgress] = useState<Record<string, ChallengeProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's challenges for user's profile
      const { data: challengesData, error: challengesError } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .in('emotional_profile', [emotionalProfile, 'all']);

      if (challengesError) throw challengesError;

      setChallenges(challengesData || []);

      // Fetch user's progress for these challenges
      const { data: { user } } = await supabase.auth.getUser();
      if (user && challengesData && challengesData.length > 0) {
        const challengeIds = challengesData.map(c => c.id);
        
        const { data: progressData, error: progressError } = await supabase
          .from('user_challenges_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('challenge_id', challengeIds);

        if (progressError) throw progressError;

        const progressMap: Record<string, ChallengeProgress> = {};
        (progressData || []).forEach(p => {
          progressMap[p.challenge_id] = p;
        });
        setProgress(progressMap);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching challenges:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (challengeId: string, currentProgress: number, target: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isCompleted = currentProgress >= target;
      const now = new Date().toISOString();

      const { data: existing } = await supabase
        .from('user_challenges_progress')
        .select('id, streak_days')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .single();

      if (existing) {
        // Update existing progress
        const newStreakDays = isCompleted ? existing.streak_days + 1 : existing.streak_days;
        
        const { data, error } = await supabase
          .from('user_challenges_progress')
          .update({
            completed: isCompleted,
            completed_at: isCompleted ? now : null,
            streak_days: newStreakDays,
            progress: { current: currentProgress, target }
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        
        setProgress(prev => ({
          ...prev,
          [challengeId]: data
        }));
      } else {
        // Create new progress entry
        const { data, error } = await supabase
          .from('user_challenges_progress')
          .insert({
            user_id: user.id,
            challenge_id: challengeId,
            completed: isCompleted,
            completed_at: isCompleted ? now : null,
            streak_days: isCompleted ? 1 : 0,
            progress: { current: currentProgress, target }
          })
          .select()
          .single();

        if (error) throw error;
        
        setProgress(prev => ({
          ...prev,
          [challengeId]: data
        }));
      }
    } catch (err: any) {
      console.error('Error updating challenge progress:', err);
      setError(err.message);
    }
  };

  const generateNewChallenges = async () => {
    try {
      const { error } = await supabase.functions.invoke('generate-daily-challenges');
      if (error) throw error;
      
      await fetchChallenges();
    } catch (err: any) {
      console.error('Error generating challenges:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchChallenges();

    // Set up real-time subscription for progress updates
    const channel = supabase
      .channel('challenges-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_challenges_progress'
        },
        () => {
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [emotionalProfile]);

  return {
    challenges,
    progress,
    loading,
    error,
    updateProgress,
    generateNewChallenges,
    refresh: fetchChallenges
  };
};
