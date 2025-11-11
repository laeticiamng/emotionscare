import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
        console.error('Error fetching cron jobs:', error);
        throw error;
      }

      return jobRuns || [];
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
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
        console.error('Error fetching cron jobs list:', error);
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
