
import { GamificationStats, Challenge, Badge } from '@/types/gamification';
import { mockGamificationStats, mockChallenges } from '@/hooks/community-gamification/mockData';

export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // In a real app, we would call an API
  console.log(`Fetching gamification stats for user ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    ...mockGamificationStats,
    challenges: mockChallenges,
    recentAchievements: mockGamificationStats.badges.slice(0, 3)
  };
};

export const fetchChallenges = async (userId: string, status: string = 'all'): Promise<Challenge[]> => {
  console.log(`Fetching ${status} challenges for user ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (status === 'all') {
    return mockChallenges;
  }

  return mockChallenges.filter(challenge => {
    if (status === 'active') {
      return challenge.status === 'active' || challenge.status === 'ongoing' || challenge.status === 'available';
    } else if (status === 'completed') {
      return challenge.status === 'completed';
    }
    return true;
  });
};

export const joinChallenge = async (userId: string, challengeId: string): Promise<boolean> => {
  console.log(`User ${userId} is joining challenge ${challengeId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

export const completeChallenge = async (userId: string, challengeId: string): Promise<boolean> => {
  console.log(`User ${userId} completed challenge ${challengeId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

export const fetchBadges = async (userId: string): Promise<Badge[]> => {
  console.log(`Fetching badges for user ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockGamificationStats.badges;
};

export const syncGamificationData = async (userId: string): Promise<boolean> => {
  console.log(`Syncing gamification data for user ${userId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return true;
};
