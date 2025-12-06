import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

/**
 * Hook pour récupérer les statistiques des jobs cron depuis Supabase
 */
export const useCronJobs = () => {
  return useQuery({
    queryKey: ['cron-jobs'],
    queryFn: async () => {
      // Récupérer l'historique des exécutions depuis cron.job_run_details
      const { data: jobRuns, error } = await supabase.rpc('get_cron_job_history');

      if (error) {
        logger.error('Error fetching cron jobs:', error, 'HOOK');
        throw error;
      }

      return jobRuns || [];
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};

/**
 * Hook pour récupérer l'historique des jobs cron de gamification
 */
export const useGamificationCronHistory = () => {
  return useQuery({
    queryKey: ['gamification-cron-history'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_gamification_cron_history');

      if (error) {
        logger.error('Error fetching gamification cron history:', error, 'HOOK');
        throw error;
      }

      return data || [];
    },
    refetchInterval: 10000, // Rafraîchir toutes les 10 secondes
  });
};

/**
 * Hook pour récupérer la configuration des jobs cron de gamification
 */
export const useGamificationCronJobs = () => {
  return useQuery({
    queryKey: ['gamification-cron-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_gamification_cron_jobs');

      if (error) {
        logger.error('Error fetching gamification cron jobs:', error, 'HOOK');
        throw error;
      }

      return data || [];
    },
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};

/**
 * Hook pour trigger manuellement la génération de défis quotidiens
 */
export const useTriggerDailyChallenges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-daily-challenges');

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: '✅ Défis générés',
        description: 'Les défis quotidiens ont été générés avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['gamification-cron-history'] });
      queryClient.invalidateQueries({ queryKey: ['daily-challenges'] });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Erreur lors de la génération des défis',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour trigger manuellement le calcul des rankings
 */
export const useTriggerRankings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('calculate-rankings');

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: '✅ Rankings calculés',
        description: 'Le classement a été recalculé avec succès',
      });
      queryClient.invalidateQueries({ queryKey: ['gamification-cron-history'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: any) => {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Erreur lors du calcul des rankings',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook pour récupérer les jobs cron configurés
 */
export const useCronJobsList = () => {
  return useQuery({
    queryKey: ['cron-jobs-list'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cron_jobs_list');

      if (error) {
        logger.error('Error fetching cron jobs list:', error, 'HOOK');
        throw error;
      }

      return data || [];
    },
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });
};

/**
 * Hook pour récupérer les logs des edge functions de gamification
 */
export const useGamificationLogs = (functionName: string) => {
  return useQuery({
    queryKey: ['gamification-logs', functionName],
    queryFn: async () => {
      if (functionName === 'generate-daily-challenges') {
        const { data, error } = await supabase
          .from('daily_challenges')
          .select('*')
          .order('challenge_date', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data;
      } else if (functionName === 'calculate-rankings') {
        const { data, error } = await supabase
          .from('user_leaderboard')
          .select('*')
          .order('last_updated', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data;
      }

      return [];
    },
    refetchInterval: 30000,
  });
};
