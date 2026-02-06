import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  progress: number;
  target_value?: number;
  current_value?: number;
  deadline: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  successRate: number;
}

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats>({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals from Supabase
  const fetchGoals = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const goalsData = data as Goal[];
      setGoals(goalsData);

      // Calculate stats
      const totalGoals = goalsData.length;
      const activeGoals = goalsData.filter(g => g.status === 'active').length;
      const completedGoals = goalsData.filter(g => g.status === 'completed').length;
      const successRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      setStats({
        totalGoals,
        activeGoals,
        completedGoals,
        successRate,
      });
    } catch (err) {
      logger.error('Error fetching goals', err instanceof Error ? err : new Error(String(err)), 'UI');
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos objectifs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Create a new goal
  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour créer un objectif',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const { data, error: createError } = await supabase
        .from('user_goals')
        .insert({
          ...goalData,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      toast({
        title: 'Objectif créé',
        description: `"${goalData.title}" a été ajouté à vos objectifs`,
      });

      // Refresh goals list
      await fetchGoals();

      return data as Goal;
    } catch (err) {
      logger.error('Error creating goal', err instanceof Error ? err : new Error(String(err)), 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'objectif',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update a goal
  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('user_goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast({
        title: 'Objectif mis à jour',
        description: 'Les modifications ont été sauvegardées',
      });

      // Refresh goals list
      await fetchGoals();

      return data as Goal;
    } catch (err) {
      logger.error('Error updating goal', err instanceof Error ? err : new Error(String(err)), 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'objectif',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update goal progress
  const updateProgress = async (goalId: string, progress: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    const status = progress >= 100 ? 'completed' : 'active';

    return updateGoal(goalId, {
      progress,
      status,
      ...(progress >= 100 && { current_value: goal.target_value }),
    });
  };

  // Delete a goal
  const deleteGoal = async (goalId: string) => {
    if (!user) return false;

    try {
      const { error: deleteError } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      toast({
        title: 'Objectif supprimé',
        description: 'L\'objectif a été supprimé',
      });

      // Refresh goals list
      await fetchGoals();

      return true;
    } catch (err) {
      logger.error('Error deleting goal', err instanceof Error ? err : new Error(String(err)), 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'objectif',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Archive a goal
  const archiveGoal = async (goalId: string) => {
    return updateGoal(goalId, { status: 'archived' });
  };

  // Load goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    stats,
    isLoading,
    error,
    createGoal,
    updateGoal,
    updateProgress,
    deleteGoal,
    archiveGoal,
    refreshGoals: fetchGoals,
  };
};
