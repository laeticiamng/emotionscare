
import { GamificationStats, Badge, Challenge, Achievement, GamificationAction } from '@/types/gamification';

/**
 * Fetches the gamification stats for a user
 */
export const fetchGamificationStats = async (userId: string): Promise<GamificationStats> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        points: 750,
        level: 5,
        rank: 'Explorer émotionnel',
        badges: [
          {
            id: '1',
            name: 'Premier scan',
            description: 'Vous avez effectué votre premier scan émotionnel',
            icon: 'Smile',
            image_url: '/images/badges/first-scan.png'
          },
          {
            id: '2',
            name: 'Journal régulier',
            description: 'Vous avez écrit dans votre journal 5 jours consécutifs',
            icon: 'BookOpen',
            image_url: '/images/badges/journal-streak.png'
          }
        ],
        challenges: [
          {
            id: '1',
            title: 'Semaine de pleine conscience',
            description: 'Faites 5 séances VR de pleine conscience cette semaine',
            points: 150,
            status: 'active',
            category: 'vr',
            progress: 2,
            goal: 5
          },
          {
            id: '2',
            title: 'Connexion émotionnelle',
            description: 'Partagez votre ressenti avec 3 collègues',
            points: 100,
            status: 'locked',
            category: 'social'
          }
        ],
        streak: 3,
        nextLevel: {
          points: 250,
          rewards: ['Nouvelle séance VR', 'Badge exclusif']
        },
        achievements: [
          {
            id: '1',
            title: 'Premier pas',
            description: 'Vous avez complété votre premier scan émotionnel',
            date: new Date().toISOString(),
            type: 'scan',
            points: 50
          }
        ]
      });
    }, 500);
  });
};

/**
 * Processes an emotion for potential badges
 */
export const processEmotionForBadges = async (userId: string, emotion: string): Promise<Badge[]> => {
  // Simulate processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Determine if any badges should be awarded
      const newBadges: Badge[] = [];
      
      // First emotion badge
      if (Math.random() > 0.8) {
        newBadges.push({
          id: 'emotion-1',
          name: 'Premier ressenti',
          description: 'Vous avez partagé votre première émotion',
          icon: 'Heart',
          image_url: '/images/badges/first-emotion.png'
        });
      }
      
      resolve(newBadges);
    }, 300);
  });
};

/**
 * Processes a gamification action
 */
export const processGamificationAction = async (userId: string, action: GamificationAction): Promise<{
  points: number;
  badges: Badge[];
  levelUp?: boolean;
}> => {
  // Simulate processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Default response
      const result = {
        points: 0,
        badges: [] as Badge[],
        levelUp: false
      };
      
      // Calculate points based on action type
      switch (action.type) {
        case 'SCAN':
          result.points = 10;
          break;
        case 'JOURNAL':
          result.points = 15;
          break;
        case 'COACH':
          result.points = 20;
          break;
        case 'VR':
          result.points = 25;
          break;
        case 'CHALLENGE':
          result.points = action.data?.points || 50;
          break;
        case 'STREAK':
          result.points = action.data?.days * 5 || 5;
          break;
        case 'LOGIN':
          result.points = 5;
          break;
      }
      
      // Randomly determine if user levels up
      if (Math.random() > 0.9) {
        result.levelUp = true;
      }
      
      // Randomly add badges
      if (Math.random() > 0.8) {
        result.badges.push({
          id: `badge-${Date.now()}`,
          name: `Badge ${action.type}`,
          description: `Vous avez gagné ce badge en effectuant l'action ${action.type}`,
          icon: 'Award',
          image_url: `/images/badges/${action.type.toLowerCase()}.png`
        });
      }
      
      resolve(result);
    }, 400);
  });
};

/**
 * Gets user gamification stats
 */
export const getUserGamificationStats = async (userId: string): Promise<GamificationStats> => {
  return fetchGamificationStats(userId);
};
