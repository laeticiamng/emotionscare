
import { v4 as uuid } from 'uuid';
import { GamificationStats, Challenge, Badge, Achievement, LeaderboardEntry } from '@/types/gamification';

// Mock data for gamification
const mockStats: GamificationStats = {
  points: 1245,
  level: 5,
  currentLevel: 5,
  rank: 'Explorer',
  streak: 7,
  badges: [],
  challenges: [],
  achievements: [],
  nextLevel: {
    points: 1500,
    rewards: ['Badge Explorer Niveau 6', 'Accès aux défis avancés']
  },
  pointsToNextLevel: 255,
  progressToNextLevel: 83,
  totalPoints: 1245,
  badgesCount: 12,
  streakDays: 7,
  lastActivityDate: new Date().toISOString(),
  activeChallenges: 3,
  completedChallenges: 25,
  nextLevelPoints: 1500
};

// Process an emotion scan and check for earned badges
export async function processEmotionForBadges(emotion: string, userId: string) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a random points amount
  const points = Math.floor(Math.random() * 20) + 5;
  
  // Randomly decide if a new badge is earned (20% chance)
  const earnNewBadge = Math.random() < 0.2;
  
  if (earnNewBadge) {
    return {
      points,
      newBadges: [
        {
          id: uuid(),
          name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Explorer`,
          description: `Vous avez exploré l'émotion ${emotion} de manière consciente.`,
          icon: 'award'
        }
      ]
    };
  }
  
  // No new badge
  return {
    points,
    newBadges: []
  };
}

// Fetch a user's gamification stats
export async function fetchGamificationStats(userId: string): Promise<GamificationStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock data
  return {
    ...mockStats,
    // Add some randomness to make it look more realistic
    points: mockStats.points + Math.floor(Math.random() * 50),
    streak: Math.floor(Math.random() * 14),
    // Calculate the other values based on the points
    pointsToNextLevel: 1500 - (mockStats.points + Math.floor(Math.random() * 50))
  };
}

// Fetch a user's active challenges
export async function fetchChallenges(userId: string): Promise<Challenge[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a few mock challenges
  return [
    {
      id: uuid(),
      title: 'Streak de 5 jours',
      description: 'Complétez un scan émotionnel 5 jours de suite',
      points: 100,
      status: 'active',
      category: 'streak',
      progress: 3,
      goal: 5,
      icon: 'flame'
    },
    {
      id: uuid(),
      title: 'Explorer la joie',
      description: 'Identifiez et analysez un moment de joie dans votre journée',
      points: 50,
      status: 'active',
      category: 'emotion',
      icon: 'smile'
    },
    {
      id: uuid(),
      title: 'Méditation matinale',
      description: 'Complétez une session de méditation guidée le matin',
      points: 75,
      status: 'locked',
      category: 'mindfulness',
      icon: 'brain'
    }
  ];
}

// Sync gamification data and return updated stats
export async function syncGamificationData(userId: string): Promise<GamificationStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Return updated mock stats
  return await fetchGamificationStats(userId);
}

// Fetch leaderboard data
export async function fetchLeaderboard(teamId?: string): Promise<LeaderboardEntry[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  // Generate mock leaderboard data
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 0; i < 10; i++) {
    entries.push({
      userId: uuid(),
      name: `User ${i + 1}`,
      points: 1000 - (i * 90) + Math.floor(Math.random() * 30),
      rank: i + 1,
      badges: 10 - Math.floor(i / 2),
      streak: Math.floor(Math.random() * 10),
      department: ['Marketing', 'Engineering', 'Sales', 'HR', 'Product'][Math.floor(Math.random() * 5)]
    });
  }
  
  return entries;
}

// Complete a challenge and get rewards
export async function completeChallenge(challengeId: string, userId: string): Promise<{
  success: boolean;
  points: number;
  badges?: Badge[];
  message: string;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simulate success
  const success = Math.random() < 0.9;
  
  if (success) {
    const points = Math.floor(Math.random() * 100) + 50;
    
    // 30% chance to earn a badge
    const earnBadge = Math.random() < 0.3;
    
    return {
      success: true,
      points,
      badges: earnBadge ? [{
        id: uuid(),
        name: 'Completer de Défis',
        description: 'Vous avez complété un défi avec succès!',
        icon: 'award'
      }] : undefined,
      message: 'Défi complété avec succès!'
    };
  }
  
  return {
    success: false,
    points: 0,
    message: 'Erreur lors de la complétion du défi.'
  };
}
