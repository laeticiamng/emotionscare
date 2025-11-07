// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuditSchedule {
  id: string;
  name: string;
  frequency: string;
  day_of_week: number;
  day_of_month: number;
  time_of_day: string;
  is_active: boolean;
  last_run_at: string;
  next_run_at: string;
  alert_threshold: number;
  alert_recipients: string[];
  created_at: string;
}

export interface AuditAlert {
  id: string;
  schedule_id: string;
  audit_id: string;
  alert_type: string;
  severity: string;
  title: string;
  message: string;
  previous_score: number;
  current_score: number;
  score_drop: number;
  is_sent: boolean;
  created_at: string;
  audit?: {
    audit_date: string;
    overall_score: number;
  };
}

export const useScheduledAudits = () => {
  const queryClient = useQueryClient();

  // Récupérer les schedules
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ['audit-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_schedules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AuditSchedule[];
    },
  });

  // Récupérer les alertes
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['audit-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('scheduled-audits/alerts');
      
      if (error) throw error;
      return data.alerts as AuditAlert[];
    },
    refetchInterval: 30000,
  });

  // Créer un schedule
  const createScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<AuditSchedule, 'id' | 'created_at' | 'last_run_at' | 'next_run_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('audit_schedules')
        .insert({ ...schedule, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules'] });
      toast.success('Planification créée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mettre à jour un schedule
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ id, ...schedule }: Partial<AuditSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('audit_schedules')
        .update(schedule)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules'] });
      toast.success('Planification mise à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Supprimer un schedule
  const deleteScheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audit_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-schedules'] });
      toast.success('Planification supprimée');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Marquer une alerte comme lue
  const markAlertReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audit_alerts')
        .update({ is_sent: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-alerts'] });
    },
  });

  return {
    schedules,
    alerts,
    isLoading: schedulesLoading || alertsLoading,
    createSchedule: createScheduleMutation.mutateAsync,
    updateSchedule: updateScheduleMutation.mutateAsync,
    deleteSchedule: deleteScheduleMutation.mutateAsync,
    markAlertRead: markAlertReadMutation.mutateAsync,
    isUpdating: createScheduleMutation.isPending || updateScheduleMutation.isPending || deleteScheduleMutation.isPending,
  };
};
