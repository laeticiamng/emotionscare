
import { Badge, Challenge } from '@/types';

// Mock badges data
export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'Explorateur Émotionnel',
    description: 'Réalisez votre premier scan émotionnel',
    image_url: '/badges/scanner-badge.png',
    criteria: 'Effectuer un scan émotionnel',
    unlocked: true,
    icon_url: '/badges/scanner-badge.png',
    user_id: 'user-1', // Added required field
    icon: 'badge', // Added required field
    level: 1 // Added required field
  },
  {
    id: '2',
    name: 'Journalier Assidu',
    description: 'Écrivez 7 entrées de journal',
    image_url: '/badges/journal-badge.png',
    criteria: 'Écrire 7 entrées de journal',
    unlocked: false,
    progress: 3,
    maxProgress: 7,
    icon_url: '/badges/journal-badge.png',
    user_id: 'user-1', // Added required field
    icon: 'journal', // Added required field
    level: 1 // Added required field
  },
  {
    id: '3',
    name: 'Maître de la Détente',
    description: 'Complétez 5 sessions de VR',
    image_url: '/badges/vr-badge.png',
    criteria: 'Compléter 5 sessions de VR',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    icon_url: '/badges/vr-badge.png',
    user_id: 'user-1', // Added required field
    icon: 'vr', // Added required field
    level: 1 // Added required field
  },
];

// Mock challenges data
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: 'Scan Quotidien',
    title: 'Scan Quotidien', // Added required field
    description: 'Effectuez un scan émotionnel chaque jour pendant une semaine',
    points: 50,
    completed: false,
    progress: 3,
    maxProgress: 7,
    target: 7, // Added required field
    total: 7
  },
  {
    id: '2',
    name: 'Rédacteur de Journal',
    title: 'Rédacteur de Journal', // Added required field
    description: 'Écrivez au moins trois entrées de journal par semaine',
    points: 75,
    completed: false,
    progress: 1,
    maxProgress: 3,
    target: 3, // Added required field
    total: 3
  },
  {
    id: '3',
    name: 'Explorateur VR',
    title: 'Explorateur VR', // Added required field
    description: 'Essayez trois sessions VR différentes ce mois-ci',
    points: 100,
    completed: false,
    progress: 1,
    maxProgress: 3,
    target: 3, // Added required field
    total: 3
  },
];

// Add these functions to export the mock data
export const fetchBadges = async (): Promise<Badge[]> => {
  return mockBadges;
};

export const fetchChallenges = async (): Promise<Challenge[]> => {
  return mockChallenges;
};

export const completeChallenge = async (id: string): Promise<Challenge> => {
  const challenge = mockChallenges.find(c => c.id === id);
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  return {
    ...challenge,
    completed: true,
    progress: challenge.target
  };
};
