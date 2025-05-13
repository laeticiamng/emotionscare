
import { Challenge, Badge, GamificationStats } from '@/types/gamification';

// Mock badges data
const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Première utilisation de l\'application',
    image: '/badges/first-step.png',
    dateEarned: '2025-05-01'
  },
  {
    id: '2',
    name: 'Explorateur émotionnel',
    description: 'A scanné 10 émotions différentes',
    image: '/badges/emotional-explorer.png',
    dateEarned: '2025-05-05'
  },
  {
    id: '3',
    name: 'Scribe régulier',
    description: 'A écrit dans le journal 5 jours de suite',
    image: '/badges/regular-scribe.png',
    dateEarned: '2025-05-10'
  }
];

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Méditation quotidienne',
    description: 'Méditez pendant 5 minutes chaque jour',
    type: 'daily',
    completed: false,
    progress: 60,
    category: 'mindfulness',
    points: 50,
    deadline: '2025-05-20'
  },
  {
    id: '2',
    title: 'Journal émotionnel',
    description: 'Écrivez dans votre journal 3 jours de suite',
    type: 'streak',
    completed: false,
    progress: 30,
    category: 'emotional-awareness',
    points: 75
  },
  {
    id: '3',
    title: 'Partage social',
    description: 'Partagez une réussite avec la communauté',
    type: 'social',
    completed: true,
    progress: 100,
    category: 'community',
    points: 25
  }
];

// Mock gamification stats
const mockStats: GamificationStats = {
  level: 3,
  points: 275,
  nextLevelPoints: 400,
  badges: mockBadges,
  challengesCompleted: 5,
  streak: 4,
  currentLevel: 3,
  pointsToNextLevel: 125,
  progressToNextLevel: 68,
  totalPoints: 275,
  badgesCount: 3,
  streakDays: 4,
  lastActivityDate: '2025-05-12',
  challenges: mockChallenges,
  recentAchievements: [
    {
      type: 'badge',
      id: '3',
      name: 'Scribe régulier',
      timestamp: new Date('2025-05-10'),
      points: 100
    },
    {
      type: 'challenge',
      id: '3',
      name: 'Partage social',
      timestamp: new Date('2025-05-11'),
      points: 25
    }
  ]
};

/**
 * Get all badges for the current user
 */
export async function getBadges(): Promise<Badge[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockBadges;
}

/**
 * Get all challenges for the current user
 */
export async function getChallenges(): Promise<Challenge[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockChallenges;
}

/**
 * Get gamification stats for the current user
 */
export async function getGamificationStats(): Promise<GamificationStats> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockStats;
}

/**
 * Accept a challenge
 */
export async function acceptChallenge(challengeId: string): Promise<boolean> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

/**
 * Complete a challenge
 */
export async function completeChallenge(challengeId: string): Promise<boolean> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
}

/**
 * Get personalized challenge recommendations
 */
export async function getPersonalizedChallenges(emotion?: string): Promise<Challenge[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockChallenges.filter(c => !c.completed).slice(0, 2);
}
