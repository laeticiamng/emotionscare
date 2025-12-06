// @ts-nocheck
import { Badge } from '@/types/badge';

interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: number;
  rank: number;
  avatarUrl?: string;
  badges: Badge[];
  lastActive?: string;
}

class LeaderboardService {
  getTopUsers(limit = 10): LeaderboardEntry[] {
    // Mock implementation
    return [
      {
        userId: 'user1',
        username: 'EmotionMaster',
        points: 1250,
        level: 8,
        rank: 1,
        avatarUrl: '/images/avatars/avatar1.jpg',
        badges: [], // Corrigé: c'est maintenant un tableau vide plutôt qu'un nombre
        lastActive: new Date().toISOString()
      },
      {
        userId: 'user2',
        username: 'MindfulOne',
        points: 980,
        level: 6,
        rank: 2,
        avatarUrl: '/images/avatars/avatar2.jpg',
        badges: [], // Corrigé: c'est maintenant un tableau vide plutôt qu'un nombre
        lastActive: new Date().toISOString()
      },
      {
        userId: 'user3',
        username: 'ZenExplorer',
        points: 870,
        level: 5,
        rank: 3,
        avatarUrl: '/images/avatars/avatar3.jpg',
        badges: [], // Corrigé: c'est maintenant un tableau vide plutôt qu'un nombre
        lastActive: new Date().toISOString()
      }
    ];
  }
  
  getUserRank(userId: string): LeaderboardEntry | null {
    // Mock implementation
    if (userId === 'user1') {
      return {
        userId: 'user1',
        username: 'EmotionMaster',
        points: 1250,
        level: 8,
        rank: 1,
        avatarUrl: '/images/avatars/avatar1.jpg',
        badges: [], // Corrigé: c'est maintenant un tableau vide plutôt qu'un nombre
        lastActive: new Date().toISOString()
      };
    }
    return null;
  }
}

export default new LeaderboardService();
