
import { Challenge, Badge } from '@/types/gamification';

// Example challenge service
export const ChallengeService = {
  getChallengesForUser: async (userId: string): Promise<Challenge[]> => {
    // This would typically fetch from an API
    return [
      {
        id: 'challenge-1',
        title: 'Daily Check-in',
        name: 'Daily Check-in',
        description: 'Log your mood every day for a week',
        type: 'streak',
        targetValue: 7,
        currentValue: 3,
        completed: false,
        difficulty: 'easy',
        category: 'general',
        reward: {
          id: 'badge-weekly-checker',
          name: 'Weekly Checker',
          description: 'Checked in every day for a week',
          category: 'consistency',
          image: '/badges/weekly-checker.png',
          unlocked: false
        }
      },
      {
        id: 'challenge-2',
        title: 'Emotion Master',
        name: 'Emotion Master',
        description: 'Identify 10 different emotions',
        type: 'count',
        targetValue: 10,
        currentValue: 6,
        completed: false,
        difficulty: 'medium',
        category: 'emotion',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        reward: {
          id: 'badge-emotion-master',
          name: 'Emotion Master',
          description: 'Identified 10 different emotions',
          category: 'emotion',
          image: '/badges/emotion-master.png',
          unlocked: false
        }
      }
    ];
  },

  completeChallenge: async (userId: string, challengeId: string): Promise<Badge> => {
    // This would typically update the challenge status in an API
    // and return the unlocked badge
    const badge: Badge = {
      id: `badge-${challengeId}`,
      name: 'Challenge Completed',
      description: 'You completed a challenge',
      category: 'achievement',
      image: '/badges/challenge-complete.png',
      unlocked: true,
      unlockedAt: new Date().toISOString()
    };
    
    return badge;
  },

  // Additional challenge-related functions
};

export default ChallengeService;
