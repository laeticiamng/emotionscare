
import { LeaderboardEntry } from '@/types/gamification';

// Get leaderboard entries for a specific context (organization, team, etc.)
export const getLeaderboard = async (
  contextId: string,
  limit: number = 10
): Promise<LeaderboardEntry[]> => {
  try {
    console.log(`Fetching leaderboard for context ${contextId}, limit ${limit}`);
    
    // In a real implementation, this would fetch from an API
    // For now we'll return mock data
    
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: 'user1',
        name: 'Julie Martin',
        avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
        points: 3450,
        level: 7,
        position: 1,
        badges: 12,
        completedChallenges: 24
      },
      {
        userId: 'user2',
        name: 'Thomas Dupont',
        avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
        points: 2980,
        level: 6,
        position: 2,
        badges: 10,
        completedChallenges: 19
      },
      {
        userId: 'user3',
        name: 'Sophie Bernard',
        avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
        points: 2450,
        level: 5,
        position: 3,
        badges: 8,
        completedChallenges: 16
      }
    ];
    
    return mockLeaderboard.slice(0, limit);
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

// Get a user's position in the leaderboard
export const getUserLeaderboardPosition = async (
  userId: string,
  contextId: string
): Promise<LeaderboardEntry | null> => {
  try {
    console.log(`Fetching leaderboard position for user ${userId} in context ${contextId}`);
    
    // In a real implementation, this would fetch from an API
    // For now we'll return mock data
    
    const mockEntry: LeaderboardEntry = {
      userId,
      name: 'Current User',
      avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg',
      points: 1850,
      level: 4,
      position: 12,
      badges: 6,
      completedChallenges: 11
    };
    
    return mockEntry;
    
  } catch (error) {
    console.error('Error fetching user leaderboard position:', error);
    return null;
  }
};
