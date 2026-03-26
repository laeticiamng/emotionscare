// @ts-nocheck
import { useState, useEffect } from 'react';
import { Challenge, Badge } from '@/types/badge';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityGamification = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadBadges();
    loadChallenges();
  }, [user]);

  const loadBadges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        setBadges([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_achievements')
        .select('*, achievements(*)')
        .eq('user_id', user.id);

      if (fetchError) {
        throw new Error(`Failed to load badges: ${fetchError.message}`);
      }

      const supabaseBadges: Badge[] = (data || []).map((ua: any) => ({
        id: ua.achievements?.id || ua.id,
        name: ua.achievements?.name || 'Badge',
        description: ua.achievements?.description || '',
        icon: ua.achievements?.icon || '🏆',
        category: ua.achievements?.category || 'general',
        unlocked: true,
        earned: true,
        unlockedAt: ua.unlocked_at
      }));
      setBadges(supabaseBadges);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      logger.error('Error loading badges', e, 'SYSTEM');
      setError(e);
      setBadges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenges = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user) {
        setChallenges([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('user_challenge_progress')
        .select('*, challenges(*)')
        .eq('user_id', user.id);

      if (fetchError) {
        throw new Error(`Failed to load challenges: ${fetchError.message}`);
      }

      const challengeData: Challenge[] = (data || []).map((p: any) => ({
        id: p.challenge_id || p.id,
        name: p.challenges?.name || 'Challenge',
        title: p.challenges?.title || p.challenges?.name || 'Challenge',
        description: p.challenges?.description || '',
        progress: p.progress || 0,
        goal: p.challenges?.goal || 1,
        totalSteps: p.challenges?.total_steps || 1,
        points: p.challenges?.points || 0,
        status: p.completed_at ? 'completed' : 'active',
      }));
      setChallenges(challengeData);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      logger.error('Error loading challenges', e, 'SYSTEM');
      setError(e);
      setChallenges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    setIsLoading(true);
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return false;

      const newProgress = Math.min(progress, challenge.goal || challenge.totalSteps || 1);
      const completed = newProgress >= (challenge.goal || challenge.totalSteps || 1);

      // Sauvegarder dans Supabase si connecté
      if (user) {
        const { error } = await supabase
          .from('user_challenge_progress')
          .upsert({
            user_id: user.id,
            challenge_id: challengeId,
            progress: newProgress,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,challenge_id' });

        if (error) {
          logger.error('Error saving challenge progress to Supabase', error, 'SYSTEM');
        }
      }
      
      setChallenges(prev => 
        prev.map(c => {
          if (c.id === challengeId) {
            if (completed && c.status !== 'completed') {
              toast({
                title: 'Challenge terminé !',
                description: `Vous avez complété le challenge "${c.title || c.name}"`,
                variant: 'success',
                duration: 5000,
              });
            }
            
            return {
              ...c,
              progress: newProgress,
              status: completed ? 'completed' : c.status
            };
          }
          return c;
        })
      );
      
      return true;
    } catch (error) {
      logger.error('Error updating challenge progress', error as Error, 'SYSTEM');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unlockBadge = async (badgeId: string) => {
    setIsLoading(true);
    try {
      const badge = badges.find(b => b.id === badgeId);
      if (!badge || badge.unlocked) return false;

      // Sauvegarder dans Supabase si connecté
      if (user) {
        // Chercher l'achievement correspondant
        const { data: achievement } = await supabase
          .from('achievements')
          .select('id')
          .eq('name', badge.name)
          .maybeSingle();

        if (achievement) {
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: achievement.id,
              unlocked_at: new Date().toISOString()
            });

          if (error && error.code !== '23505') { // Ignore duplicate
            logger.error('Error saving badge to Supabase', error, 'SYSTEM');
          }
        }
      }
      
      setBadges(prev => 
        prev.map(b => {
          if (b.id === badgeId && !b.unlocked) {
            return { ...b, unlocked: true, earned: true };
          }
          return b;
        })
      );
      
      toast({
        title: 'Badge débloqué !',
        description: `Vous avez débloqué le badge "${badge.name}"`,
        variant: 'success',
        duration: 5000,
      });
      return true;
    } catch (error) {
      logger.error('Error unlocking badge', error as Error, 'SYSTEM');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    badges,
    challenges,
    isLoading,
    error,
    loadBadges,
    loadChallenges,
    updateChallengeProgress,
    unlockBadge
  };
};

export default useCommunityGamification;
