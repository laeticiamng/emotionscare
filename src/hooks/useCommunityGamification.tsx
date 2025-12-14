// @ts-nocheck
import { useState, useEffect } from 'react';
import { Challenge, Badge } from '@/types/badge';
import { toast } from '@/hooks/use-toast';
import { mockBadges, mockChallenges } from './community-gamification/mockData';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCommunityGamification = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBadges();
    loadChallenges();
  }, [user]);

  const loadBadges = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Charger depuis Supabase
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*, achievements(*)')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          const supabaseBadges: Badge[] = data.map((ua: any) => ({
            id: ua.achievements?.id || ua.id,
            name: ua.achievements?.name || 'Badge',
            description: ua.achievements?.description || '',
            icon: ua.achievements?.icon || '🏆',
            category: ua.achievements?.category || 'general',
            unlocked: true,
            earned: true,
            unlockedAt: ua.unlocked_at
          }));
          setBadges([...mockBadges.map(b => ({
            ...b,
            unlocked: supabaseBadges.some(sb => sb.name === b.name),
            earned: supabaseBadges.some(sb => sb.name === b.name)
          }))]);
          return;
        }
      }
      // Fallback vers mock data
      setBadges(mockBadges);
    } catch (error) {
      logger.error('Error loading badges', error as Error, 'SYSTEM');
      setBadges(mockBadges);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Charger depuis Supabase
        const { data, error } = await supabase
          .from('user_challenge_progress')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          const progressMap = new Map(data.map((p: any) => [p.challenge_id, p]));
          setChallenges(mockChallenges.map(c => {
            const progress = progressMap.get(c.id);
            return progress ? {
              ...c,
              progress: progress.progress || 0,
              status: progress.completed_at ? 'completed' : c.status
            } : c;
          }));
          return;
        }
      }
      // Fallback vers mock data
      setChallenges(mockChallenges);
    } catch (error) {
      logger.error('Error loading challenges', error as Error, 'SYSTEM');
      setChallenges(mockChallenges);
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
    loadBadges,
    loadChallenges,
    updateChallengeProgress,
    unlockBadge
  };
};

export default useCommunityGamification;
