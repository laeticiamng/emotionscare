
import { Challenge, GamificationStats, Badge, Achievement } from './types';

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Scanner Débutant',
    description: 'A effectué 5 scans émotionnels',
    image_url: '/badges/scanner-debutant.svg',
    threshold: 5
  },
  {
    id: '2',
    name: 'Expressif',
    description: 'A exploré plus de 10 émotions différentes',
    image_url: '/badges/expressif.svg',
    threshold: 10
  },
  {
    id: '3',
    name: 'Journal intime',
    description: 'A écrit 5 entrées de journal',
    image_url: '/badges/journal-intime.svg',
    threshold: 5
  },
  {
    id: '4',
    name: 'Mélomane',
    description: 'A écouté 10 morceaux de musique thérapeutique',
    image_url: '/badges/melomane.svg',
    threshold: 10
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Scanner quotidien',
    description: 'Effectuez un scan émotionnel chaque jour pendant 7 jours',
    category: 'scan',
    type: 'streak',
    difficulty: 'easy',
    points: 100,
    status: 'available',
    progress: 0,
    requirements: ['Scan émotionnel quotidien'],
    rewards: ['Badge "Scanner régulier"', '100 points']
  },
  {
    id: '2',
    name: 'Expression complète',
    description: 'Identifiez 5 émotions différentes dans vos scans',
    category: 'scan',
    type: 'milestone',
    difficulty: 'medium',
    points: 150,
    status: 'in-progress',
    progress: 60,
    requirements: ['5 émotions différentes identifiées'],
    rewards: ['Badge "Expressif"', '150 points']
  },
  {
    id: '3',
    name: 'Journal hebdomadaire',
    description: 'Écrivez 3 entrées dans votre journal cette semaine',
    category: 'journal',
    type: 'milestone',
    difficulty: 'easy',
    points: 100,
    status: 'available',
    progress: 0,
    requirements: ['3 entrées de journal cette semaine'],
    rewards: ['Badge "Écrivain régulier"', '100 points']
  },
  {
    id: '4',
    name: 'Exploration musicale',
    description: 'Écoutez 5 nouveaux morceaux de musique thérapeutique',
    category: 'music',
    type: 'discovery',
    difficulty: 'easy',
    points: 100,
    status: 'available',
    progress: 0,
    requirements: ['5 nouveaux morceaux écoutés'],
    rewards: ['Badge "Explorateur musical"', '100 points']
  },
  {
    id: '5',
    name: 'Voyage immersif',
    description: 'Effectuez 3 sessions de VR thérapeutique',
    category: 'vr',
    type: 'milestone',
    difficulty: 'medium',
    points: 200,
    status: 'available',
    progress: 0,
    requirements: ['3 sessions VR complétées'],
    rewards: ['Badge "Voyageur virtuel"', '200 points']
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Premier scan',
    description: 'Vous avez effectué votre premier scan émotionnel',
    category: 'scan',
    awardedAt: '2025-04-12T14:30:00Z',
    image_url: '/badges/premier-scan.svg'
  },
  {
    id: '2',
    name: 'Première entrée de journal',
    description: 'Vous avez écrit votre première entrée de journal',
    category: 'journal',
    awardedAt: '2025-04-13T09:15:00Z',
    image_url: '/badges/premiere-entree.svg'
  }
];

export const mockGamificationStats: GamificationStats = {
  level: 3,
  points: 450,
  nextMilestone: 600,
  progressToNextLevel: 75,
  streakDays: 5,
  totalBadges: 2,
  totalChallenges: 1,
  totalScans: 12,
  badges: ['Scanner Débutant', 'Expressif'],
  recentAchievements: mockAchievements,
  lastActivityDate: '2025-05-13T18:30:00Z'
};
