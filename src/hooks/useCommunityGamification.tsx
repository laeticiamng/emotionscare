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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      setChallenges(prev => 
        prev.map(challenge => {
          if (challenge.id === challengeId) {
            const newProgress = Math.min(progress, challenge.goal || challenge.totalSteps || 1);
            const completed = newProgress >= (challenge.goal || challenge.totalSteps || 1);
            
            if (completed && challenge.status !== 'completed') {
              // Show toast when challenge is completed
              toast({
                title: 'Challenge terminé !',
                description: `Vous avez complété le challenge "${challenge.title || challenge.name}"`,
                variant: 'success',
                duration: 5000,
              });
            }
            
            return {
              ...challenge,
              progress: newProgress,
              status: completed ? 'completed' : challenge.status
            };
          }
          return challenge;
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      let badgeName = '';
      
      setBadges(prev => 
        prev.map(badge => {
          if (badge.id === badgeId && !badge.unlocked) {
            badgeName = badge.name;
            return {
              ...badge,
              unlocked: true,
              earned: true
            };
          }
          return badge;
        })
      );
      
      if (badgeName) {
        // Show toast when badge is unlocked
        toast({
          title: 'Badge débloqué !',
          description: `Vous avez débloqué le badge "${badgeName}"`,
          variant: 'success',
          duration: 5000,
        });
        return true;
      }
      
      return false;
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
