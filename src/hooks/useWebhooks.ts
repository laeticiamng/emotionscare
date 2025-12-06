// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret_key: string;
  is_active: boolean;
  events: string[];
  description: string;
  headers: Record<string, string>;
  retry_config: {
    max_attempts: number;
    backoff_seconds: number[];
  };
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: any;
  status: string;
  attempts: number;
  max_attempts: number;
  http_status: number;
  error_message: string;
  delivered_at: string;
  created_at: string;
}

export interface WebhookStats {
  webhook_id: string;
  webhook_name: string;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  pending_deliveries: number;
  success_rate: number;
  avg_delivery_time_seconds: number;
}

export const useWebhooks = () => {
  const queryClient = useQueryClient();

  // Récupérer les webhooks
  const { data: webhooks = [], isLoading: webhooksLoading } = useQuery({
    queryKey: ['webhook-endpoints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_endpoints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WebhookEndpoint[];
    },
  });

  // Récupérer les deliveries récentes
  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
    queryKey: ['webhook-deliveries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_deliveries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as WebhookDelivery[];
    },
    refetchInterval: 30000, // Rafraîchir toutes les 30s
  });

  // Récupérer les statistiques
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['webhook-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('webhook-processor/stats');
      
      if (error) throw error;
      return data.stats as WebhookStats[];
    },
  });

  // Créer un webhook
  const createWebhookMutation = useMutation({
    mutationFn: async (webhook: Omit<WebhookEndpoint, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('webhook_endpoints')
        .insert({ ...webhook, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mettre à jour un webhook
  const updateWebhookMutation = useMutation({
    mutationFn: async ({ id, ...webhook }: Partial<WebhookEndpoint> & { id: string }) => {
      const { data, error } = await supabase
        .from('webhook_endpoints')
        .update(webhook)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook mis à jour');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Supprimer un webhook
  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('webhook_endpoints')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhook-endpoints'] });
      toast.success('Webhook supprimé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Traiter les événements
  const processEventsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('webhook-processor/process');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['webhook-stats'] });
      toast.success(`${data.processed} événements traités`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Réessayer les webhooks
  const retryWebhooksMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('webhook-processor/retry');
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhook-deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['webhook-stats'] });
      toast.success(`${data.retried} webhooks réessayés`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  return {
    webhooks,
    deliveries,
    stats,
    isLoading: webhooksLoading || deliveriesLoading || statsLoading,
    createWebhook: createWebhookMutation.mutateAsync,
    updateWebhook: updateWebhookMutation.mutateAsync,
    deleteWebhook: deleteWebhookMutation.mutateAsync,
    processEvents: processEventsMutation.mutateAsync,
    retryWebhooks: retryWebhooksMutation.mutateAsync,
    isProcessing: processEventsMutation.isPending || retryWebhooksMutation.isPending,
  };
};
