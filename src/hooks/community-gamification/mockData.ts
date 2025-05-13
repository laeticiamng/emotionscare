
import { Challenge, Badge } from '@/types/gamification';
import { GamificationStats } from './types';

// Mock badges for community gamification
export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Débutant',
    description: 'Premier pas dans la communauté',
    image: '/badges/community-starter.png',
    dateEarned: '2025-01-15T12:00:00Z',
    imageUrl: '/badges/community-starter.png',
    category: 'community'
  },
  {
    id: 'badge-2',
    name: 'Contributeur',
    description: 'A aidé 5 membres de la communauté',
    image: '/badges/community-contributor.png',
    dateEarned: '2025-02-20T14:30:00Z',
    imageUrl: '/badges/community-contributor.png',
    category: 'community'
  },
  {
    id: 'badge-3',
    name: 'Mentor',
    description: 'A partagé 10 conseils utiles',
    image: '/badges/community-mentor.png',
    dateEarned: '2025-03-10T09:15:00Z',
    imageUrl: '/badges/community-mentor.png', 
    category: 'community'
  },
  {
    id: 'badge-4',
    name: 'Expert',
    description: 'A participé à tous les défis du mois',
    image: '/badges/community-expert.png',
    dateEarned: '2025-04-05T16:45:00Z',
    imageUrl: '/badges/community-expert.png',
    category: 'community'
  }
];

// Mock challenges for community gamification
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Première connexion',
    description: 'Se connecter 7 jours consécutifs',
    type: 'streak',
    completed: false,
    progress: 5,
    category: 'engagement',
    points: 50,
    status: 'active',
    name: 'Première connexion'
  },
  {
    id: 'challenge-2',
    title: 'Partage social',
    description: 'Partager 3 expériences positives',
    type: 'count',
    completed: false,
    progress: 1,
    category: 'social',
    points: 75,
    status: 'active',
    name: 'Partage social'
  },
  {
    id: 'challenge-3',
    title: 'Méditation matinale',
    description: 'Compléter une session de méditation avant 9h',
    type: 'daily',
    completed: false,
    progress: 0,
    category: 'mindfulness',
    points: 30,
    status: 'available',
    name: 'Méditation matinale'
  }
];

// Generate mock gamification stats
export const generateMockGamificationStats = (userId: string): GamificationStats => {
  return {
    level: 4,
    points: 550,
    nextLevelPoints: 700,
    badges: mockBadges,
    challenges: mockChallenges,
    recentAchievements: [
      {
        type: 'badge',
        id: 'badge-2',
        name: 'Contributeur',
        timestamp: new Date('2025-04-30T10:15:00Z'),
        points: 75
      },
      {
        type: 'challenge',
        id: 'challenge-completed-1',
        name: 'Streak hebdomadaire',
        timestamp: new Date('2025-04-28T08:30:00Z'),
        points: 50
      }
    ],
    currentLevel: 4,
    pointsToNextLevel: 150,
    progressToNextLevel: 75,
    totalPoints: 550,
    badgesCount: mockBadges.length,
    streakDays: 8,
    lastActivityDate: new Date().toISOString()
  };
};

// Generate emotion-based challenges
export const getEmotionBasedChallenges = (emotion: string): Challenge[] => {
  const challenges: Challenge[] = [
    {
      id: `emotion-challenge-${Date.now()}`,
      title: `Exercice de ${emotion}`,
      description: `Activité personnalisée basée sur votre émotion: ${emotion}`,
      type: 'emotion',
      completed: false,
      progress: 0,
      category: 'emotional',
      points: 40,
      status: 'available',
      name: `Exercice de ${emotion}`
    }
  ];
  
  return challenges;
};
