/**
 * Hook pour les défis personnalisés Boss Grit
 * TOP 5 #3 Modules - Système de défis custom
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type ChallengeCategory = 
  | 'physical' 
  | 'mental' 
  | 'emotional' 
  | 'social' 
  | 'creative' 
  | 'professional';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface CustomChallenge {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  duration_minutes: number;
  xp_reward: number;
  requirements: string[];
  success_criteria: string;
  tips: string[];
  is_public: boolean;
  completions_count: number;
  average_rating: number;
  created_at: string;
  tags: string[];
}

export interface ChallengeAttempt {
  id: string;
  challenge_id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  success: boolean | null;
  notes: string;
  rating: number | null;
  xp_earned: number;
}

const CATEGORY_CONFIG: Record<ChallengeCategory, { emoji: string; label: string; color: string }> = {
  physical: { emoji: '💪', label: 'Physique', color: 'text-red-500' },
  mental: { emoji: '🧠', label: 'Mental', color: 'text-purple-500' },
  emotional: { emoji: '💚', label: 'Émotionnel', color: 'text-green-500' },
  social: { emoji: '👥', label: 'Social', color: 'text-blue-500' },
  creative: { emoji: '🎨', label: 'Créatif', color: 'text-pink-500' },
  professional: { emoji: '💼', label: 'Professionnel', color: 'text-amber-500' }
};

const DIFFICULTY_CONFIG: Record<ChallengeDifficulty, { multiplier: number; label: string; color: string }> = {
  easy: { multiplier: 1, label: 'Facile', color: 'text-green-500' },
  medium: { multiplier: 1.5, label: 'Moyen', color: 'text-yellow-500' },
  hard: { multiplier: 2, label: 'Difficile', color: 'text-orange-500' },
  extreme: { multiplier: 3, label: 'Extrême', color: 'text-red-500' }
};

export function useBossGritCustomChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [publicChallenges, setPublicChallenges] = useState<CustomChallenge[]>([]);
  const [myChallenges, setMyChallenges] = useState<CustomChallenge[]>([]);
  const [myAttempts, setMyAttempts] = useState<ChallengeAttempt[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les défis
  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    try {
      // Défis publics
      const { data: publicData, error: pError } = await supabase
        .from('boss_grit_challenges')
        .select('*')
        .eq('is_public', true)
        .order('completions_count', { ascending: false })
        .limit(50);

      if (pError) throw pError;
      setPublicChallenges((publicData || []) as CustomChallenge[]);

      if (user) {
        // Mes défis créés
        const { data: myData, error: mError } = await supabase
          .from('boss_grit_challenges')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (!mError) {
          setMyChallenges((myData || []) as CustomChallenge[]);
        }

        // Mes tentatives
        const { data: attemptsData, error: aError } = await supabase
          .from('boss_grit_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(50);

        if (!aError) {
          setMyAttempts((attemptsData || []) as ChallengeAttempt[]);
          
          // Trouver le défi actif
          const active = (attemptsData || []).find((a: ChallengeAttempt) => !a.completed_at);
          setActiveChallenge(active || null);
        }
      }

    } catch (error) {
      logger.error('Failed to fetch challenges', error as Error, 'BOSS_GRIT');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Créer un nouveau défi
  const createChallenge = useCallback(async (challenge: {
    title: string;
    description: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    duration_minutes: number;
    requirements: string[];
    success_criteria: string;
    tips?: string[];
    isPublic?: boolean;
    tags?: string[];
  }) => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Connectez-vous pour créer des défis'
      });
      return null;
    }

    try {
      const baseXp = 50;
      const difficultyMultiplier = DIFFICULTY_CONFIG[challenge.difficulty].multiplier;
      const durationBonus = Math.floor(challenge.duration_minutes / 15) * 10;
      const xpReward = Math.round((baseXp + durationBonus) * difficultyMultiplier);

      const { data, error } = await supabase
        .from('boss_grit_challenges')
        .insert({
          creator_id: user.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          difficulty: challenge.difficulty,
          duration_minutes: challenge.duration_minutes,
          requirements: challenge.requirements,
          success_criteria: challenge.success_criteria,
          tips: challenge.tips || [],
          is_public: challenge.isPublic ?? false,
          tags: challenge.tags || [],
          xp_reward: xpReward
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '🎯 Défi créé !',
        description: challenge.isPublic 
          ? 'Votre défi est visible par la communauté' 
          : 'Défi sauvegardé'
      });

      await fetchChallenges();
      return data as CustomChallenge;

    } catch (error) {
      logger.error('Failed to create challenge', error as Error, 'BOSS_GRIT');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le défi',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, toast, fetchChallenges]);

  // Commencer un défi
  const startChallenge = useCallback(async (challengeId: string) => {
    if (!user) return null;

    if (activeChallenge) {
      toast({
        title: 'Défi en cours',
        description: 'Terminez d\'abord votre défi actuel',
        variant: 'destructive'
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('boss_grit_attempts')
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '🚀 Défi commencé !',
        description: 'Bonne chance !'
      });

      setActiveChallenge(data as ChallengeAttempt);
      return data as ChallengeAttempt;

    } catch (error) {
      logger.error('Failed to start challenge', error as Error, 'BOSS_GRIT');
      return null;
    }
  }, [user, activeChallenge, toast]);

  // Terminer un défi
  const completeChallenge = useCallback(async (
    attemptId: string,
    success: boolean,
    options: { notes?: string; rating?: number } = {}
  ) => {
    if (!user) return false;

    try {
      // Récupérer le défi pour calculer l'XP
      const attempt = myAttempts.find(a => a.id === attemptId);
      if (!attempt) return false;

      const challenge = [...publicChallenges, ...myChallenges].find(
        c => c.id === attempt.challenge_id
      );

      const xpEarned = success && challenge ? challenge.xp_reward : 0;

      const { error } = await supabase
        .from('boss_grit_attempts')
        .update({
          completed_at: new Date().toISOString(),
          success,
          notes: options.notes || '',
          rating: options.rating,
          xp_earned: xpEarned
        })
        .eq('id', attemptId);

      if (error) throw error;

      // Incrémenter le compteur de complétion
      if (success && challenge) {
        await supabase
          .from('boss_grit_challenges')
          .update({ completions_count: challenge.completions_count + 1 })
          .eq('id', challenge.id);
      }

      toast({
        title: success ? '🏆 Défi réussi !' : '💪 Défi terminé',
        description: success 
          ? `+${xpEarned} XP gagnés !` 
          : 'Continuez à vous challenger !'
      });

      setActiveChallenge(null);
      await fetchChallenges();
      return true;

    } catch (error) {
      logger.error('Failed to complete challenge', error as Error, 'BOSS_GRIT');
      return false;
    }
  }, [user, myAttempts, publicChallenges, myChallenges, toast, fetchChallenges]);

  // Abandonner un défi
  const abandonChallenge = useCallback(async (attemptId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('boss_grit_attempts')
        .update({
          completed_at: new Date().toISOString(),
          success: false,
          notes: 'Abandonné'
        })
        .eq('id', attemptId);

      if (error) throw error;

      toast({
        title: 'Défi abandonné',
        description: 'Vous pourrez réessayer plus tard'
      });

      setActiveChallenge(null);
      await fetchChallenges();
      return true;

    } catch (error) {
      logger.error('Failed to abandon challenge', error as Error, 'BOSS_GRIT');
      return false;
    }
  }, [user, toast, fetchChallenges]);

  // Rechercher des défis
  const searchChallenges = useCallback(async (
    query: string,
    filters?: { category?: ChallengeCategory; difficulty?: ChallengeDifficulty }
  ) => {
    try {
      let queryBuilder = supabase
        .from('boss_grit_challenges')
        .select('*')
        .eq('is_public', true)
        .ilike('title', `%${query}%`);

      if (filters?.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      if (filters?.difficulty) {
        queryBuilder = queryBuilder.eq('difficulty', filters.difficulty);
      }

      const { data, error } = await queryBuilder
        .order('completions_count', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as CustomChallenge[];

    } catch (error) {
      logger.error('Failed to search challenges', error as Error, 'BOSS_GRIT');
      return [];
    }
  }, []);

  // Charger au montage
  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  return {
    publicChallenges,
    myChallenges,
    myAttempts,
    activeChallenge,
    isLoading,
    hasActiveChallenge: !!activeChallenge,
    createChallenge,
    startChallenge,
    completeChallenge,
    abandonChallenge,
    searchChallenges,
    refresh: fetchChallenges,
    categoryConfig: CATEGORY_CONFIG,
    difficultyConfig: DIFFICULTY_CONFIG
  };
}
