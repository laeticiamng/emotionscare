
import { GamificationStats, Badge, Challenge, Achievement, LeaderboardEntry } from '@/types/gamification';
import { mockBadges, mockChallenges, mockStats, mockAchievements } from '@/hooks/community-gamification/mockData';

// Fetch gamification stats for a given user
export async function fetchGamificationStats(userId: string): Promise<GamificationStats> {
  // In a real implementation, this would fetch data from an API
  // For now, we'll return mock data with a delay to simulate a network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockStats,
        badges: mockBadges,
        challenges: mockChallenges,
        recentAchievements: mockAchievements,
      });
    }, 500);
  });
}

// Alias for backward compatibility
export const getUserGamificationStats = fetchGamificationStats;

// Fetch challenges for a user
export async function fetchChallenges(userId: string): Promise<Challenge[]> {
  // In a real implementation, this would fetch data from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChallenges);
    }, 300);
  });
}

// Fetch badges for a user
export async function fetchBadges(userId: string): Promise<Badge[]> {
  // In a real implementation, this would fetch data from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBadges);
    }, 300);
  });
}

// Sync gamification data with server
export async function syncGamificationData(userId: string, data: Partial<GamificationStats>): Promise<GamificationStats> {
  // In a real implementation, this would send data to an API
  console.log('Syncing gamification data for user', userId, data);
  return fetchGamificationStats(userId);
}

// Record activity for gamification system
export async function recordActivity(
  userId: string,
  activityType: string,
  details?: Record<string, any>
): Promise<{ points: number; newBadges: Badge[]; challengesUpdated: Challenge[] }> {
  // In a real implementation, this would send data to an API
  console.log('Recording activity', { userId, activityType, details });
  
  // Mock response
  return {
    points: Math.floor(Math.random() * 20) + 5,
    newBadges: Math.random() > 0.8 ? [mockBadges[0]] : [],
    challengesUpdated: Math.random() > 0.7 ? [mockChallenges[0]] : []
  };
}

// Get leaderboard data
export async function fetchLeaderboard(
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly',
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  // In a real implementation, this would fetch data from an API
  const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: limit }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    points: 1000 - i * 50,
    rank: i + 1,
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
    team: Math.random() > 0.5 ? 'Team A' : 'Team B',
    level: Math.floor(Math.random() * 10) + 1
  }));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLeaderboard);
    }, 500);
  });
}

// Calculate level from points
export function calculateLevel(points: number): { level: number; nextLevelPoints: number; progress: number } {
  // Simple level calculation: each level needs level * 100 points
  let level = 1;
  let pointsNeeded = 100;
  let remainingPoints = points;
  
  while (remainingPoints >= pointsNeeded) {
    remainingPoints -= pointsNeeded;
    level++;
    pointsNeeded = level * 100;
  }
  
  const progress = (remainingPoints / pointsNeeded) * 100;
  
  return {
    level,
    nextLevelPoints: pointsNeeded,
    progress
  };
}
