/**
 * useB2BOrgSettings - Paramètres organisation B2B
 * Gestion des configurations, préférences et politiques de l'organisation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface OrgSettings {
  id: string;
  orgId: string;
  name: string;
  logo?: string;
  primaryColor: string;
  timezone: string;
  locale: string;
  anonymizationThreshold: number;
  dataRetentionDays: number;
  weekStartDay: number;
  notificationsEnabled: boolean;
  alertThresholds: {
    stressHigh: number;
    engagementLow: number;
    burnoutRisk: number;
  };
  features: {
    heatmapEnabled: boolean;
    alertsEnabled: boolean;
    reportsEnabled: boolean;
    socialCoconEnabled: boolean;
  };
  updatedAt: string;
}

const DEFAULT_SETTINGS: OrgSettings = {
  id: 'default',
  orgId: '',
  name: 'Organisation',
  primaryColor: '#6366f1',
  timezone: 'Europe/Paris',
  locale: 'fr-FR',
  anonymizationThreshold: 5,
  dataRetentionDays: 365,
  weekStartDay: 1,
  notificationsEnabled: true,
  alertThresholds: {
    stressHigh: 70,
    engagementLow: 40,
    burnoutRisk: 80,
  },
  features: {
    heatmapEnabled: true,
    alertsEnabled: true,
    reportsEnabled: true,
    socialCoconEnabled: true,
  },
  updatedAt: new Date().toISOString(),
};

async function fetchOrgSettings(orgId: string): Promise<OrgSettings> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .maybeSingle();

    if (error) {
      logger.warn('[B2BOrgSettings] Fetch error, using defaults', { error: error.message });
      return { ...DEFAULT_SETTINGS, orgId };
    }

    if (!data) {
      return { ...DEFAULT_SETTINGS, orgId };
    }

    // Mapper les données réelles vers notre interface
    return {
      id: data.id,
      orgId: data.id,
      name: data.name || 'Organisation',
      logo: data.logo_url,
      primaryColor: data.primary_color || '#6366f1',
      timezone: data.timezone || 'Europe/Paris',
      locale: data.locale || 'fr-FR',
      anonymizationThreshold: data.anonymization_threshold || 5,
      dataRetentionDays: data.data_retention_days || 365,
      weekStartDay: data.week_start_day || 1,
      notificationsEnabled: data.notifications_enabled ?? true,
      alertThresholds: data.alert_thresholds || DEFAULT_SETTINGS.alertThresholds,
      features: data.features || DEFAULT_SETTINGS.features,
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    logger.error('[B2BOrgSettings] Fetch failed', error as Error, 'B2B');
    return { ...DEFAULT_SETTINGS, orgId };
  }
}

async function updateOrgSettings(orgId: string, updates: Partial<OrgSettings>): Promise<void> {
  const { error } = await supabase
    .from('organizations')
    .update({
      name: updates.name,
      logo_url: updates.logo,
      primary_color: updates.primaryColor,
      timezone: updates.timezone,
      locale: updates.locale,
      anonymization_threshold: updates.anonymizationThreshold,
      data_retention_days: updates.dataRetentionDays,
      week_start_day: updates.weekStartDay,
      notifications_enabled: updates.notificationsEnabled,
      alert_thresholds: updates.alertThresholds,
      features: updates.features,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId);

  if (error) throw error;
}

export function useB2BOrgSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-org-settings', orgId],
    queryFn: () => fetchOrgSettings(orgId!),
    enabled: !!orgId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<OrgSettings>) => updateOrgSettings(orgId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-org-settings', orgId] });
      toast.success('Paramètres mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  return {
    settings: query.data || DEFAULT_SETTINGS,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}

export default useB2BOrgSettings;
