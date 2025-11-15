/**
 * Service de défis musicaux quotidiens et hebdomadaires
 */

import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
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

    // Récupérer les défis de l'utilisateur depuis Supabase
    const { data: userChallenges, error } = await supabase
      .from('user_music_challenges')
      .select('*')
      .eq('user_id', userId)
      .gte('expires_at', now.toISOString());

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = Not found, c'est normal si la table ou les données n'existent pas
      throw error;
    }

    const existingChallenges = userChallenges || [];
    const challengeMap = new Map(existingChallenges.map(c => [c.challenge_id, c]));

    // Créer les défis quotidiens
    const dailyChallenges = DAILY_CHALLENGES.map((template, index) => {
      const id = `daily-${today}-${index}`;
      const existing = challengeMap.get(id);
      return {
        ...template,
        id,
        currentValue: existing?.current_value ?? 0,
        status: (existing?.status ?? 'active') as ChallengeStatus,
        expiresAt: getEndOfDay(now).toISOString(),
        startedAt: existing?.started_at ?? now.toISOString()
      };
    });

    // Créer les défis hebdomadaires
    const weeklyChallenges = WEEKLY_CHALLENGES.map((template, index) => {
      const id = `weekly-${weekStart}-${index}`;
      const existing = challengeMap.get(id);
      return {
        ...template,
        id,
        currentValue: existing?.current_value ?? 0,
        status: (existing?.status ?? 'active') as ChallengeStatus,
        expiresAt: getEndOfWeek(now).toISOString(),
        startedAt: existing?.started_at ?? weekStart
      };
    });

    // Créer les nouveaux défis dans Supabase s'ils n'existent pas
    const allChallenges = [...dailyChallenges, ...weeklyChallenges];
    const newChallenges = allChallenges.filter(c => !challengeMap.has(c.id));

    if (newChallenges.length > 0) {
      const { error: insertError } = await supabase
        .from('user_music_challenges')
        .insert(
          newChallenges.map(challenge => ({
            user_id: userId,
            challenge_id: challenge.id,
            challenge_type: challenge.type,
            current_value: challenge.currentValue,
            target_value: challenge.targetValue,
            status: challenge.status,
            started_at: challenge.startedAt,
            expires_at: challenge.expiresAt,
            xp_reward: challenge.xpReward
          }))
        );

      if (insertError && insertError.code !== 'PGRST116') {
        logger.warn('Failed to insert new challenges', insertError, 'MUSIC');
      }
    }

    logger.info('Fetched user challenges', { count: allChallenges.length, userId }, 'MUSIC');
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
    // Récupérer le défi actuel
    const { data: challengeData, error: fetchError } = await supabase
      .from('user_music_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single();

    if (fetchError) {
      logger.warn('Challenge not found', { userId, challengeId }, 'MUSIC');
      return { success: false, completed: false, xpEarned: 0 };
    }

    const currentValue = (challengeData?.current_value || 0) + increment;
    const targetValue = challengeData?.target_value || 0;
    const isCompleted = currentValue >= targetValue;

    // Mettre à jour la progression dans Supabase
    const { error: updateError } = await supabase
      .from('user_music_challenges')
      .update({
        current_value: currentValue,
        status: isCompleted ? 'completed' : 'active',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId);

    if (updateError) {
      throw updateError;
    }

    const xpEarned = isCompleted ? (challengeData?.xp_reward || 0) : 0;

    logger.info('Updated challenge progress', {
      userId,
      challengeId,
      currentValue,
      targetValue,
      completed: isCompleted,
      xpEarned
    }, 'MUSIC');

    return {
      success: true,
      completed: isCompleted,
      xpEarned
    };
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
    // Marquer le défi comme complété dans Supabase
    const { error: updateError } = await supabase
      .from('user_music_challenges')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('challenge_id', challenge.id);

    if (updateError) {
      throw updateError;
    }

    // Ajouter l'XP au profil utilisateur
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('music_xp')
      .eq('id', userId)
      .single();

    if (!profileError && userProfile) {
      await supabase
        .from('user_profiles')
        .update({
          music_xp: (userProfile.music_xp || 0) + challenge.xpReward
        })
        .eq('id', userId);
    }

    // Si un badge est récompensé, l'ajouter aussi
    if (challenge.badgeReward) {
      const { error: badgeError } = await supabase
        .from('user_music_badges')
        .insert({
          user_id: userId,
          badge_id: challenge.badgeReward.id,
          badge_name: challenge.badgeReward.name,
          unlocked_at: new Date().toISOString()
        });

      if (badgeError && badgeError.code !== '23505') {
        // 23505 = duplicate key, c'est normal si le badge est déjà déverrouillé
        logger.warn('Failed to insert badge', badgeError, 'MUSIC');
      }
    }

    logger.info('Challenge completed', {
      userId,
      challengeId: challenge.id,
      xpReward: challenge.xpReward,
      badgeUnlocked: challenge.badgeReward?.name
    }, 'MUSIC');

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
