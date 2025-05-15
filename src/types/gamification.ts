
// Export types for the gamification system
export type { 
  Challenge,
  Badge,
  GamificationStats,
  LeaderboardEntry
} from './types';

// Define local types if needed
export interface GamificationAction {
  type: string;
  payload: any;
}

export interface GamificationEvent {
  id: string;
  userId: string;
  type: string;
  points: number;
  metadata?: any;
  timestamp: string;
}
