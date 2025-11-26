import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { goalsApi, type GoalRecord, type GoalCreatePayload, type GoalUpdatePayload } from '@/services/api/goalsApi';

export type Goal = GoalRecord & {
  progress: number;
  deadline?: string;
  status: 'active' | 'completed';
};

export interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  successRate: number;
}

const mapGoalRecordToView = (record: GoalRecord): Goal => {
  const progressFromValues =
    record.target_value && record.target_value > 0
      ? Math.min(100, Math.round(((record.current_value ?? 0) / record.target_value) * 100))
      : 0;

  const status: Goal['status'] = record.completed ? 'completed' : 'active';
  const progress = record.completed ? 100 : progressFromValues;

  return {
    ...record,
    progress,
    deadline: record.target_date ?? undefined,
    status,
  };
};

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

  const calculateStats = useCallback((goalList: Goal[]) => {
    const totalGoals = goalList.length;
    const completedGoals = goalList.filter(goal => goal.completed || goal.status === 'completed').length;
    const activeGoals = totalGoals - completedGoals;
    const successRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    setStats({ totalGoals, activeGoals, completedGoals, successRate });
  }, []);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setStats({ totalGoals: 0, activeGoals: 0, completedGoals: 0, successRate: 0 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [goalResponse, statsResponse] = await Promise.all([
        goalsApi.listGoals(),
        goalsApi.getStats().catch(() => null),
      ]);

      const mappedGoals = goalResponse.map(mapGoalRecordToView);
      setGoals(mappedGoals);

      if (statsResponse) {
        setStats({
          totalGoals: statsResponse.total,
          activeGoals: statsResponse.active,
          completedGoals: statsResponse.completed,
          successRate: statsResponse.completion_rate,
        });
      } else {
        calculateStats(mappedGoals);
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos objectifs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, calculateStats]);

  const createGoal = useCallback(
    async (goalData: GoalCreatePayload): Promise<Goal | null> => {
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté pour créer un objectif',
          variant: 'destructive',
        });
        return null;
      }

      try {
        const record = await goalsApi.createGoal(goalData);
        const mapped = mapGoalRecordToView(record);
        setGoals(current => {
          const updated = [mapped, ...current];
          calculateStats(updated);
          return updated;
        });

        toast({
          title: 'Objectif créé',
          description: `"${goalData.title}" a été ajouté à vos objectifs`,
        });

        return mapped;
      } catch (err) {
        console.error('Error creating goal:', err);
        toast({
          title: 'Erreur',
          description: "Impossible de créer l'objectif",
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast, calculateStats],
  );

  const updateGoal = useCallback(
    async (goalId: string, updates: GoalUpdatePayload): Promise<Goal | null> => {
      if (!user) return null;

      try {
        const record = await goalsApi.updateGoal(goalId, updates);
        const mapped = mapGoalRecordToView(record);
        setGoals(current => {
          const updated = current.map(goal => (goal.id === goalId ? mapped : goal));
          calculateStats(updated);
          return updated;
        });

        toast({
          title: 'Objectif mis à jour',
          description: 'Les modifications ont été sauvegardées',
        });

        return mapped;
      } catch (err) {
        console.error('Error updating goal:', err);
        toast({
          title: 'Erreur',
          description: "Impossible de mettre à jour l'objectif",
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast, calculateStats],
  );

  const updateProgress = useCallback(
    async (goalId: string, currentValue: number, notes?: string): Promise<Goal | null> => {
      if (!user) return null;

      try {
        const record = await goalsApi.updateProgress(goalId, { current_value: currentValue, notes });
        const mapped = mapGoalRecordToView(record);
        setGoals(current => {
          const updated = current.map(goal => (goal.id === goalId ? mapped : goal));
          calculateStats(updated);
          return updated;
        });
        return mapped;
      } catch (err) {
        console.error('Error updating goal progress:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de mettre à jour la progression',
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast, calculateStats],
  );

  const deleteGoal = useCallback(
    async (goalId: string) => {
      if (!user) return false;

      try {
        await goalsApi.deleteGoal(goalId);
        setGoals(current => {
          const updated = current.filter(goal => goal.id !== goalId);
          calculateStats(updated);
          return updated;
        });

        toast({
          title: 'Objectif supprimé',
          description: "L'objectif a été supprimé",
        });

        return true;
      } catch (err) {
        console.error('Error deleting goal:', err);
        toast({
          title: 'Erreur',
          description: "Impossible de supprimer l'objectif",
          variant: 'destructive',
        });
        return false;
      }
    },
    [user, toast, calculateStats],
  );

  const completeGoal = useCallback(
    async (goalId: string) => {
      if (!user) return null;
      try {
        const record = await goalsApi.completeGoal(goalId);
        const mapped = mapGoalRecordToView(record);
        setGoals(current => {
          const updated = current.map(goal => (goal.id === goalId ? mapped : goal));
          calculateStats(updated);
          return updated;
        });
        return mapped;
      } catch (err) {
        console.error('Error completing goal:', err);
        toast({
          title: 'Erreur',
          description: "Impossible de marquer l'objectif comme terminé",
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast, calculateStats],
  );

  const fetchGoalById = useCallback(
    async (goalId: string): Promise<Goal | null> => {
      if (!user) return null;
      try {
        const record = await goalsApi.getGoal(goalId);
        return record ? mapGoalRecordToView(record) : null;
      } catch (err) {
        console.error('Error fetching goal detail:', err);
        toast({
          title: 'Erreur',
          description: "Impossible de charger l'objectif demandé",
          variant: 'destructive',
        });
        return null;
      }
    },
    [user, toast],
  );

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const isEmpty = useMemo(() => !isLoading && goals.length === 0, [goals.length, isLoading]);

  return {
    goals,
    stats,
    isLoading,
    error,
    isEmpty,
    createGoal,
    updateGoal,
    updateProgress,
    deleteGoal,
    completeGoal,
    refreshGoals: fetchGoals,
    fetchGoalById,
  };
};
