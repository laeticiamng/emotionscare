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
 * Hook pour récupérer les logs des edge functions
 */
export const useEdgeFunctionLogs = (functionName: string) => {
  return useQuery({
    queryKey: ['edge-function-logs', functionName],
    queryFn: async () => {
      // Récupérer les logs depuis la table compliance_reports pour scheduled-pdf-reports
      // et depuis realtime_notifications pour pdf-notifications
      
      if (functionName === 'scheduled-pdf-reports') {
        const { data, error } = await supabase
          .from('compliance_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data;
      } else if (functionName === 'pdf-notifications') {
        const { data, error } = await supabase
          .from('realtime_notifications')
          .select('*')
          .eq('type', 'report_ready')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        return data;
      }

      return [];
    },
    refetchInterval: 30000,
  });
};
