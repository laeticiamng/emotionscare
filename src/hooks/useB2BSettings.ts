// @ts-nocheck
/**
 * Hook pour les paramètres B2B de l'organisation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import type { B2BSettings, UpdateSettingsInput } from '@/features/b2b/types';

const DEFAULT_SETTINGS: B2BSettings = {
  id: '',
  orgId: '',
  notificationsEnabled: true,
  weeklyReportEnabled: true,
  alertThreshold: 60,
  wellnessGoal: 80,
  timezone: 'Europe/Paris',
  language: 'fr',
  features: {
    heatmap: true,
    reports: true,
    events: true,
    analytics: true,
  },
  updatedAt: new Date().toISOString(),
};

async function fetchSettings(orgId: string): Promise<B2BSettings> {
  try {
    const { data, error } = await supabase
      .from('b2b_settings')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (error) {
      logger.warn('Settings fetch error, using defaults', error.message);
      return { ...DEFAULT_SETTINGS, orgId };
    }

    return {
      id: data.id,
      orgId: data.org_id,
      notificationsEnabled: data.notifications_enabled ?? true,
      weeklyReportEnabled: data.weekly_report_enabled ?? true,
      alertThreshold: data.alert_threshold ?? 60,
      wellnessGoal: data.wellness_goal ?? 80,
      timezone: data.timezone ?? 'Europe/Paris',
      language: data.language ?? 'fr',
      branding: data.branding,
      features: data.features ?? DEFAULT_SETTINGS.features,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    logger.error('Error fetching settings', error as Error, 'B2B');
    return { ...DEFAULT_SETTINGS, orgId };
  }
}

export function useB2BSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-settings', orgId],
    queryFn: () => fetchSettings(orgId!),
    enabled: !!orgId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UpdateSettingsInput) => {
      if (!orgId) throw new Error('No organization');
      
      const updateData: Record<string, unknown> = {};
      if (input.notificationsEnabled !== undefined) updateData.notifications_enabled = input.notificationsEnabled;
      if (input.weeklyReportEnabled !== undefined) updateData.weekly_report_enabled = input.weeklyReportEnabled;
      if (input.alertThreshold !== undefined) updateData.alert_threshold = input.alertThreshold;
      if (input.wellnessGoal !== undefined) updateData.wellness_goal = input.wellnessGoal;
      if (input.timezone !== undefined) updateData.timezone = input.timezone;
      if (input.language !== undefined) updateData.language = input.language;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('b2b_settings')
        .upsert({
          org_id: orgId,
          ...updateData,
        }, { onConflict: 'org_id' });

      if (error) throw error;

      // Log audit
      await supabase.from('b2b_audit_logs').insert({
        org_id: orgId,
        action: 'settings_updated',
        entity_type: 'settings',
        entity_id: orgId,
        user_id: user?.id,
        user_email: user?.email,
        details: input,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2b-settings'] });
      toast({ title: 'Paramètres mis à jour' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour les paramètres', variant: 'destructive' });
      logger.error('Update settings error', error as Error, 'B2B');
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
