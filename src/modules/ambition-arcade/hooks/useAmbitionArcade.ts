import { useState, useCallback } from 'react';

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface UseAmbitionArcadeReturn {
  goals: Goal[];
  currentLevel: number;
  addGoal: () => void;
  completeGoal: (id: string) => void;
}

/**
 * Hook pour gérer les objectifs gamifiés
 */
export const useAmbitionArcade = (): UseAmbitionArcadeReturn => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  const addGoal = useCallback(() => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: `Objectif ${goals.length + 1}`,
      completed: false,
    };
    setGoals(prev => [...prev, newGoal]);
  }, [goals.length]);

  const completeGoal = useCallback((id: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, completed: true } : goal
    ));
    setCurrentLevel(prev => prev + 1);
  }, []);

  return {
    goals,
    currentLevel,
    addGoal,
    completeGoal,
  };
};
