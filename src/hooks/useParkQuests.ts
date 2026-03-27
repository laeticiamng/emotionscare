// @ts-nocheck
/**
 * Hook pour la gestion des quêtes et missions du parc émotionnel
 * Persistance via Supabase
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  objective: string;
  reward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  zones: string[];
  timeLimit?: number;
  createdAt: string;
}

const AVAILABLE_QUESTS: Omit<Quest, 'progress' | 'completed' | 'createdAt'>[] = [
  {
    id: 'quest-1',
    title: 'Explorateur Novice',
    description: 'Visite 5 attractions différentes',
    icon: '🗺️',
    objective: 'Visiter 5 attractions',
    reward: 100,
    maxProgress: 5,
    difficulty: 'easy',
    zones: ['hub', 'calm'],
  },
  {
    id: 'quest-2',
    title: 'Maître du Calme',
    description: 'Complète toutes les attractions de la Zone de Sérénité',
    icon: '🧘',
    objective: 'Zone de Sérénité 100%',
    reward: 250,
    maxProgress: 4,
    difficulty: 'medium',
    zones: ['calm'],
  },
  {
    id: 'quest-3',
    title: 'Créateur Coloré',
    description: 'Visite 3 attractions du Quartier Créatif',
    icon: '🎨',
    objective: 'Visiter 3 attractions créatives',
    reward: 150,
    maxProgress: 3,
    difficulty: 'medium',
    zones: ['creative'],
  },
  {
    id: 'quest-4',
    title: 'Sage du Jardin',
    description: 'Complète le Jardin de Sagesse',
    icon: '📚',
    objective: 'Jardin de Sagesse 100%',
    reward: 300,
    maxProgress: 4,
    difficulty: 'hard',
    zones: ['wisdom'],
  },
  {
    id: 'quest-5',
    title: 'Aventurier Social',
    description: 'Visite les attractions sociales et partagez',
    icon: '🤝',
    objective: 'Engagement communautaire',
    reward: 200,
    maxProgress: 2,
    difficulty: 'medium',
    zones: ['social'],
  },
  {
    id: 'quest-6',
    title: 'Championne de Résilience',
    description: 'Complète l\'Arène des Défis',
    icon: '⚔️',
    objective: 'Arène des Défis 100%',
    reward: 350,
    maxProgress: 3,
    difficulty: 'hard',
    zones: ['challenge'],
  }
];

export const useParkQuests = () => {
  const { user } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Save quests to Supabase
  const saveQuests = useCallback(async (questsData: Quest[], completed: string[]) => {
    if (!user) return;
    
    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'park_quests',
          value: JSON.stringify({ quests: questsData, completed }),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,key' });
    } catch (error) {
      logger.error('Failed to save park quests', error as Error, 'PARK');
    }
  }, [user]);

  // Initialize quests
  const initializeQuests = useCallback((): Quest[] => {
    return AVAILABLE_QUESTS.map(q => ({
      ...q,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    }));
  }, []);

  // Load quests from Supabase
  useEffect(() => {
    const loadQuests = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', 'park_quests')
            .maybeSingle();

          if (data?.value) {
            const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            setQuests(parsed.quests || initializeQuests());
            setCompletedQuests(parsed.completed || []);
          } else {
            const newQuests = initializeQuests();
            setQuests(newQuests);
            setCompletedQuests([]);
          }
        } else {
          // No user - use default quests
          setQuests(initializeQuests());
          setCompletedQuests([]);
        }
      } catch (error) {
        logger.error('Failed to load park quests', error as Error, 'PARK');
        setQuests(initializeQuests());
      } finally {
        setIsLoading(false);
      }
    };

    loadQuests();
  }, [user, initializeQuests]);

  const updateQuestProgress = useCallback((questId: string, progress: number) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          const newProgress = Math.min(progress, q.maxProgress);
          const completed = newProgress >= q.maxProgress;

          if (completed && !q.completed) {
            setCompletedQuests(prevCompleted => {
              const newCompleted = [...prevCompleted, questId];
              saveQuests(updated, newCompleted);
              return newCompleted;
            });
          }

          return {
            ...q,
            progress: newProgress,
            completed
          };
        }
        return q;
      });

      saveQuests(updated, completedQuests);
      return updated;
    });
  }, [saveQuests, completedQuests]);

  // Update quest progress based on visited zone
  const updateQuestFromZoneVisit = useCallback((zoneKey: string) => {
    setQuests(prev => {
      let updated = [...prev];
      let changed = false;
      
      updated = updated.map(quest => {
        if (quest.zones.includes(zoneKey) && !quest.completed) {
          const newProgress = Math.min(quest.progress + 1, quest.maxProgress);
          if (newProgress !== quest.progress) {
            changed = true;
            const completed = newProgress >= quest.maxProgress;
            
            if (completed) {
              setCompletedQuests(prevCompleted => {
                const newCompleted = [...prevCompleted, quest.id];
                return newCompleted;
              });
            }
            
            return { ...quest, progress: newProgress, completed };
          }
        }
        return quest;
      });
      
      if (changed) {
        saveQuests(updated, completedQuests);
      }
      
      return updated;
    });
  }, [saveQuests, completedQuests]);

  const getActiveQuests = useCallback((): Quest[] => {
    return quests.filter(q => !q.completed).slice(0, 3);
  }, [quests]);

  const getCompletedQuestsCount = useCallback((): number => {
    return completedQuests.length;
  }, [completedQuests]);

  const getTotalRewards = useCallback((): number => {
    return completedQuests.reduce((total, questId) => {
      const quest = quests.find(q => q.id === questId);
      return total + (quest?.reward || 0);
    }, 0);
  }, [completedQuests, quests]);

  return {
    quests,
    completedQuests,
    isLoading,
    updateQuestProgress,
    updateQuestFromZoneVisit,
    getActiveQuests,
    getCompletedQuestsCount,
    getTotalRewards,
    initializeQuests
  };
};
