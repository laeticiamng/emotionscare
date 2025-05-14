
import { GamificationStats, Badge, Challenge } from '@/types/gamification';

// Mock data for gamification stats
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Scan',
    description: 'Complete your first emotion scan',
    imageUrl: '/badges/first-scan.png'
  },
  {
    id: '2',
    name: 'Streak Master',
    description: 'Complete scans 5 days in a row',
    imageUrl: '/badges/streak.png'
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Complete 10 scans',
    description: 'Scan your emotions 10 times',
    points: 100,
    status: 'active',
    progress: 3,
    total: 10,
    type: 'scan'
  },
  {
    id: '2',
    title: '7-Day Streak',
    description: 'Complete a scan every day for 7 days',
    points: 200,
    status: 'ongoing',
    progress: 4,
    total: 7,
    type: 'streak'
  }
];

// Function to fetch gamification stats
export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // In a real application, this would be an API call
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    points: 150,
    level: 2,
    nextLevelPoints: 300,
    badges: mockBadges,
    completedChallenges: 3,
    activeChallenges: 2,
    streakDays: 4,
    progressToNextLevel: 50,
    challenges: mockChallenges,
    recentAchievements: [mockBadges[0]]
  };
};

// Function to process an emotion scan for gamification
export const processEmotionForBadges = async (userId: string, emotionData: any) => {
  // In a real implementation, this would check if the user earned any badges
  // For now, we return mock data
  return {
    points: 10,
    newBadges: [],
    challengesUpdated: []
  };
};

// Function to update a user's challenge progress
export const updateChallengeProgress = async (userId: string, challengeId: string, progress: number) => {
  // In a real implementation, this would update the challenge progress in the database
  console.log(`Updating challenge ${challengeId} for user ${userId} with progress ${progress}`);
  return true;
};

// Function to complete a challenge
export const completeChallenge = async (userId: string, challengeId: string) => {
  // In a real implementation, this would mark a challenge as completed
  console.log(`Completing challenge ${challengeId} for user ${userId}`);
  return {
    points: 50,
    badgeEarned: null
  };
};

// Function to get active challenges for a user
export const getActiveChallenges = async (userId: string) => {
  // In a real implementation, this would fetch active challenges from the database
  return mockChallenges.filter(c => c.status === 'active' || c.status === 'ongoing');
};

// Function to get completed challenges for a user
export const getCompletedChallenges = async (userId: string) => {
  // In a real implementation, this would fetch completed challenges from the database
  return mockChallenges.filter(c => c.status === 'completed');
};
