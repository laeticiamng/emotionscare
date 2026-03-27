// @ts-nocheck
/**
 * Hook pour le système de quêtes Ambition Arcade
 * TOP 5 #4 Modules - Système de quêtes enrichi
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export type QuestType = 'daily' | 'weekly' | 'story' | 'challenge' | 'special';
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  run_id: string;
  title: string;
  flavor: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  objectives: QuestObjective[];
  xp_reward: number;
  artifact_reward?: string;
  prerequisites: string[];
  time_limit_hours?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  est_minutes: number;
  difficulty: number;
  story_chapter?: number;
}

export interface QuestProgress {
  totalQuests: number;
  completedQuests: number;
  activeQuests: number;
  totalXpEarned: number;
  currentStreak: number;
  longestStreak: number;
  questsByType: Record<QuestType, { total: number; completed: number }>;
}

const QUEST_TYPE_CONFIG: Record<QuestType, { emoji: string; label: string; color: string }> = {
  daily: { emoji: '📅', label: 'Quotidienne', color: 'text-blue-500' },
  weekly: { emoji: '📆', label: 'Hebdomadaire', color: 'text-purple-500' },
  story: { emoji: '📖', label: 'Histoire', color: 'text-amber-500' },
  challenge: { emoji: '⚔️', label: 'Défi', color: 'text-red-500' },
  special: { emoji: '⭐', label: 'Spéciale', color: 'text-yellow-500' }
};

export function useAmbitionQuests(runId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les quêtes
  const fetchQuests = useCallback(async () => {
    if (!runId) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('ambition_quests')
        .select('*')
        .eq('run_id', runId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const typedQuests = (data || []).map((q: any) => ({
        ...q,
        objectives: q.objectives || [],
        prerequisites: q.prerequisites || []
      })) as Quest[];
      
      setQuests(typedQuests);
      setActiveQuests(typedQuests.filter(q => q.status === 'active'));

    } catch (error) {
      logger.error('Failed to fetch quests', error as Error, 'AMBITION');
    } finally {
      setIsLoading(false);
    }
  }, [runId]);

  // Créer une nouvelle quête
  const createQuest = useCallback(async (quest: {
    title: string;
    description: string;
    flavor?: string;
    type: QuestType;
    objectives: Omit<QuestObjective, 'id' | 'current' | 'completed'>[];
    xpReward: number;
    artifactReward?: string;
    prerequisites?: string[];
    timeLimitHours?: number;
    estMinutes?: number;
    difficulty?: number;
    storyChapter?: number;
  }) => {
    if (!user || !runId) return null;

    try {
      const objectives: QuestObjective[] = quest.objectives.map((obj, idx) => ({
        id: `obj_${idx}`,
        description: obj.description,
        target: obj.target,
        current: 0,
        completed: false
      }));

      const { data, error } = await supabase
        .from('ambition_quests')
        .insert({
          run_id: runId,
          title: quest.title,
          flavor: quest.flavor || '',
          description: quest.description,
          type: quest.type,
          status: 'available',
          objectives,
          xp_reward: quest.xpReward,
          artifact_reward: quest.artifactReward,
          prerequisites: quest.prerequisites || [],
          time_limit_hours: quest.timeLimitHours,
          est_minutes: quest.estMinutes || 30,
          difficulty: quest.difficulty || 2,
          story_chapter: quest.storyChapter
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: '📜 Nouvelle quête !',
        description: quest.title
      });

      await fetchQuests();
      return data as Quest;

    } catch (error) {
      logger.error('Failed to create quest', error as Error, 'AMBITION');
      return null;
    }
  }, [user, runId, toast, fetchQuests]);

  // Démarrer une quête
  const startQuest = useCallback(async (questId: string) => {
    if (!user) return false;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return false;

    // Vérifier les prérequis
    if (quest.prerequisites.length > 0) {
      const completedQuestIds = quests
        .filter(q => q.status === 'completed')
        .map(q => q.id);
      
      const missingPrereqs = quest.prerequisites.filter(
        prereq => !completedQuestIds.includes(prereq)
      );

      if (missingPrereqs.length > 0) {
        toast({
          title: '🔒 Quête verrouillée',
          description: 'Terminez d\'abord les quêtes prérequises',
          variant: 'destructive'
        });
        return false;
      }
    }

    try {
      const { error } = await supabase
        .from('ambition_quests')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', questId);

      if (error) throw error;

      toast({
        title: '🚀 Quête démarrée !',
        description: quest.title
      });

      await fetchQuests();
      return true;

    } catch (error) {
      logger.error('Failed to start quest', error as Error, 'AMBITION');
      return false;
    }
  }, [user, quests, toast, fetchQuests]);

  // Mettre à jour la progression d'un objectif
  const updateObjectiveProgress = useCallback(async (
    questId: string,
    objectiveId: string,
    progress: number
  ) => {
    if (!user) return false;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return false;

    const updatedObjectives = quest.objectives.map(obj => {
      if (obj.id === objectiveId) {
        const newCurrent = Math.min(progress, obj.target);
        return {
          ...obj,
          current: newCurrent,
          completed: newCurrent >= obj.target
        };
      }
      return obj;
    });

    // Vérifier si tous les objectifs sont complétés
    const allCompleted = updatedObjectives.every(obj => obj.completed);

    try {
      const { error } = await supabase
        .from('ambition_quests')
        .update({
          objectives: updatedObjectives,
          ...(allCompleted ? {
            status: 'completed',
            completed_at: new Date().toISOString()
          } : {})
        })
        .eq('id', questId);

      if (error) throw error;

      if (allCompleted) {
        toast({
          title: '🎉 Quête terminée !',
          description: `+${quest.xp_reward} XP gagnés !`
        });
      }

      await fetchQuests();
      return true;

    } catch (error) {
      logger.error('Failed to update objective', error as Error, 'AMBITION');
      return false;
    }
  }, [user, quests, toast, fetchQuests]);

  // Compléter une quête manuellement
  const completeQuest = useCallback(async (questId: string, notes?: string) => {
    if (!user) return false;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return false;

    try {
      // Marquer tous les objectifs comme complétés
      const completedObjectives = quest.objectives.map(obj => ({
        ...obj,
        current: obj.target,
        completed: true
      }));

      const { error } = await supabase
        .from('ambition_quests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          objectives: completedObjectives,
          notes
        })
        .eq('id', questId);

      if (error) throw error;

      toast({
        title: '🏆 Quête accomplie !',
        description: `${quest.title} - +${quest.xp_reward} XP`
      });

      await fetchQuests();
      return true;

    } catch (error) {
      logger.error('Failed to complete quest', error as Error, 'AMBITION');
      return false;
    }
  }, [user, quests, toast, fetchQuests]);

  // Abandonner une quête
  const abandonQuest = useCallback(async (questId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ambition_quests')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', questId);

      if (error) throw error;

      toast({
        title: 'Quête abandonnée',
        description: 'Vous pourrez la réessayer plus tard'
      });

      await fetchQuests();
      return true;

    } catch (error) {
      logger.error('Failed to abandon quest', error as Error, 'AMBITION');
      return false;
    }
  }, [user, toast, fetchQuests]);

  // Générer une quête quotidienne
  const generateDailyQuest = useCallback(async () => {
    if (!user || !runId) return null;

    const dailyTemplates = [
      {
        title: 'Moment de réflexion',
        description: 'Prenez 15 minutes pour réfléchir à vos objectifs',
        objectives: [{ description: 'Compléter une session de réflexion', target: 1 }],
        xpReward: 50,
        estMinutes: 15
      },
      {
        title: 'Petit pas vers le grand but',
        description: 'Accomplissez une micro-action vers votre objectif principal',
        objectives: [{ description: 'Action micro vers l\'objectif', target: 1 }],
        xpReward: 30,
        estMinutes: 10
      },
      {
        title: 'Journal de progression',
        description: 'Documentez votre avancement du jour',
        objectives: [{ description: 'Écrire une entrée journal', target: 1 }],
        xpReward: 40,
        estMinutes: 10
      }
    ];

    const template = dailyTemplates[Math.floor(Math.random() * dailyTemplates.length)];

    return createQuest({
      ...template,
      type: 'daily',
      timeLimitHours: 24,
      difficulty: 1
    });
  }, [user, runId, createQuest]);

  // Progression globale
  const progress = useMemo((): QuestProgress => {
    const completed = quests.filter(q => q.status === 'completed');
    const active = quests.filter(q => q.status === 'active');

    const questsByType: Record<QuestType, { total: number; completed: number }> = {
      daily: { total: 0, completed: 0 },
      weekly: { total: 0, completed: 0 },
      story: { total: 0, completed: 0 },
      challenge: { total: 0, completed: 0 },
      special: { total: 0, completed: 0 }
    };

    quests.forEach(q => {
      if (q.type in questsByType) {
        questsByType[q.type].total++;
        if (q.status === 'completed') {
          questsByType[q.type].completed++;
        }
      }
    });

    return {
      totalQuests: quests.length,
      completedQuests: completed.length,
      activeQuests: active.length,
      totalXpEarned: completed.reduce((sum, q) => sum + q.xp_reward, 0),
      currentStreak: 0, // À calculer avec les dates
      longestStreak: 0,
      questsByType
    };
  }, [quests]);

  // Quêtes disponibles (non démarrées avec prérequis satisfaits)
  const availableQuests = useMemo(() => {
    const completedIds = quests
      .filter(q => q.status === 'completed')
      .map(q => q.id);

    return quests.filter(q => {
      if (q.status !== 'available') return false;
      return q.prerequisites.every(prereq => completedIds.includes(prereq));
    });
  }, [quests]);

  // Charger au montage
  useEffect(() => {
    if (runId) {
      fetchQuests();
    }
  }, [runId, fetchQuests]);

  return {
    quests,
    activeQuests,
    availableQuests,
    progress,
    isLoading,
    createQuest,
    startQuest,
    updateObjectiveProgress,
    completeQuest,
    abandonQuest,
    generateDailyQuest,
    refresh: fetchQuests,
    typeConfig: QUEST_TYPE_CONFIG
  };
}
