
import { Badge, Challenge } from '@/types/gamification';

export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Premier pas',
    description: 'Premier scan émotionnel réalisé',
    imageUrl: '/images/badges/first-scan.svg',
    unlockedAt: new Date().toISOString(),
    category: 'Débutant' // Added category field
  },
  {
    id: 'badge-2',
    name: 'Explorateur émotionnel',
    description: 'A utilisé tous les outils de scan émotionnel',
    imageUrl: '/images/badges/explorer.svg',
    unlockedAt: new Date().toISOString(),
    category: 'Intermédiaire' // Added category field
  },
  {
    id: 'badge-3',
    name: 'Maître du journal',
    description: '10 entrées dans le journal émotionnel',
    imageUrl: '/images/badges/journal-master.svg',
    category: 'Expert' // Added category field
  },
  {
    id: 'badge-4',
    name: 'Sommelier musical',
    description: 'A créé 5 playlists personnalisées',
    imageUrl: '/images/badges/music-master.svg',
    category: 'Spécialiste' // Added category field
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    name: '7 jours de pleine conscience',
    description: 'Réaliser un scan émotionnel chaque jour pendant une semaine',
    points: 100,
    status: 'ongoing',
    progress: 5,
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    total: 7
  },
  {
    id: 'challenge-2',
    name: 'Explorateur musical',
    description: 'Écouter 5 genres musicaux différents',
    points: 50,
    status: 'active', // Changed from 'in_progress' to 'active'
    progress: 3,
    total: 5
  },
  {
    id: 'challenge-3',
    name: 'Maître de l\'équilibre',
    description: 'Maintenir un score émotionnel équilibré pendant 3 jours',
    points: 75,
    status: 'available', // Changed from 'open' to 'available'
    progress: 0,
    total: 3
  },
  {
    id: 'challenge-4',
    name: 'Conversation profonde',
    description: 'Avoir 10 échanges avec le coach IA',
    points: 60,
    status: 'active', // Changed from 'in_progress' to 'active'
    progress: 6,
    total: 10
  },
  {
    id: 'challenge-5',
    name: 'Journal régulier',
    description: 'Rédiger 5 entrées dans le journal émotionnel',
    points: 80,
    status: 'active', // Changed from 'in_progress' to 'active'
    progress: 2,
    total: 5
  },
  {
    id: 'challenge-6',
    name: 'Méditation guidée',
    description: 'Compléter le programme de méditation de 7 jours',
    points: 120,
    status: 'available', // Changed from 'open' to 'available'
    progress: 0,
    total: 7
  },
  {
    id: 'challenge-7',
    name: 'Scan facial avancé',
    description: 'Utiliser le scan facial 3 jours consécutifs',
    points: 90,
    status: 'available', // Changed from 'open' to 'available'
    progress: 0,
    total: 3
  },
  {
    id: 'challenge-8',
    name: 'Maîtrise de la voix',
    description: 'Améliorer son score émotionnel vocal 3 fois',
    points: 70,
    status: 'active', // Changed from 'in_progress' to 'active'
    progress: 1,
    total: 3
  },
  {
    id: 'challenge-9',
    name: 'Explorateur de réalité virtuelle',
    description: 'Essayer 3 environnements VR différents',
    points: 100,
    status: 'available', // Changed from 'open' to 'available'
    progress: 0,
    total: 3
  },
  {
    id: 'challenge-10',
    name: 'Connecté au COCON',
    description: 'Participer 5 fois au réseau COCON',
    points: 85,
    status: 'available', // Changed from 'open' to 'available'
    progress: 0,
    total: 5
  }
];

// Add the missing functions

export const getEmotionBasedChallenges = (emotion: string): Challenge[] => {
  // In a real implementation, this would filter challenges based on the emotion
  // For now, return a subset of mock challenges
  return mockChallenges.slice(0, 3);
};

export const generateMockGamificationStats = (userId: string) => {
  return {
    points: 1250,
    level: 3,
    nextLevelPoints: 2000,
    badges: mockBadges.slice(0, 2),
    completedChallenges: 4,
    activeChallenges: 3,
    streakDays: 5,
    progressToNextLevel: 60,
    totalPoints: 1250,
    currentLevel: 3,
    badgesCount: 2,
    pointsToNextLevel: 750,
    lastActivityDate: new Date().toISOString(),
  };
};
