// @ts-nocheck
/**
 * Hook pour la gestion des quêtes et missions du parc émotionnel
 */

import { useState, useEffect } from 'react';

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
  timeLimit?: number; // en heures
  createdAt: Date;
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
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);

  // Initialize quests from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('park-quests');
    const savedCompleted = localStorage.getItem('park-quests-completed');

    if (saved) {
      try {
        const parsedQuests = JSON.parse(saved);
        setQuests(parsedQuests);
      } catch {
        initializeQuests();
      }
    } else {
      initializeQuests();
    }

    if (savedCompleted) {
      try {
        setCompletedQuests(JSON.parse(savedCompleted));
      } catch {
        setCompletedQuests([]);
      }
    }
  }, []);

  const initializeQuests = () => {
    const newQuests: Quest[] = AVAILABLE_QUESTS.map(q => ({
      ...q,
      progress: 0,
      completed: false,
      createdAt: new Date()
    }));
    setQuests(newQuests);
    localStorage.setItem('park-quests', JSON.stringify(newQuests));
  };

  const updateQuestProgress = (questId: string, progress: number) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          const newProgress = Math.min(progress, q.maxProgress);
          const completed = newProgress >= q.maxProgress;

          if (completed && !q.completed) {
            // Mark as completed and add to completed list
            setCompletedQuests(prevCompleted => {
              const newCompleted = [...prevCompleted, questId];
              localStorage.setItem('park-quests-completed', JSON.stringify(newCompleted));
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

      localStorage.setItem('park-quests', JSON.stringify(updated));
      return updated;
    });
  };

  const getActiveQuests = (): Quest[] => {
    return quests.filter(q => !q.completed).slice(0, 3);
  };

  const getCompletedQuestsCount = (): number => {
    return completedQuests.length;
  };

  const getTotalRewards = (): number => {
    return completedQuests.reduce((total, questId) => {
      const quest = quests.find(q => q.id === questId);
      return total + (quest?.reward || 0);
    }, 0);
  };

  return {
    quests,
    completedQuests,
    updateQuestProgress,
    getActiveQuests,
    getCompletedQuestsCount,
    getTotalRewards,
    initializeQuests
  };
};
