
import { useState, useEffect } from 'react';
import { Challenge, Badge } from '@/types/badge';
import { toast } from '@/hooks/use-toast';
import { mockBadges, mockChallenges } from './community-gamification/mockData';

export const useCommunityGamification = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load mock data on component mount
    loadBadges();
    loadChallenges();
  }, []);

  const loadBadges = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setBadges(mockBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChallenges = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setChallenges(mockChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
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
      console.error('Error updating challenge progress:', error);
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
      console.error('Error unlocking badge:', error);
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
