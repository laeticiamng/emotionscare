
import { GamificationStats, Challenge, Badge } from '@/types/gamification';

/**
 * Fetch gamification stats for a user
 * @param userId User ID
 * @returns Promise with gamification statistics
 */
export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  console.log('Fetching gamification stats for user:', userId);
  
  // Mock response
  return {
    points: 2350,
    level: 5,
    rank: 'Explorer émotionnel',
    badges: [
      {
        id: '1',
        name: 'Premier scan',
        description: 'Félicitations pour votre premier scan émotionnel !',
        image_url: '/badges/first-scan.png',
        type: 'achievement'
      },
      {
        id: '2',
        name: 'Série de 3 jours',
        description: 'Vous avez utilisé l\'application 3 jours de suite',
        image_url: '/badges/streak-3.png',
        type: 'streak'
      }
    ],
    challenges: [],
    streak: 5,
    nextLevel: {
      points: 3000,
      rewards: ['Badge Explorateur Niveau 2', 'Nouvelle visualisation musicale']
    },
    achievements: [],
    currentLevel: 5,
    pointsToNextLevel: 650,
    progressToNextLevel: 78,
    totalPoints: 2350,
    badgesCount: 8,
    streakDays: 5,
    lastActivityDate: new Date().toISOString(),
    activeChallenges: 3,
    completedChallenges: 12,
    nextLevelPoints: 3000
  };
};

/**
 * Fetch challenges for a user
 * @param userId User ID
 * @returns Promise with array of challenges
 */
export const fetchChallenges = async (userId: string): Promise<Challenge[]> => {
  console.log('Fetching challenges for user:', userId);
  
  // Mock response
  return [
    {
      id: '1',
      title: 'Semaine de pleine conscience',
      description: 'Complétez 5 séances de scan émotionnel en 7 jours',
      points: 500,
      status: 'active',
      category: 'scan',
      progress: 3,
      goal: 5,
      icon: 'brain',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Explorer la musicothérapie',
      description: 'Écoutez 3 pistes musicales différentes',
      points: 200,
      status: 'completed',
      category: 'music',
      progress: 3,
      goal: 3,
      icon: 'music',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Premiers pas en VR',
      description: 'Effectuez votre première session VR',
      points: 300,
      status: 'locked',
      category: 'vr',
      progress: 0,
      goal: 1,
      icon: 'eye',
      startDate: null,
      endDate: null
    }
  ];
};

/**
 * Sync gamification data with the server
 * @param userId User ID
 * @param action Action that triggered the sync
 * @returns Promise with updated gamification stats
 */
export const syncGamificationData = async (userId: string, action: string): Promise<GamificationStats> => {
  console.log(`Syncing gamification data for user ${userId} after action: ${action}`);
  
  // Just return the stats for now
  return fetchGamificationStats(userId);
};
