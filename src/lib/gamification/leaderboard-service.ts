
import { LeaderboardEntry } from '@/types/gamification';

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Mock implementation
  return [
    {
      id: '1',
      user_id: '101',
      user_name: 'Marie L.',
      points: 1250,
      level: 8,
      rank: 1
    },
    {
      id: '2',
      user_id: '102',
      user_name: 'Thomas G.',
      points: 980,
      level: 6,
      rank: 2
    },
    {
      id: '3',
      user_id: '103',
      user_name: 'Sophie M.',
      points: 870,
      level: 5,
      rank: 3
    }
  ];
};
