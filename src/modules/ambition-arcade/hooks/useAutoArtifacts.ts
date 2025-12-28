/**
 * Hook pour l'attribution automatique d'artefacts
 * Attribue des artefacts basés sur les accomplissements
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from './useConfetti';

type ArtifactRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface ArtifactReward {
  name: string;
  description: string;
  icon: string;
  rarity: ArtifactRarity;
  condition: string;
}

const ARTIFACT_REWARDS: ArtifactReward[] = [
  // Quests milestones
  { name: 'Première Victoire', description: 'Compléter votre première quête', icon: '⚔️', rarity: 'common', condition: 'first_quest' },
  { name: 'Décuple Force', description: 'Compléter 10 quêtes', icon: '💪', rarity: 'rare', condition: 'quests_10' },
  { name: 'Guerrier Aguerri', description: 'Compléter 50 quêtes', icon: '🗡️', rarity: 'epic', condition: 'quests_50' },
  { name: 'Légende Vivante', description: 'Compléter 100 quêtes', icon: '👑', rarity: 'legendary', condition: 'quests_100' },
  
  // XP milestones
  { name: 'Collectionneur de Points', description: 'Accumuler 500 XP', icon: '✨', rarity: 'common', condition: 'xp_500' },
  { name: 'Maître des XP', description: 'Accumuler 2000 XP', icon: '💫', rarity: 'rare', condition: 'xp_2000' },
  { name: 'Seigneur des XP', description: 'Accumuler 5000 XP', icon: '🌟', rarity: 'epic', condition: 'xp_5000' },
  
  // Streak milestones
  { name: 'Flamme Naissante', description: 'Streak de 3 jours', icon: '🔥', rarity: 'common', condition: 'streak_3' },
  { name: 'Feu Éternel', description: 'Streak de 7 jours', icon: '🌋', rarity: 'rare', condition: 'streak_7' },
  { name: 'Inferno', description: 'Streak de 30 jours', icon: '☄️', rarity: 'legendary', condition: 'streak_30' },
  
  // Goal completion
  { name: 'Objectif Atteint', description: 'Compléter un objectif', icon: '🎯', rarity: 'common', condition: 'goal_complete' },
  { name: 'Multi-Accomplisseur', description: 'Compléter 5 objectifs', icon: '🏅', rarity: 'epic', condition: 'goals_5' },
];

export function useAutoArtifacts() {
  const { toast } = useToast();
  const { fireAchievementConfetti } = useConfetti();

  const checkAndAwardArtifact = useCallback(async (
    runId: string,
    condition: string,
    stats: { completedQuests: number; totalXP: number; currentStreak: number; completedRuns: number }
  ) => {
    // Trouver le reward correspondant
    const reward = ARTIFACT_REWARDS.find(r => r.condition === condition);
    if (!reward) return null;

    // Vérifier si l'artefact existe déjà pour ce run
    const { data: existing } = await supabase
      .from('ambition_artifacts')
      .select('id')
      .eq('run_id', runId)
      .eq('name', reward.name)
      .single();

    if (existing) return null;

    // Vérifier la condition
    let conditionMet = false;
    switch (condition) {
      case 'first_quest':
        conditionMet = stats.completedQuests >= 1;
        break;
      case 'quests_10':
        conditionMet = stats.completedQuests >= 10;
        break;
      case 'quests_50':
        conditionMet = stats.completedQuests >= 50;
        break;
      case 'quests_100':
        conditionMet = stats.completedQuests >= 100;
        break;
      case 'xp_500':
        conditionMet = stats.totalXP >= 500;
        break;
      case 'xp_2000':
        conditionMet = stats.totalXP >= 2000;
        break;
      case 'xp_5000':
        conditionMet = stats.totalXP >= 5000;
        break;
      case 'streak_3':
        conditionMet = stats.currentStreak >= 3;
        break;
      case 'streak_7':
        conditionMet = stats.currentStreak >= 7;
        break;
      case 'streak_30':
        conditionMet = stats.currentStreak >= 30;
        break;
      case 'goal_complete':
        conditionMet = stats.completedRuns >= 1;
        break;
      case 'goals_5':
        conditionMet = stats.completedRuns >= 5;
        break;
      default:
        conditionMet = false;
    }

    if (!conditionMet) return null;

    // Attribuer l'artefact
    const { data: artifact, error } = await supabase
      .from('ambition_artifacts')
      .insert({
        run_id: runId,
        name: reward.name,
        description: reward.description,
        icon: reward.icon,
        rarity: reward.rarity,
        obtained_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error awarding artifact:', error);
      return null;
    }

    // Notification et confettis
    toast({
      title: `${reward.icon} Nouvel artefact !`,
      description: `${reward.name} - ${reward.description}`,
    });

    if (reward.rarity === 'epic' || reward.rarity === 'legendary') {
      fireAchievementConfetti();
    }

    return artifact;
  }, [toast, fireAchievementConfetti]);

  const checkAllMilestones = useCallback(async (
    runId: string,
    stats: { completedQuests: number; totalXP: number; currentStreak: number; completedRuns: number }
  ) => {
    const awarded: string[] = [];

    for (const reward of ARTIFACT_REWARDS) {
      const result = await checkAndAwardArtifact(runId, reward.condition, stats);
      if (result) {
        awarded.push(reward.name);
      }
    }

    return awarded;
  }, [checkAndAwardArtifact]);

  return { checkAndAwardArtifact, checkAllMilestones };
}
