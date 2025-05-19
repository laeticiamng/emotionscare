
import { useState, useEffect } from 'react';
import { Badge, Challenge } from '@/types/challenge';
import { mockCommunityBadges, mockCommunityChallenges } from './community-gamification/mockData';

export const useCommunityGamification = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCommunityGamification = async () => {
      setIsLoading(true);
      try {
        // Dans une vraie application, nous appellerions une API ici
        // Pour l'instant, nous utilisons des données simulées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setBadges(mockCommunityBadges);
        setChallenges(mockCommunityChallenges);
      } catch (error) {
        console.error("Erreur lors du chargement des données de gamification:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCommunityGamification();
  }, []);

  const unlockBadge = async (badgeId: string) => {
    // Dans une vraie application, nous appellerions une API ici
    const updatedBadges = badges.map(badge => 
      badge.id === badgeId 
        ? { ...badge, unlocked: true, dateAwarded: new Date().toISOString() } 
        : badge
    );
    
    setBadges(updatedBadges);
    return updatedBadges.find(b => b.id === badgeId);
  };

  const updateChallengeProgress = async (challengeId: string, progress: number) => {
    // Dans une vraie application, nous appellerions une API ici
    const updatedChallenges = challenges.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, progress: Math.min(progress, challenge.goal || challenge.totalSteps || 100) } 
        : challenge
    );
    
    setChallenges(updatedChallenges);
    return updatedChallenges.find(c => c.id === challengeId);
  };

  const completeChallenge = async (challengeId: string) => {
    // Dans une vraie application, nous appellerions une API ici
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return null;
    
    const updatedChallenges = challenges.map(c => 
      c.id === challengeId 
        ? { ...c, completed: true, progress: c.goal || c.totalSteps || 100 } 
        : c
    );
    
    setChallenges(updatedChallenges);
    
    // Créer un badge en récompense
    const newBadge: Badge = {
      id: `badge-${Date.now()}`,
      name: `Badge ${challenge.name}`,
      description: `Récompense pour avoir complété le défi: ${challenge.description}`,
      imageUrl: '/badges/challenge-completed.png',
      unlocked: true,
      category: 'achievements',
      dateAwarded: new Date().toISOString()
    };
    
    setBadges(prev => [...prev, newBadge]);
    
    return newBadge;
  };

  return {
    badges,
    challenges,
    isLoading,
    unlockBadge,
    updateChallengeProgress,
    completeChallenge
  };
};

export default useCommunityGamification;
