import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEmotionalEnergy } from './useEmotionalEnergy';
import { useHarmonyPoints } from './useHarmonyPoints';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface Quest {
  id: string;
  title: string;
  description: string;
  questType: 'daily' | 'weekly' | 'monthly' | 'special';
  category: string;
  targetValue: number;
  energyReward: number;
  harmonyPointsReward: number;
  specialReward?: any;
  progress?: number;
  completed?: boolean;
  claimed?: boolean;
}

/**
 * Hook pour gérer les quêtes bien-être
 */
export const useWellnessQuests = () => {
  const { user } = useAuth();
  const { gainEnergy } = useEmotionalEnergy();
  const { earnPoints } = useHarmonyPoints();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les quêtes et leur progression
  const loadQuests = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Charger les quêtes actives
      const { data: questsData, error: questsError } = await supabase
        .from('wellness_quests')
        .select('*')
        .eq('active', true);

      if (questsError) throw questsError;

      // Charger la progression de l'utilisateur
      const { data: progressData, error: progressError } = await supabase
        .from('user_quest_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      // Combiner les données
      const questsWithProgress = questsData.map(quest => {
        const progress = progressData?.find(p => p.quest_id === quest.id);
        return {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          questType: quest.quest_type,
          category: quest.category,
          targetValue: quest.target_value,
          energyReward: quest.energy_reward,
          harmonyPointsReward: quest.harmony_points_reward,
          specialReward: quest.special_reward,
          progress: progress?.current_progress || 0,
          completed: progress?.completed || false,
          claimed: progress?.claimed || false
        };
      });

      setQuests(questsWithProgress);
    } catch (err) {
      logger.error('Error loading quests:', err, 'HOOK');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Mettre à jour la progression d'une quête
  const updateProgress = useCallback(async (questId: string, increment: number = 1) => {
    if (!user) return false;

    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest || quest.completed) return false;

      const newProgress = Math.min((quest.progress || 0) + increment, quest.targetValue);
      const isNowCompleted = newProgress >= quest.targetValue;

      // Upsert progress
      const { error } = await supabase
        .from('user_quest_progress')
        .upsert({
          user_id: user.id,
          quest_id: questId,
          current_progress: newProgress,
          completed: isNowCompleted,
          completed_at: isNowCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      if (isNowCompleted) {
        toast({
          title: '🎉 Quête terminée !',
          description: quest.title,
          variant: 'success'
        });
      }

      await loadQuests();
      return true;
    } catch (err) {
      logger.error('Error updating quest progress:', err, 'HOOK');
      return false;
    }
  }, [user, quests, loadQuests]);

  // Réclamer une récompense
  const claimReward = useCallback(async (questId: string) => {
    if (!user) return false;

    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest || !quest.completed || quest.claimed) return false;

      // Marquer comme réclamé
      const { error } = await supabase
        .from('user_quest_progress')
        .update({
          claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('quest_id', questId);

      if (error) throw error;

      // Donner les récompenses
      await gainEnergy(quest.energyReward, `Quête: ${quest.title}`);
      await earnPoints(quest.harmonyPointsReward, quest.title);

      // Si récompense spéciale
      if (quest.specialReward) {
        await supabase.from('user_wellness_chests').insert({
          user_id: user.id,
          chest_type: 'quest_reward',
          rewards: quest.specialReward
        });
      }

      toast({
        title: '✨ Récompense réclamée !',
        description: `+${quest.energyReward} énergie, +${quest.harmonyPointsReward} points`,
        variant: 'success'
      });

      await loadQuests();
      return true;
    } catch (err) {
      logger.error('Error claiming reward:', err, 'HOOK');
      return false;
    }
  }, [user, quests, gainEnergy, earnPoints, loadQuests]);

  // Charger au démarrage
  useEffect(() => {
    loadQuests();
  }, [loadQuests]);

  return {
    quests,
    isLoading,
    activeQuests: quests.filter(q => !q.completed),
    completedQuests: quests.filter(q => q.completed && !q.claimed),
    updateProgress,
    claimReward,
    refreshQuests: loadQuests
  };
};
