
import { GamificationStats, Challenge, Badge } from '@/types/gamification';

// Mock data and services for gamification
export async function fetchGamificationStats(userId: string): Promise<GamificationStats> {
  return {
    points: 450,
    level: 3,
    rank: 'Explorer',
    badges: [],
    challenges: [],
    streak: 5,
    nextLevel: {
      points: 600,
      rewards: ['Badge exclusif', 'Nouveau thème']
    },
    achievements: [],
    currentLevel: 3,
    pointsToNextLevel: 150,
    progressToNextLevel: 75,
    totalPoints: 450,
    badgesCount: 7,
    streakDays: 5,
    activeChallenges: 2,
    completedChallenges: 8,
    lastActivityDate: new Date().toISOString(),
    recentAchievements: [],
    progress: 75
  };
}

export async function fetchChallenges(userId: string): Promise<Challenge[]> {
  return [
    {
      id: '1',
      title: 'Scan quotidien',
      description: 'Effectuez un scan émotionnel chaque jour pendant 7 jours',
      points: 100,
      status: 'active',
      category: 'scan',
      progress: 5,
      goal: 7
    },
    {
      id: '2',
      title: 'Journal introspectif',
      description: 'Écrivez dans votre journal 3 fois cette semaine',
      points: 75,
      status: 'ongoing',
      category: 'journal',
      progress: 1,
      goal: 3
    }
  ];
}

export async function completeChallenge(challengeId: string): Promise<void> {
  console.log(`Challenge ${challengeId} completed`);
}

export async function fetchUserBadges(userId: string): Promise<Badge[]> {
  return [
    {
      id: '1',
      name: 'Premier Pas',
      description: 'A effectué son premier scan émotionnel',
      image_url: '/badges/first-scan.png',
      type: 'achievement',
      level: 'Bronze'
    },
    {
      id: '2',
      name: 'Régulier',
      description: '7 jours consécutifs d\'utilisation',
      image_url: '/badges/streak-7.png',
      type: 'streak',
      level: 'Silver'
    }
  ];
}
