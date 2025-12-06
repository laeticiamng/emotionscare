// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ConsentChannel {
  id: string;
  channel_code: string;
  channel_name: string;
  description: string;
  is_active: boolean;
}

export interface ConsentPurpose {
  id: string;
  purpose_code: string;
  purpose_name: string;
  description: string;
  legal_basis: string;
  is_required: boolean;
  is_active: boolean;
}

export interface ConsentPreference {
  id: string;
  user_id: string;
  channel_id: string;
  purpose_id: string;
  consent_given: boolean;
  consent_date: string | null;
  withdrawal_date: string | null;
  source: string;
}

export interface ConsentStatus {
  channel_code: string;
  channel_name: string;
  purpose_code: string;
  purpose_name: string;
  consent_given: boolean;
  consent_date: string | null;
  last_updated: string | null;
}

export interface ConsentHistory {
  id: string;
  user_id: string;
  channel: { channel_code: string; channel_name: string };
  purpose: { purpose_code: string; purpose_name: string };
  previous_consent: boolean | null;
  new_consent: boolean;
  change_type: string;
  source: string;
  created_at: string;
}

export interface MarketingCampaign {
  id: string;
  campaign_code: string;
  campaign_name: string;
  description: string;
  channel_id: string;
  purpose_id: string;
  start_date: string;
  end_date: string | null;
  status: string;
  created_at: string;
}

export const useConsentManagement = () => {
  const queryClient = useQueryClient();

  // Récupérer les canaux disponibles
  const { data: channels = [], isLoading: channelsLoading } = useQuery({
    queryKey: ['consent-channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consent_channels')
        .select('*')
        .eq('is_active', true)
        .order('channel_name');
      
      if (error) throw error;
      return data as ConsentChannel[];
    },
  });

  // Récupérer les finalités disponibles
  const { data: purposes = [], isLoading: purposesLoading } = useQuery({
    queryKey: ['consent-purposes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consent_purposes')
        .select('*')
        .eq('is_active', true)
        .order('purpose_name');
      
      if (error) throw error;
      return data as ConsentPurpose[];
    },
  });

  // Récupérer le statut de consentement de l'utilisateur
  const { data: consentStatus = [], isLoading: statusLoading } = useQuery({
    queryKey: ['consent-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('consent-manager/status');
      
      if (error) throw error;
      return data.consents as ConsentStatus[];
    },
  });

  // Récupérer l'historique des changements
  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['consent-history'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('consent-manager/history');
      
      if (error) throw error;
      return data.history as ConsentHistory[];
    },
  });

  // Récupérer les campagnes marketing
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .in('status', ['active', 'scheduled'])
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data as MarketingCampaign[];
    },
  });

  // Mettre à jour une préférence
  const updateConsentMutation = useMutation({
    mutationFn: async ({ channelId, purposeId, consentGiven }: { 
      channelId: string; 
      purposeId: string; 
      consentGiven: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke('consent-manager/update', {
        body: { channelId, purposeId, consentGiven },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consent-status'] });
      queryClient.invalidateQueries({ queryKey: ['consent-history'] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Mise à jour en masse
  const bulkUpdateMutation = useMutation({
    mutationFn: async (updates: Array<{ channelId: string; purposeId: string; consentGiven: boolean }>) => {
      const { data, error } = await supabase.functions.invoke('consent-manager/bulk-update', {
        body: { updates },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consent-status'] });
      queryClient.invalidateQueries({ queryKey: ['consent-history'] });
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Créer une campagne
  const createCampaignMutation = useMutation({
    mutationFn: async (campaign: Omit<MarketingCampaign, 'id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert({ ...campaign, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast.success('Campagne créée avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  // Valider les consentements pour une campagne
  const validateCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      const { data, error } = await supabase.functions.invoke('consent-manager/validate-campaign', {
        body: { campaignId },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`${data.eligibleUsers} utilisateurs éligibles sur ${data.totalUsers}`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });

  return {
    channels,
    purposes,
    consentStatus,
    history,
    campaigns,
    isLoading: channelsLoading || purposesLoading || statusLoading || historyLoading || campaignsLoading,
    updateConsent: updateConsentMutation.mutateAsync,
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    createCampaign: createCampaignMutation.mutateAsync,
    validateCampaign: validateCampaignMutation.mutateAsync,
    isUpdating: updateConsentMutation.isPending || bulkUpdateMutation.isPending,
  };
};
