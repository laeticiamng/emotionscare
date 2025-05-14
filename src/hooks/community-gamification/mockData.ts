
import { Badge } from '@/types/types';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Première connexion',
    description: 'Vous vous êtes connecté pour la première fois',
    icon: '🏆',
    type: 'connection',
    threshold: 1
  },
  {
    id: '2',
    name: 'Explorateur',
    description: 'Vous avez exploré toutes les sections de l\'application',
    icon: '🧭',
    type: 'exploration',
    threshold: 5
  },
  {
    id: '3',
    name: 'Maître du journal',
    description: 'Vous avez créé 10 entrées de journal',
    icon: '📔',
    type: 'journal',
    threshold: 10
  }
];

export const mockChallenges = [
  {
    id: '1',
    title: 'Scanner quotidien',
    description: 'Effectuez un scan d\'émotion tous les jours pendant une semaine',
    points: 100,
    status: 'ongoing',
    category: 'daily',
    progress: 3,
    target: 7,
    type: 'streak'
  },
  {
    id: '2',
    title: 'Session VR complète',
    description: 'Complétez une session VR de 10 minutes',
    points: 50,
    status: 'ongoing',
    category: 'vr',
    progress: 0,
    target: 1,
    type: 'achievement'
  },
  {
    id: '3',
    title: 'Supporter la communauté',
    description: 'Répondez à 5 messages de la communauté',
    points: 75,
    status: 'ongoing',
    category: 'social',
    progress: 2,
    target: 5,
    type: 'social'
  }
];

export const mockAchievements = [
  {
    id: '1',
    name: 'Premier scan',
    description: 'Vous avez effectué votre premier scan émotionnel',
    date: '2023-05-15',
    points: 50,
    type: 'milestone'
  },
  {
    id: '2',
    name: 'Badge Bronze',
    description: 'Vous avez atteint le niveau 5',
    date: '2023-05-20',
    points: 100,
    type: 'level'
  },
  {
    id: '3',
    name: 'Entrée de journal profonde',
    description: 'Vous avez écrit une entrée de journal de grande qualité',
    date: '2023-05-25',
    points: 75,
    type: 'quality'
  }
];

export const mockGamificationStats = {
  level: 7,
  points: 1250,
  badges: 12,
  streak: 5,
  nextLevelPoints: 1500,
  recentAchievements: mockAchievements.slice(0, 2)
};

export const mockLeaderboard = [
  {
    id: '1',
    userId: '1',
    name: 'Marie D.',
    score: 2150,
    avatar: '/avatars/user1.jpg',
    rank: 1,
    change: 0,
    streak: 14
  },
  {
    id: '2',
    userId: '2',
    name: 'Thomas R.',
    score: 1890,
    avatar: '/avatars/user2.jpg',
    rank: 2,
    change: 1,
    streak: 7
  },
  {
    id: '3',
    userId: '3',
    name: 'Sophie L.',
    score: 1740,
    avatar: '/avatars/user3.jpg',
    rank: 3,
    change: -1,
    streak: 5
  },
  {
    id: '4',
    userId: '4',
    name: 'Paul M.',
    score: 1520,
    avatar: '/avatars/user4.jpg',
    rank: 4,
    change: 0,
    streak: 3
  },
  {
    id: '5',
    userId: '5',
    name: 'Camille P.',
    score: 1350,
    avatar: '/avatars/user5.jpg',
    rank: 5,
    change: 2,
    streak: 8
  }
];

export default {
  mockBadges,
  mockChallenges,
  mockAchievements,
  mockGamificationStats,
  mockLeaderboard
};
