/**
 * useGoalsTracking - Hook pour la gestion des objectifs utilisateur
 * Corrige: user_goals: 0 définis
 */

import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: 'wellness' | 'meditation' | 'breath' | 'journal' | 'social' | 'custom';
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
}

export interface GoalInput {
  title: string;
  description?: string;
  category: Goal['category'];
  target_value: number;
  unit: string;
  deadline?: string;
}

export function useGoalsTracking() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user goals
  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      logger.error(`Failed to fetch goals: ${err}`, 'GOALS');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Create new goal
  const createGoal = useCallback(async (input: GoalInput): Promise<Goal | null> => {
    if (!isAuthenticated || !user?.id) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return null;
    }

    try {
      const goalData = {
        user_id: user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        target_value: input.target_value,
        current_value: 0,
        unit: input.unit,
        deadline: input.deadline,
        status: 'active' as const,
      };

      const { data, error } = await supabase
        .from('user_goals')
        .insert(goalData)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => [data, ...prev]);
      toast({ title: '🎯 Objectif créé !', description: input.title });
      logger.info(`Created goal: ${data.id}`, 'GOALS');
      return data;
    } catch (err) {
      logger.error(`Failed to create goal: ${err}`, 'GOALS');
      toast({ title: 'Erreur', description: 'Impossible de créer l\'objectif', variant: 'destructive' });
      return null;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Update goal progress
  const updateProgress = useCallback(async (
    goalId: string,
    increment: number
  ): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return false;

      const newValue = Math.min(goal.current_value + increment, goal.target_value);
      const isCompleted = newValue >= goal.target_value;

      const { error } = await supabase
        .from('user_goals')
        .update({
          current_value: newValue,
          status: isCompleted ? 'completed' : 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prev => prev.map(g => 
        g.id === goalId 
          ? { ...g, current_value: newValue, status: isCompleted ? 'completed' : 'active' }
          : g
      ));

      if (isCompleted) {
        toast({ title: '🎉 Objectif atteint !', description: goal.title });
      }

      return true;
    } catch (err) {
      logger.error(`Failed to update goal progress: ${err}`, 'GOALS');
      return false;
    }
  }, [isAuthenticated, user?.id, goals, toast]);

  // Delete goal
  const deleteGoal = useCallback(async (goalId: string): Promise<boolean> => {
    if (!isAuthenticated || !user?.id) return false;

    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast({ title: 'Objectif supprimé' });
      return true;
    } catch (err) {
      logger.error(`Failed to delete goal: ${err}`, 'GOALS');
      return false;
    }
  }, [isAuthenticated, user?.id, toast]);

  // Get active goals count
  const activeGoalsCount = goals.filter(g => g.status === 'active').length;
  const completedGoalsCount = goals.filter(g => g.status === 'completed').length;

  // Auto-fetch on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    activeGoals: goals.filter(g => g.status === 'active'),
    completedGoals: goals.filter(g => g.status === 'completed'),
    activeGoalsCount,
    completedGoalsCount,
    isLoading,
    createGoal,
    updateProgress,
    deleteGoal,
    refetch: fetchGoals,
  };
}

export default useGoalsTracking;
