
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/types';
import { 
  Challenge, 
  Achievement, 
  GamificationStats,
  UseCommunityGamificationResult 
} from './community-gamification/types';
import { mockBadges, mockChallenges, mockAchievements } from './community-gamification/mockData';
import { completeChallenge, getUserGamificationStats } from '@/lib/gamificationService';

export const useCommunityGamification = (): UseCommunityGamificationResult => {
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<GamificationStats>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalChallengesCompleted: 0,
    streak: 0,
    badges: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Load user's gamification data
  useEffect(() => {
    if (!user) return;

    const loadGamificationData = async () => {
      try {
        // In a real app, these would be API calls
        setActiveChallenges(mockChallenges.filter(c => c.status === 'active'));
        setRecommendedChallenges(mockChallenges.filter(c => !c.status));
        setAchievements(mockAchievements);
        setBadges(mockBadges);
        
        const userStats = await getUserGamificationStats(user.id);
        setStats(userStats);
      } catch (err) {
        setError('Failed to load gamification data');
        console.error(err);
      }
    };

    loadGamificationData();
  }, [user]);

  // Mark a challenge as completed
  const markChallengeCompleted = useCallback(async (challengeId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsProcessing(true);
    setError('');
    
    try {
      const completedChallenge = await completeChallenge(user.id, challengeId);
      
      // Update local state
      setActiveChallenges(prev => 
        prev.map(c => c.id === challengeId ? { ...c, status: 'completed', progress: 100, completed: true } : c)
      );
      
      return completedChallenge;
    } catch (err) {
      setError('Failed to complete challenge');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user]);
  
  // Track progress on a challenge
  const trackChallengeProgress = useCallback(async (challengeId: string, progress: number) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsProcessing(true);
    setError('');
    
    try {
      // In a real app, this would be an API call
      const challenge = activeChallenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');
      
      const updatedChallenge = { ...challenge, progress };
      
      // Update local state
      setActiveChallenges(prev => 
        prev.map(c => c.id === challengeId ? updatedChallenge : c)
      );
      
      return updatedChallenge;
    } catch (err) {
      setError('Failed to update challenge progress');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user, activeChallenges]);

  // Accept a new challenge
  const acceptChallenge = useCallback(async (challengeId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsProcessing(true);
    setError('');
    
    try {
      // Find the challenge in recommended challenges
      const challenge = recommendedChallenges.find(c => c.id === challengeId);
      if (!challenge) throw new Error('Challenge not found');
      
      const acceptedChallenge = { ...challenge, status: 'active', progress: 0 };
      
      // Update local state
      setRecommendedChallenges(prev => prev.filter(c => c.id !== challengeId));
      setActiveChallenges(prev => [...prev, acceptedChallenge]);
      
      return acceptedChallenge;
    } catch (err) {
      setError('Failed to accept challenge');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user, recommendedChallenges]);

  // Generate personalized challenges
  const generatePersonalizedChallenges = useCallback(async () => {
    if (!user) throw new Error('User not authenticated');
    
    setIsProcessing(true);
    setError('');
    
    try {
      // In a real app, this would be an AI-based API call
      // For demo, we'll return the mock challenges
      setRecommendedChallenges(mockChallenges.filter(c => !c.status));
      return mockChallenges.filter(c => !c.status);
    } catch (err) {
      setError('Failed to generate personalized challenges');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [user]);

  return {
    isProcessing,
    error,
    markChallengeCompleted,
    trackChallengeProgress,
    achievements,
    stats,
    activeChallenges,
    recommendedChallenges,
    acceptChallenge,
    generatePersonalizedChallenges,
    completeChallenge: markChallengeCompleted,
    badges
  };
};

export default useCommunityGamification;
