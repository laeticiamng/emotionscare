import { useState, useCallback } from 'react';
import { useGritStore } from '@/store/grit.store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GritQuest {
  quest_id: string;
  title: string;
  est_minutes: number;
  copy: string;
}

interface GritCompletionResponse {
  badge_id: string;
  xp_gain: number;
  message: string;
}

interface GritTip {
  tips: string[];
}

export const useGritQuest = () => {
  const [quest, setQuest] = useState<GritQuest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [completionResult, setCompletionResult] = useState<GritCompletionResponse | null>(null);
  
  const gritStore = useGritStore();

  const loadQuest = useCallback(async (preview = false) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-grit-challenge', {
        body: preview ? { preview: true } : {}
      });

      if (error) throw error;

      if (data?.quest_id) {
        setQuest({
          quest_id: data.quest_id,
          title: data.title || 'Défi de persévérance',
          est_minutes: data.est_minutes || 3,
          copy: data.copy || 'Un micro-défi pour renforcer votre résilience mentale.'
        });
      } else {
        // Fallback local quest if API fails
        setQuest({
          quest_id: `local-${Date.now()}`,
          title: 'Défi local de respiration',
          est_minutes: 2,
          copy: 'Respirez profondément pendant 2 minutes sans interruption. Concentrez-vous uniquement sur votre souffle.'
        });
      }
    } catch (error) {
      console.error('Error loading quest:', error);
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger le défi. Un défi local est proposé.',
        variant: 'destructive'
      });
      
      // Fallback to offline quest
      setQuest({
        quest_id: `offline-${Date.now()}`,
        title: 'Défi hors-ligne',
        est_minutes: 3,
        copy: 'Maintenez une position inconfortable (debout sur une jambe) pendant 3 minutes. Résistez à l\'envie d\'abandonner.'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startQuest = useCallback((questId: string) => {
    gritStore.startQuest(questId);
  }, [gritStore]);

  const completeQuest = useCallback(async (success: boolean) => {
    if (!quest) return;

    const events = gritStore.events;
    const humeSummary = gritStore.humeSummary;

    try {
      const { data, error } = await supabase.functions.invoke('complete-grit-challenge', {
        body: {
          quest_id: quest.quest_id,
          success,
          events,
          hume: humeSummary
        }
      });

      if (error) throw error;

      if (data) {
        setCompletionResult({
          badge_id: data.badge_id || `badge-${Date.now()}`,
          xp_gain: data.xp_gain || 25,
          message: data.message || 'Bravo ! Tu as montré ta détermination !'
        });
        
        gritStore.finishQuest();
        
        toast({
          title: 'Défi terminé !',
          description: data.message,
        });
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      
      // Fallback completion
      setCompletionResult({
        badge_id: `local-badge-${Date.now()}`,
        xp_gain: success ? 25 : 10,
        message: success ? 'Excellent travail ! Tu as persévéré jusqu\'au bout.' : 'Courage ! L\'effort compte autant que le résultat.'
      });
      
      gritStore.finishQuest();
    }
  }, [quest, gritStore]);

  const loadTips = useCallback(async (context: any = {}) => {
    if (!quest) return;

    try {
      const { data, error } = await supabase.functions.invoke('grit-tips', {
        body: {
          quest_id: quest.quest_id,
          context
        }
      });

      if (error) throw error;

      if (data?.tips) {
        setTips(data.tips);
      } else {
        // Fallback tips
        setTips([
          'Respire profondément pour rester calme',
          'Rappelle-toi pourquoi tu as commencé',
          'Chaque seconde de plus renforce ta résilience'
        ]);
      }
    } catch (error) {
      console.error('Error loading tips:', error);
      
      // Fallback tips based on quest type
      setTips([
        'Concentre-toi sur le moment présent',
        'Accepte l\'inconfort comme un entraînement',
        'Tu es plus fort que tu ne le penses'
      ]);
    }
  }, [quest]);

  const resetQuest = useCallback(() => {
    setQuest(null);
    setTips([]);
    setCompletionResult(null);
    gritStore.reset();
  }, [gritStore]);

  return {
    quest,
    isLoading,
    tips,
    completionResult,
    status: gritStore.status,
    elapsedTime: gritStore.elapsedTime,
    pauseCount: gritStore.pauseCount,
    events: gritStore.events,
    
    // Actions
    loadQuest,
    startQuest,
    completeQuest,
    loadTips,
    resetQuest,
    
    // Store actions
    pauseQuest: gritStore.pauseQuest,
    resumeQuest: gritStore.resumeQuest,
    abortQuest: gritStore.abortQuest,
    updateElapsedTime: gritStore.updateElapsedTime,
    setHumeSummary: gritStore.setHumeSummary,
  };
};