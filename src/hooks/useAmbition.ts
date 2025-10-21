// @ts-nocheck

import { useState } from 'react';
import useOpenAI from './api/useOpenAI';
import { logger } from '@/lib/logger';

interface AmbitionLevel {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  points: number;
  estimatedDuration: string;
}

interface AmbitionGoal {
  id: string;
  title: string;
  description: string;
  levels: AmbitionLevel[];
  totalPoints: number;
  completedLevels: number;
  progressPercentage: number;
  createdAt: Date;
}

export const useAmbition = () => {
  const [goals, setGoals] = useState<AmbitionGoal[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { generateText, isLoading } = useOpenAI();

  const createGoal = async (title: string, description: string): Promise<AmbitionGoal | null> => {
    setIsCreating(true);

    const prompt = `
Décompose cet objectif en 5 niveaux progressifs gamifiés :
Objectif : ${title}
Description : ${description}

Réponds en JSON strict :
{
  "title": "${title}",
  "description": "${description}",
  "levels": [
    {
      "id": "level-1",
      "title": "Niveau 1 - Titre motivant",
      "description": "Action concrète pour commencer",
      "points": 10,
      "estimatedDuration": "15 minutes"
    }
  ]
}

Chaque niveau doit :
- Être plus difficile que le précédent
- Avoir une action claire et mesurable
- Donner entre 10 et 50 points
- Être réalisable dans la durée indiquée
`;

    try {
      const response = await generateText({ prompt });
      if (!response) return null;

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Format JSON invalide');

      const goalData = JSON.parse(jsonMatch[0]);
      const goal: AmbitionGoal = {
        id: `goal-${Date.now()}`,
        title: goalData.title,
        description: goalData.description,
        levels: goalData.levels.map((level: any) => ({
          ...level,
          isCompleted: false
        })),
        totalPoints: goalData.levels.reduce((sum: number, level: any) => sum + level.points, 0),
        completedLevels: 0,
        progressPercentage: 0,
        createdAt: new Date()
      };

      setGoals(prev => [...prev, goal]);
      return goal;
    } catch (error) {
      logger.error('Erreur création objectif', error as Error, 'UI');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const completeLevel = (goalId: string, levelId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;

      const updatedLevels = goal.levels.map(level => 
        level.id === levelId ? { ...level, isCompleted: true } : level
      );

      const completedCount = updatedLevels.filter(level => level.isCompleted).length;
      const progressPercentage = Math.round((completedCount / updatedLevels.length) * 100);

      return {
        ...goal,
        levels: updatedLevels,
        completedLevels: completedCount,
        progressPercentage
      };
    }));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return {
    goals,
    createGoal,
    completeLevel,
    deleteGoal,
    isCreating: isCreating || isLoading
  };
};
