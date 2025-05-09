import { Badge, Challenge } from '@/types';

// Mock badges data
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Explorateur Émotionnel',
    description: 'Réalisez votre premier scan émotionnel',
    image: '/badges/scanner-badge.png',
    criteria: 'Effectuer un scan émotionnel',
    unlocked: true,
    icon_url: '/badges/scanner-badge.png'
  },
  {
    id: '2',
    name: 'Journalier Assidu',
    description: 'Écrivez 7 entrées de journal',
    image: '/badges/journal-badge.png',
    criteria: 'Écrire 7 entrées de journal',
    unlocked: false,
    progress: 3,
    maxProgress: 7,
    icon_url: '/badges/journal-badge.png'
  },
  {
    id: '3',
    name: 'Maître de la Détente',
    description: 'Complétez 5 sessions de VR',
    image: '/badges/vr-badge.png',
    criteria: 'Compléter 5 sessions de VR',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    icon_url: '/badges/vr-badge.png'
  },
];

// Mock challenges data
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Scan Quotidien',
    description: 'Effectuez un scan émotionnel chaque jour pendant une semaine',
    points: 50,
    completed: false,
    progress: 3,
    maxProgress: 7,
    total: 7
  },
  {
    id: '2',
    title: 'Rédacteur de Journal',
    description: 'Écrivez au moins trois entrées de journal par semaine',
    points: 75,
    completed: false,
    progress: 1,
    maxProgress: 3,
    total: 3
  },
  {
    id: '3',
    title: 'Explorateur VR',
    description: 'Essayez trois sessions VR différentes ce mois-ci',
    points: 100,
    completed: false,
    progress: 1,
    maxProgress: 3,
    total: 3
  },
];
