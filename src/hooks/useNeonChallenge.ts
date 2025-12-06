// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface NeonChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
  progress: number;
  maxProgress: number;
  deadline: string;
  category: 'daily' | 'weekly' | 'special';
  completed: boolean;
  icon: string;
  rewards: {
    points: number;
    badges?: string[];
    unlocks?: string[];
  };
}

interface UseNeonChallengeReturn {
  challenges: NeonChallenge[];
  activeChallenges: NeonChallenge[];
  completedChallenges: NeonChallenge[];
  loading: boolean;
  error: string | null;
  refreshChallenges: () => Promise<void>;
  updateProgress: (challengeId: string, progress: number) => Promise<void>;
  completeChallenge: (challengeId: string) => Promise<void>;
  claimReward: (challengeId: string) => Promise<void>;
}

/**
 * Hook pour gérer les Neon Challenges (défis quotidiens gamifiés)
 * Intégré avec la table neon_challenge de Supabase
 */
export const useNeonChallenge = (): UseNeonChallengeReturn => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<NeonChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les challenges depuis Supabase
   */
  const loadChallenges = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupérer les challenges depuis neon_challenge
      const { data, error: fetchError } = await supabase
        .from('neon_challenge')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transformer les données en format NeonChallenge
      const transformedChallenges: NeonChallenge[] = (data || []).map((item) => ({
        id: item.id,
        title: item.challenge_title || 'Défi Néon',
        description: item.challenge_desc || '',
        difficulty: (item.difficulty_level || 'moyen') as 'facile' | 'moyen' | 'difficile',
        points: item.points_reward || 0,
        progress: item.progress_current || 0,
        maxProgress: item.progress_target || 100,
        deadline: item.deadline || new Date(Date.now() + 86400000).toISOString(),
        category: item.challenge_type || 'daily',
        completed: item.completed || false,
        icon: getIconForCategory(item.challenge_type || 'daily'),
        rewards: {
          points: item.points_reward || 0,
          badges: item.badge_unlocked ? [item.badge_unlocked] : [],
          unlocks: []
        }
      }));

      setChallenges(transformedChallenges);
    } catch (err) {
      logger.error('Error loading neon challenges', err as Error, 'ANALYTICS');
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      toast.error('Impossible de charger les défis');
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Met à jour la progression d'un challenge
   */
  const updateProgress = useCallback(async (challengeId: string, progress: number) => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase
        .from('neon_challenge')
        .update({
          progress_current: progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', challengeId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Mettre à jour localement
      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, progress, completed: progress >= c.maxProgress }
            : c
        )
      );

      // Auto-compléter si target atteinte
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge && progress >= challenge.maxProgress) {
        await completeChallenge(challengeId);
      }
    } catch (err) {
      logger.error('Error updating challenge progress', err as Error, 'ANALYTICS');
      toast.error('Erreur de mise à jour');
    }
  }, [user, challenges]);

  /**
   * Marque un challenge comme complété
   */
  const completeChallenge = useCallback(async (challengeId: string) => {
    if (!user) return;

    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      const { error: updateError } = await supabase
        .from('neon_challenge')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          progress_current: challenge.maxProgress
        })
        .eq('id', challengeId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, completed: true, progress: c.maxProgress }
            : c
        )
      );

      toast.success(`🎉 Défi "${challenge.title}" complété !`);
    } catch (err) {
      logger.error('Error completing challenge', err as Error, 'ANALYTICS');
      toast.error('Erreur lors de la complétion');
    }
  }, [user, challenges]);

  /**
   * Réclame la récompense d'un challenge
   */
  const claimReward = useCallback(async (challengeId: string) => {
    if (!user) return;

    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge || !challenge.completed) {
        toast.error('Défi non complété');
        return;
      }

      // Ajouter les points via module_progress
      const { error: progressError } = await supabase.rpc('increment_module_points', {
        p_user_id: user.id,
        p_module_name: 'neon_challenge',
        p_points: challenge.rewards.points
      });

      if (progressError) throw progressError;

      toast.success(
        `🏆 Récompense réclamée : ${challenge.rewards.points} points !`,
        {
          description: challenge.rewards.badges?.length
            ? `Badge débloqué : ${challenge.rewards.badges[0]}`
            : undefined
        }
      );

      await loadChallenges();
    } catch (err) {
      logger.error('Error claiming reward', err as Error, 'ANALYTICS');
      toast.error('Erreur lors de la réclamation');
    }
  }, [user, challenges, loadChallenges]);

  /**
   * Rafraîchit la liste des challenges
   */
  const refreshChallenges = useCallback(async () => {
    await loadChallenges();
  }, [loadChallenges]);

  // Charger au montage
  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  // Challenges actifs
  const activeChallenges = challenges.filter(c => !c.completed);

  // Challenges complétés
  const completedChallenges = challenges.filter(c => c.completed);

  return {
    challenges,
    activeChallenges,
    completedChallenges,
    loading,
    error,
    refreshChallenges,
    updateProgress,
    completeChallenge,
    claimReward
  };
};

/**
 * Helper: retourne l'icône selon la catégorie
 */
function getIconForCategory(category: string): string {
  switch (category) {
    case 'daily':
      return '⚡';
    case 'weekly':
      return '🌟';
    case 'special':
      return '💎';
    default:
      return '🎯';
  }
}

export default useNeonChallenge;
