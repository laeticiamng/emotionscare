
import { Badge, Challenge } from '@/types/badge';
import { LeaderboardEntry } from '@/types/dashboard';

// Badges factices pour la démonstration
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Méditation Zen',
    description: 'Effectué 5 sessions de méditation',
    imageUrl: '/badges/meditation.png',
    unlocked: true,
    level: 1,
    category: 'méditation',
    tier: 'bronze'
  },
  {
    id: '2',
    name: 'Expert en Bien-être',
    description: 'Maintenu un score émotionnel de 80+ pendant une semaine',
    imageUrl: '/badges/wellbeing.png',
    unlocked: false,
    level: 2,
    category: 'bien-être',
    tier: 'silver'
  },
  {
    id: '3',
    name: 'Maître du Journal',
    description: 'Écrit dans votre journal pendant 14 jours consécutifs',
    imageUrl: '/badges/journal.png',
    unlocked: true,
    level: 2,
    category: 'journal',
    tier: 'gold'
  }
];

// Défis factices pour la démonstration
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Explorateur de Bien-être',
    description: 'Essayez toutes les fonctionnalités disponibles sur EmotionsCare',
    points: 150,
    progress: 4,
    goal: 5,
    category: 'exploration',
    completed: false,
    status: 'en cours'
  },
  {
    id: '2',
    title: 'Série Journalière',
    description: 'Écrivez dans votre journal 7 jours consécutifs',
    points: 100,
    progress: 7,
    goal: 7,
    category: 'journal',
    completed: true,
    status: 'terminé'
  },
  {
    id: '3',
    title: 'Scientifique Émotionnel',
    description: 'Faites 10 analyses émotionnelles en une semaine',
    points: 120,
    progress: 6,
    goal: 10,
    category: 'analyse',
    completed: false,
    status: 'en cours'
  }
];

// Données factices pour le tableau de classement
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Alexandra M.',
    avatar: '/avatars/avatar-1.png',
    points: 1250,
    rank: 1,
    trend: 'up'
  },
  {
    id: '2',
    userId: 'user2',
    name: 'Thomas R.',
    avatar: '/avatars/avatar-2.png',
    points: 1120,
    rank: 2,
    trend: 'neutral'
  },
  {
    id: '3',
    userId: 'user3',
    name: 'Sophie L.',
    avatar: '/avatars/avatar-3.png',
    points: 980,
    rank: 3,
    trend: 'up'
  },
  {
    id: '4',
    userId: 'user4',
    name: 'Marc D.',
    avatar: '/avatars/avatar-4.png',
    points: 920,
    rank: 4,
    trend: 'down'
  },
  {
    id: '5',
    userId: 'user5',
    name: 'Émilie P.',
    avatar: '/avatars/avatar-5.png',
    points: 850,
    rank: 5,
    trend: 'neutral'
  }
];

export const mockWeeklyGoals = [
  {
    id: '1',
    title: 'Méditer 10 minutes par jour',
    progress: 4,
    total: 7,
    category: 'méditation'
  },
  {
    id: '2',
    title: 'Écrire dans le journal 5 jours',
    progress: 3,
    total: 5,
    category: 'journal'
  },
  {
    id: '3',
    title: 'Compléter 3 sessions de VR',
    progress: 1,
    total: 3,
    category: 'vr'
  }
];
