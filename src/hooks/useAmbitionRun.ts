// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { useAmbitionStore } from '@/store/ambition.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface StartRunResponse {
  run_id: string;
  suggested: string[];
  pnj?: {
    id: string;
    name: string;
    avatar: string;
    line: string;
    choices?: Array<{ id: string; text: string; value: number }>;
  };
}

interface AnswerResponse {
  next_pnj?: {
    id: string;
    name: string;
    avatar: string;
    line: string;
    choices?: Array<{ id: string; text: string; value: number }>;
  };
  unlocked?: Array<{ id: string; name: string; icon: string; path: string }>;
  quest?: {
    id: string;
    title: string;
    estMinutes: number;
    flavor: string;
    xpReward: number;
  };
}

export const useAmbitionRun = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ambitionStore = useAmbitionStore();

  const startRun = useCallback(async (objective?: string, tags?: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ambition-arcade', {
        body: {
          action: 'start',
          objective,
          tags
        }
      });

      if (supabaseError) throw supabaseError;

      const response: StartRunResponse = data;
      
      ambitionStore.setRunId(response.run_id);
      ambitionStore.setSuggestions(response.suggested);
      ambitionStore.setPhase(ambitionStore.isFirstTime ? 'onboarding' : 'hub');
      
      if (response.pnj) {
        ambitionStore.setActivePNJ({
          id: response.pnj.id,
          name: response.pnj.name,
          avatar: response.pnj.avatar,
          line: response.pnj.line,
          choices: response.pnj.choices,
          isActive: true
        });
        ambitionStore.setPhase('dialog');
      }
      
      // Load existing quests
      await loadQuests(response.run_id);
      
    } catch (error) {
      logger.error('Error starting ambition run', error as Error, 'UI');
      setError('Erreur lors du démarrage de la session');
      
      // Fallback offline mode
      const fallbackRunId = `offline-${Date.now()}`;
      ambitionStore.setRunId(fallbackRunId);
      ambitionStore.setSuggestions([
        'Améliorer mes compétences techniques',
        'Développer mon réseau professionnel',
        'Augmenter ma confiance en moi'
      ]);
      ambitionStore.setPhase(ambitionStore.isFirstTime ? 'onboarding' : 'hub');
      
      toast({
        title: 'Mode hors-ligne',
        description: 'Session locale créée. Synchronisation à la reconnexion.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [ambitionStore]);

  const answerPNJ = useCallback(async (runId: string, pnjId: string, answerId: string) => {
    if (!runId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ambition-arcade', {
        body: {
          action: 'answer',
          run_id: runId,
          pnj_id: pnjId,
          answer_id: answerId
        }
      });

      if (supabaseError) throw supabaseError;

      const response: AnswerResponse = data;
      
      // Handle next PNJ
      if (response.next_pnj) {
        ambitionStore.setActivePNJ({
          id: response.next_pnj.id,
          name: response.next_pnj.name,
          avatar: response.next_pnj.avatar,
          line: response.next_pnj.line,
          choices: response.next_pnj.choices,
          isActive: true
        });
      } else {
        ambitionStore.setActivePNJ(null);
        ambitionStore.setPhase('hub');
      }
      
      // Handle unlocked upgrades
      if (response.unlocked) {
        response.unlocked.forEach(upgrade => {
          ambitionStore.addUpgrade({
            ...upgrade,
            unlocked: true,
            cost: 0,
            description: `Débloqu grâce à vos réponses`
          });
        });
      }
      
      // Handle new quest
      if (response.quest) {
        ambitionStore.addQuest({
          ...response.quest,
          status: 'available'
        });
      }
      
    } catch (error) {
      logger.error('Error answering PNJ', error as Error, 'UI');
      // Fallback: just close dialog
      ambitionStore.setActivePNJ(null);
      ambitionStore.setPhase('hub');
    } finally {
      setIsLoading(false);
    }
  }, [ambitionStore]);

  const loadQuests = useCallback(async (runId: string) => {
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ambition-arcade', {
        body: {
          action: 'getQuests',
          run_id: runId
        }
      });

      if (supabaseError) throw supabaseError;

      if (data?.quests) {
        data.quests.forEach((quest: any) => {
          ambitionStore.addQuest({
            id: quest.id,
            title: quest.title,
            estMinutes: quest.estMinutes,
            flavor: quest.flavor,
            status: quest.status || 'available',
            xpReward: quest.xpReward || 25
          });
        });
      }
    } catch (error) {
      logger.error('Error loading quests', error as Error, 'UI');
    }
  }, [ambitionStore]);

  const completeQuest = useCallback(async (questId: string, result: 'success' | 'fail', notes?: string) => {
    if (!ambitionStore.runId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('ambition-arcade', {
        body: {
          action: 'completeQuest',
          run_id: ambitionStore.runId,
          quest_id: questId,
          result,
          notes
        }
      });

      if (supabaseError) throw supabaseError;

      // Update local state
      ambitionStore.completeQuest(questId, result === 'success');
      
      if (data?.xp_gain) {
        ambitionStore.addXP(data.xp_gain);
      }
      
      if (data?.artifacts) {
        data.artifacts.forEach((artifact: any) => {
          ambitionStore.addArtifact(artifact);
        });
      }
      
      toast({
        title: result === 'success' ? 'Quête terminée !' : 'Quête abandonnée',
        description: result === 'success' 
          ? `+${data?.xp_gain || 25} XP gagnés !`
          : 'Pas de souci, on réessaiera !'
      });
      
    } catch (error) {
      logger.error('Error completing quest', error as Error, 'UI');
      // Fallback: complete locally
      ambitionStore.completeQuest(questId, result === 'success');
    } finally {
      setIsLoading(false);
    }
  }, [ambitionStore]);

  const setObjective = useCallback((objective: string) => {
    ambitionStore.setObjective(objective);
    
    // Auto-generate suggestions if online
    if (ambitionStore.runId) {
      startRun(objective);
    }
  }, [ambitionStore, startRun]);

  const purchaseUpgrade = useCallback((upgradeId: string) => {
    const upgrade = ambitionStore.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.unlocked) return false;
    
    if (ambitionStore.currentXP >= (upgrade.cost || 0)) {
      ambitionStore.unlockUpgrade(upgradeId);
      toast({
        title: 'Upgrade débloqué !',
        description: upgrade.name,
      });
      return true;
    } else {
      toast({
        title: 'XP insuffisant',
        description: `Il vous faut ${upgrade.cost} XP`,
        variant: 'destructive'
      });
      return false;
    }
  }, [ambitionStore]);

  // Auto-start run on mount if needed
  useEffect(() => {
    if (ambitionStore.phase === 'idle' && !ambitionStore.runId) {
      startRun();
    }
  }, []);

  return {
    // State
    state: {
      runId: ambitionStore.runId,
      phase: ambitionStore.phase,
      currentObjective: ambitionStore.currentObjective,
      objectiveSuggestions: ambitionStore.objectiveSuggestions,
      pnj: ambitionStore.activePNJ,
      upgrades: ambitionStore.upgrades,
      quests: ambitionStore.quests,
      artifacts: ambitionStore.artifacts,
      inventory: ambitionStore.inventory,
      currentXP: ambitionStore.currentXP,
      totalXP: ambitionStore.totalXP,
      isFirstTime: ambitionStore.isFirstTime,
      activeQuestId: ambitionStore.activeQuestId,
      setObjective: ambitionStore.setObjective,
      submitDebrief: () => {} // placeholder for compatibility
    },
    
    // Status
    isLoading,
    error,
    
    // Actions
    startRun,
    answerPNJ,
    completeQuest,
    setObjective,
    purchaseUpgrade,
    loadQuests,
    
    // Store actions
    setPhase: ambitionStore.setPhase,
    startQuest: ambitionStore.startQuest,
    reset: ambitionStore.reset,
  };
};