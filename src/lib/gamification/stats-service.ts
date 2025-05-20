
import { GamificationStats, Badge } from '@/types/gamification';

// Example stats service
export const StatsService = {
  getStatsForUser: async (userId: string): Promise<GamificationStats> => {
    // This would typically fetch from an API
    const mockBadges: Badge[] = [
      {
        id: 'badge-1',
        name: 'First Login',
        description: 'You logged in for the first time',
        category: 'general',
        image: '/badges/first-login.png',
        unlocked: true,
        unlockedAt: new Date().toISOString()
      }
    ];
    
    return {
      level: 3,
      xp: 350,
      xpToNextLevel: 500,
      consecutiveLogins: 5,
      totalSessions: 12,
      totalMoodEntries: 28,
      totalMeditationMinutes: 120,
      badges: mockBadges,
      achievements: ['first_login', 'mood_streak_3'],
      streakDays: 5,
      progressToNextLevel: 0.7 // Progress percentage to next level
    };
  }
};

export default StatsService;
