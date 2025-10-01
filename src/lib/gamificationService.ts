// @ts-nocheck
import { Badge, Challenge, GamificationStats } from '@/types/gamification';

// Mock service for gamification features
const GamificationService = {
  // Get user badges
  getUserBadges: async (userId: string): Promise<Badge[]> => {
    // This would fetch from an API in a real implementation
    const mockBadges: Badge[] = [
      {
        id: 'badge1',
        name: 'First Step',
        description: 'Completed your first session',
        category: 'achievement',
        image: '/badges/first-step.png',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      },
      {
        id: 'badge2',
        name: 'Emotion Explorer',
        description: 'Discovered 5 different emotions',
        category: 'emotion',
        image: '/badges/emotion-explorer.png',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      },
      {
        id: 'badge3',
        name: 'Consistency King',
        description: 'Logged in for 7 consecutive days',
        category: 'streak',
        image: '/badges/consistency-king.png',
        progress: 5,
        threshold: 7,
        unlocked: false
      }
    ];
    
    return mockBadges;
  },
  
  // Get user challenges
  getUserChallenges: async (userId: string): Promise<Challenge[]> => {
    const mockBadges: Badge[] = [
      {
        id: 'badge4',
        name: 'Meditation Master',
        description: 'Complete 10 meditation sessions',
        category: 'meditation',
        image: '/badges/meditation-master.png',
        unlocked: false,
        progress: 7,
        threshold: 10
      },
      {
        id: 'badge5',
        name: 'Mood Tracker',
        description: 'Track your mood for 14 days',
        category: 'tracking',
        image: '/badges/mood-tracker.png',
        unlocked: false,
        progress: 10,
        threshold: 14
      }
    ];
    
    // This would fetch from an API in a real implementation
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge1',
        title: 'Daily Check-in',
        name: 'Daily Check-in',
        description: 'Check in every day for a week',
        type: 'streak',
        targetValue: 7,
        currentValue: 5,
        completed: false,
        difficulty: 'easy',
        category: 'daily',
        reward: mockBadges[0],
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'challenge2',
        title: 'Emotion Diversity',
        name: 'Emotion Diversity',
        description: 'Identify 10 different emotions',
        type: 'collection',
        targetValue: 10,
        currentValue: 6,
        completed: false,
        difficulty: 'medium',
        category: 'emotion',
        reward: mockBadges[1]
      }
    ];
    
    return mockChallenges;
  },
  
  // Get user gamification stats
  getUserStats: async (userId: string): Promise<GamificationStats> => {
    // This would fetch from an API in a real implementation
    const badges = await GamificationService.getUserBadges(userId);
    
    const mockStats: GamificationStats = {
      level: 4,
      xp: 850,
      xpToNextLevel: 1000,
      consecutiveLogins: 5,
      totalSessions: 23,
      totalMoodEntries: 42,
      totalMeditationMinutes: 180,
      badges: badges,
      achievements: ['first_login', 'first_scan', 'three_day_streak'],
      streakDays: 5,
      progressToNextLevel: 0.85
    };
    
    return mockStats;
  },
  
  // Award a badge to a user
  awardBadge: async (userId: string, badgeType: string): Promise<Badge> => {
    // This would call an API to award the badge in a real implementation
    const newBadge: Badge = {
      id: `badge-${Date.now()}`,
      name: 'New Achievement',
      description: 'You earned a new achievement',
      imageUrl: '/badges/new-achievement.png',
      unlocked: true,
      category: 'achievement',
      image: '/badges/new-achievement.png'
    };
    
    return newBadge;
  },
  
  // Update challenge progress
  updateChallengeProgress: async (userId: string, challengeId: string, progress: number): Promise<Challenge> => {
    // This would call an API to update progress in a real implementation
    const updatedChallenge: Challenge = {
      id: challengeId,
      title: 'Updated Challenge',
      name: 'Updated Challenge',
      description: 'This challenge was updated',
      type: 'progress',
      targetValue: 10,
      currentValue: progress,
      completed: progress >= 10,
      difficulty: 'medium',
      category: 'progress'
    };
    
    return updatedChallenge;
  }
};

export default GamificationService;

export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  return GamificationService.getUserStats(userId);
};

export const fetchChallenges = async (userId: string): Promise<Challenge[]> => {
  return GamificationService.getUserChallenges(userId);
};

export const fetchUserBadges = async (userId: string): Promise<Badge[]> => {
  return GamificationService.getUserBadges(userId);
};
