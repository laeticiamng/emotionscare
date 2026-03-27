// @ts-nocheck
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/store/dashboard.store';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export const useContinue = () => {
  const store = useDashboardStore();
  const { user } = useAuth();

  const { data: continueItem, isLoading, isError, error } = useQuery({
    queryKey: ['continue-item', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Fetch the most recent incomplete activity session for this user
      const { data, error } = await supabase
        .from('activity_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        logger.error('Failed to fetch continue data', error as Error, 'SYSTEM');
        return null;
      }

      if (!data) return null;

      // Map the activity session to a ContinueItem
      return {
        title: data.title || data.module_name || data.module || 'Activity',
        subtitle: data.subtitle || data.description || '',
        deeplink: data.deeplink || `/${data.module}?resume=${data.id}`,
        module: data.module || data.module_name || '',
      };
    },
    enabled: !!user?.id,
    staleTime: 60 * 1000, // 1 minute
  });

  // Sync with dashboard store
  useEffect(() => {
    store.setLoading('continue', isLoading);
  }, [isLoading]);

  useEffect(() => {
    store.setContinueItem(continueItem ?? null);
  }, [continueItem]);

  return {
    item: continueItem ?? null,
    loading: isLoading,
    isError,
    error,
  };
};
