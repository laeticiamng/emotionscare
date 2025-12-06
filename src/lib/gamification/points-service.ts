// @ts-nocheck

import { logger } from '@/lib/logger';

// Award points to a user
export const awardPoints = async (
  userId: string,
  points: number,
  reason: string
): Promise<boolean> => {
  try {
    logger.info('Awarding points', { points, userId, reason }, 'API');
    
    // In a real implementation, this would make an API call
    // For now, we'll simulate a successful points award
    
    return true;
  } catch (error) {
    logger.error('Error awarding points', error as Error, 'API');
    return false;
  }
};

// Get user's point history
export const getUserPointHistory = async (
  userId: string,
  limit: number = 10
): Promise<PointHistoryEntry[]> => {
  try {
    logger.info('Fetching point history', { userId, limit }, 'API');
    
    // In a real implementation, this would fetch from an API
    // For now we'll return mock data
    
    const mockHistory: PointHistoryEntry[] = [
      {
        id: 'ph1',
        userId,
        points: 50,
        reason: 'Complétion du scan émotionnel quotidien',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 'ph2',
        userId,
        points: 100,
        reason: 'Challenge hebdomadaire complété',
        timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        id: 'ph3',
        userId,
        points: 25,
        reason: 'Session de méditation terminée',
        timestamp: new Date(Date.now() - 345600000).toISOString() // 4 days ago
      }
    ];
    
    return mockHistory.slice(0, limit);
    
  } catch (error) {
    logger.error('Error fetching point history', error as Error, 'API');
    return [];
  }
};

// Interface for point history entries
interface PointHistoryEntry {
  id: string;
  userId: string;
  points: number;
  reason: string;
  timestamp: string;
}
