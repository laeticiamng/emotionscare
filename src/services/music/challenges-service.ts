/**
 * Service de défis musicaux quotidiens et hebdomadaires
 */

import { logger } from '@/lib/logger';
import { MusicBadge } from './badges-service';

export type ChallengeFrequency = 'daily' | 'weekly';
export type ChallengeStatus = 'active' | 'completed' | 'expired';

export interface MusicChallenge {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  type: 'genre_diversity' | 'mood_discovery' | 'listening_time' | 'streak' | 'exploration';
  targetValue: number;
  currentValue: number;
  status: ChallengeStatus;
  xpReward: number;
  badgeReward?: MusicBadge;
  expiresAt: string;
  icon: string;
  startedAt: string;
}

/**
 * Défis disponibles
 */
const DAILY_CHALLENGES: Omit<MusicChallenge, 'id' | 'currentValue' | 'status' | 'expiresAt' | 'startedAt'>[] = [
  {
    title: 'Explorateur du Jour',
    description: 'Écoutez 3 genres musicaux différents',
    frequency: 'daily',
    type: 'genre_diversity',
    targetValue: 3,
    xpReward: 50,
    icon: '🌍'
  },
  {
    title: 'Découvreur d\'Émotions',
    description: 'Découvrez un nouveau mood aujourd\'hui',
    frequency: 'daily',
    type: 'mood_discovery',
    targetValue: 1,
    xpReward: 30,
    icon: '🎨'
  },
  {
    title: 'Marathon Musical',
    description: 'Écoutez 30 minutes de musique',
    frequency: 'daily',
    type: 'listening_time',
    targetValue: 30,
    xpReward: 40,
    icon: '⏱️'
  }
];

const WEEKLY_CHALLENGES: Omit<MusicChallenge, 'id' | 'currentValue' | 'status' | 'expiresAt' | 'startedAt'>[] = [
  {
    title: 'Explorateur Hebdomadaire',
    description: 'Écoutez 5 genres différents cette semaine',
    frequency: 'weekly',
    type: 'genre_diversity',
    targetValue: 5,
    xpReward: 200,
    icon: '🌟'
  },
  {
    title: 'Maître des Émotions',
    description: 'Explorez 7 moods différents',
    frequency: 'weekly',
    type: 'mood_discovery',
    targetValue: 7,
    xpReward: 150,
    icon: '🎭'
  },
  {
    title: 'Auditeur Assidu',
    description: 'Écoutez de la musique tous les jours',
    frequency: 'weekly',
    type: 'streak',
    targetValue: 7,
    xpReward: 250,
    badgeReward: {
      id: 'weekly-streak',
      name: 'Constance Hebdomadaire',
      description: 'Écoute quotidienne pendant 7 jours',
      category: 'consistency',
      requirement: '7 jours',
      icon: '🔥',
      unlocked: true,
      image: '/badges/weekly-streak.png'
    },
    icon: '🔥'
  },
  {
    title: 'Exploration Intensive',
    description: 'Écoutez 10 artistes différents',
    frequency: 'weekly',
    type: 'exploration',
    targetValue: 10,
    xpReward: 180,
    icon: '🎵'
  }
];

/**
 * Récupérer les défis actifs de l'utilisateur
 */
export async function getUserChallenges(userId: string): Promise<MusicChallenge[]> {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = getWeekStart(now);
    
    // Générer les défis quotidiens
    const dailyChallenges = DAILY_CHALLENGES.map((template, index) => ({
      ...template,
      id: `daily-${today}-${index}`,
      currentValue: Math.floor(Math.random() * template.targetValue), // Mock progress
      status: 'active' as ChallengeStatus,
      expiresAt: getEndOfDay(now).toISOString(),
      startedAt: now.toISOString()
    }));
    
    // Générer les défis hebdomadaires
    const weeklyChallenges = WEEKLY_CHALLENGES.map((template, index) => ({
      ...template,
      id: `weekly-${weekStart}-${index}`,
      currentValue: Math.floor(Math.random() * template.targetValue), // Mock progress
      status: 'active' as ChallengeStatus,
      expiresAt: getEndOfWeek(now).toISOString(),
      startedAt: weekStart
    }));
    
    const allChallenges = [...dailyChallenges, ...weeklyChallenges];
    
    logger.info('Fetched user challenges', { count: allChallenges.length }, 'MUSIC');
    return allChallenges;
  } catch (error) {
    logger.error('Failed to fetch challenges', error as Error, 'MUSIC');
    return [];
  }
}

/**
 * Mettre à jour la progression d'un défi
 */
export async function updateChallengeProgress(
  userId: string,
  challengeId: string,
  increment: number
): Promise<{ success: boolean; completed: boolean; xpEarned: number }> {
  try {
    // TODO: Implémenter avec Supabase
    logger.info('Updated challenge progress', { challengeId, increment }, 'MUSIC');
    
    // Simulation
    const completed = Math.random() > 0.5;
    const xpEarned = completed ? 50 : 0;
    
    return { success: true, completed, xpEarned };
  } catch (error) {
    logger.error('Failed to update challenge progress', error as Error, 'MUSIC');
    return { success: false, completed: false, xpEarned: 0 };
  }
}

/**
 * Compléter un défi
 */
export async function completeChallenge(
  userId: string,
  challenge: MusicChallenge
): Promise<{ xpEarned: number; badgeUnlocked?: MusicBadge }> {
  try {
    logger.info('Challenge completed', { 
      challengeId: challenge.id,
      xpReward: challenge.xpReward 
    }, 'MUSIC');
    
    // TODO: Sauvegarder dans Supabase
    
    return {
      xpEarned: challenge.xpReward,
      badgeUnlocked: challenge.badgeReward
    };
  } catch (error) {
    logger.error('Failed to complete challenge', error as Error, 'MUSIC');
    return { xpEarned: 0 };
  }
}

/**
 * Utilitaires de date
 */
function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getWeekStart(date: Date): string {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Lundi
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
}

function getEndOfWeek(date: Date): Date {
  const end = new Date(date);
  const day = end.getDay();
  const diff = end.getDate() + (day === 0 ? 0 : 7 - day); // Dimanche
  end.setDate(diff);
  end.setHours(23, 59, 59, 999);
  return end;
}
