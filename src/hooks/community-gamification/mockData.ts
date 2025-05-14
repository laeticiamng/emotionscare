
import { GamificationStats, Challenge, Badge } from '@/types/gamification';

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Journal quotidien',
    description: 'Écrivez dans votre journal 5 jours consécutifs',
    points: 100,
    status: 'active',
    progress: 40,
    total: 5,
    type: 'streak'
  },
  {
    id: '2',
    title: 'Maître de la respiration',
    description: 'Complétez 10 exercices de respiration',
    points: 200,
    status: 'ongoing',
    progress: 7,
    total: 10,
    type: 'count'
  },
  {
    id: '3',
    title: 'Explorer la pleine conscience',
    description: 'Essayez 3 sessions différentes de méditation',
    points: 150,
    status: 'completed',
    progress: 3,
    total: 3,
    type: 'exploration'
  },
  {
    id: '4',
    title: 'Pause créative',
    description: 'Prenez 5 pauses créatives pendant vos journées de travail',
    points: 100,
    status: 'available',
    progress: 0,
    total: 5,
    type: 'count'
  },
  {
    id: '5',
    title: 'Analyste émotionnel',
    description: 'Suivez vos émotions pendant 7 jours consécutifs',
    points: 300,
    status: 'active',
    progress: 3,
    total: 7,
    type: 'streak'
  }
];

export const mockAchievements = [
  {
    id: '1',
    name: 'Premier pas',
    description: 'Commencer votre parcours de bien-être',
    unlockedAt: '2025-04-30T10:15:00Z',
    level: 1,
    category: 'engagement'
  },
  {
    id: '2',
    name: 'Explorateur de méditation',
    description: 'Essayer 5 types différents de méditation',
    unlockedAt: '2025-05-05T16:30:00Z',
    level: 2,
    category: 'meditation'
  },
  {
    id: '3',
    name: 'Adepte du calme',
    description: 'Maintenir des niveaux de stress bas pendant 15 jours',
    level: 3,
    category: 'excellence'
  }
];

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Débutant en bien-être",
    description: "Premier pas dans votre parcours de bien-être",
    level: 1,
    image: "beginner.png",
    unlockedAt: "2025-04-15T09:30:00Z",
    category: "milestone"
  },
  {
    id: "2",
    name: "Expert en respiration",
    description: "Maîtrisé 10 exercices de respiration différents",
    level: 2,
    image: "breathing.png",
    unlockedAt: "2025-04-22T14:15:00Z",
    category: "skills"
  },
  {
    id: "3",
    name: "Suivi du stress",
    description: "Suivi de votre stress pendant 30 jours consécutifs",
    level: 3,
    image: "streak.png",
    category: "consistency"
  },
  {
    id: "4",
    name: "Explorateur de méditation",
    description: "Essayé 5 types différents de méditation",
    level: 2,
    image: "meditation.png",
    unlockedAt: "2025-05-03T11:45:00Z",
    category: "exploration"
  }
];

export const mockGamificationStats: GamificationStats = {
  points: 850,
  level: 3,
  nextLevelPoints: 1000,
  badges: mockBadges,
  completedChallenges: 2,
  activeChallenges: 3,
  streakDays: 8,
  progressToNextLevel: 85,
  challenges: mockChallenges,
  recentAchievements: mockBadges.slice(0, 2),
  totalPoints: 850
};
