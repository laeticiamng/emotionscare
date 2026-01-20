/**
 * Hook useAdmin
 * Gestion de l'état et des opérations d'administration
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  pendingModerations: number;
  activeAlerts: number;
}

export interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
  rollout_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface UseAdminReturn {
  // Data
  stats: AdminStats | null;
  featureFlags: FeatureFlag[];
  isAdmin: boolean;
  
  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions
  toggleFeatureFlag: (flagId: string, enabled: boolean) => Promise<void>;
  refreshStats: () => Promise<void>;
  checkAdminAccess: () => Promise<boolean>;
}

// ============================================================================
// QUERY KEYS
// ============================================================================

const QUERY_KEYS = {
  stats: ['admin', 'stats'],
  flags: ['admin', 'feature-flags'],
  access: ['admin', 'access'],
};

// ============================================================================
// HOOK
// ============================================================================

export function useAdmin(): UseAdminReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check admin access
  const { data: isAdmin = false, isLoading: isLoadingAccess } = useQuery({
    queryKey: QUERY_KEYS.access,
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      return data?.role === 'admin' || data?.role === 'super_admin';
    },
    enabled: !!user?.id,
  });

  // Fetch admin stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
  } = useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: async (): Promise<AdminStats> => {
      // Get user counts
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', weekAgo.toISOString());

      // Get session stats
      const { data: sessionData } = await supabase
        .from('activity_sessions')
        .select('duration_seconds')
        .limit(1000);

      const totalSessions = sessionData?.length || 0;
      const avgDuration = sessionData && sessionData.length > 0
        ? sessionData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessionData.length
        : 0;

      // Get pending moderations
      const { count: pendingModerations } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('moderation_status', 'pending');

      // Get active alerts
      const { count: activeAlerts } = await supabase
        .from('unified_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('resolved', false);

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalSessions,
        averageSessionDuration: Math.round(avgDuration),
        pendingModerations: pendingModerations || 0,
        activeAlerts: activeAlerts || 0,
      };
    },
    enabled: isAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch feature flags
  const { data: featureFlags = [], isLoading: isLoadingFlags } = useQuery({
    queryKey: QUERY_KEYS.flags,
    queryFn: async (): Promise<FeatureFlag[]> => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('name');

      if (error) {
        // Return empty array if table doesn't exist
        if (error.code === '42P01') return [];
        throw error;
      }
      return data || [];
    },
    enabled: isAdmin,
  });

  // Toggle feature flag mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ flagId, enabled }: { flagId: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('feature_flags')
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq('id', flagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.flags });
    },
  });

  // Actions
  const toggleFeatureFlag = useCallback(async (flagId: string, enabled: boolean) => {
    await toggleMutation.mutateAsync({ flagId, enabled });
  }, [toggleMutation]);

  const refreshStats = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
  }, [queryClient]);

  const checkAdminAccess = useCallback(async (): Promise<boolean> => {
    await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.access });
    return isAdmin;
  }, [queryClient, isAdmin]);

  // Combined loading state
  const isLoading = isLoadingAccess || isLoadingStats || isLoadingFlags;

  return {
    stats: stats || null,
    featureFlags,
    isAdmin,
    isLoading,
    isError: isErrorStats,
    error: errorStats as Error | null,
    toggleFeatureFlag,
    refreshStats,
    checkAdminAccess,
  };
}

export default useAdmin;
