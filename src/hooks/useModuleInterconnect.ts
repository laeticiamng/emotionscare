/**
 * Hook useModuleInterconnect
 * Hook React pour l'interconnexion des modules
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect } from 'react';
import { 
  moduleInterconnectService, 
  type SessionType,
  type UnifiedSession,
  type SessionStats,
  type ModuleRecommendation,
  type CrossModuleInsights,
  type ConnectionType
} from '@/services/moduleInterconnectService';

interface UseModuleInterconnectOptions {
  autoFetch?: boolean;
  refetchInterval?: number;
}

interface UseModuleInterconnectReturn {
  // Data
  sessions: UnifiedSession[];
  stats: SessionStats[];
  recommendations: ModuleRecommendation[];
  insights: CrossModuleInsights | null;
  
  // State
  isLoading: boolean;
  isError: boolean;
  
  // Actions
  createSession: (session: Omit<UnifiedSession, 'id' | 'created_at'>) => Promise<UnifiedSession>;
  syncFromModule: (
    moduleType: SessionType, 
    sourceId: string, 
    data: {
      duration_seconds?: number;
      mood_before?: number;
      mood_after?: number;
      xp_earned?: number;
      metadata?: Record<string, unknown>;
    }
  ) => Promise<UnifiedSession | null>;
  notifyModules: (
    sourceModule: string,
    eventType: ConnectionType,
    eventData: Record<string, unknown>
  ) => Promise<void>;
  refreshAll: () => void;
}

export function useModuleInterconnect(
  options: UseModuleInterconnectOptions = {}
): UseModuleInterconnectReturn {
  const { autoFetch = true, refetchInterval = 60000 } = options;
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch sessions
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    isError: sessionsError
  } = useQuery({
    queryKey: ['unified-sessions', user?.id],
    queryFn: () => moduleInterconnectService.getUserSessions({ limit: 100 }),
    enabled: !!user?.id && autoFetch,
    refetchInterval,
    staleTime: 30000
  });

  // Fetch stats
  const {
    data: stats = [],
    isLoading: statsLoading,
    isError: statsError
  } = useQuery({
    queryKey: ['session-stats', user?.id],
    queryFn: () => moduleInterconnectService.getSessionStats(),
    enabled: !!user?.id && autoFetch,
    refetchInterval,
    staleTime: 30000
  });

  // Fetch recommendations
  const {
    data: recommendations = [],
    isLoading: recsLoading,
    isError: recsError
  } = useQuery({
    queryKey: ['module-recommendations', user?.id],
    queryFn: () => moduleInterconnectService.getModuleRecommendations(),
    enabled: !!user?.id && autoFetch,
    refetchInterval: refetchInterval * 2,
    staleTime: 60000
  });

  // Fetch insights
  const {
    data: insights = null,
    isLoading: insightsLoading,
    isError: insightsError
  } = useQuery({
    queryKey: ['cross-module-insights', user?.id],
    queryFn: () => moduleInterconnectService.getCrossModuleInsights(),
    enabled: !!user?.id && autoFetch,
    refetchInterval: refetchInterval * 2,
    staleTime: 60000
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: (session: Omit<UnifiedSession, 'id' | 'created_at'>) => 
      moduleInterconnectService.createSession(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
      queryClient.invalidateQueries({ queryKey: ['cross-module-insights'] });
    }
  });

  // Sync from module mutation
  const syncFromModuleMutation = useMutation({
    mutationFn: ({ 
      moduleType, 
      sourceId, 
      data 
    }: { 
      moduleType: SessionType; 
      sourceId: string; 
      data: {
        duration_seconds?: number;
        mood_before?: number;
        mood_after?: number;
        xp_earned?: number;
        metadata?: Record<string, unknown>;
      };
    }) => moduleInterconnectService.syncFromModule(moduleType, sourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
    }
  });

  // Actions
  const createSession = useCallback(
    async (session: Omit<UnifiedSession, 'id' | 'created_at'>) => {
      return createSessionMutation.mutateAsync(session);
    },
    [createSessionMutation]
  );

  const syncFromModule = useCallback(
    async (
      moduleType: SessionType,
      sourceId: string,
      data: {
        duration_seconds?: number;
        mood_before?: number;
        mood_after?: number;
        xp_earned?: number;
        metadata?: Record<string, unknown>;
      }
    ) => {
      return syncFromModuleMutation.mutateAsync({ moduleType, sourceId, data });
    },
    [syncFromModuleMutation]
  );

  const notifyModules = useCallback(
    async (
      sourceModule: string,
      eventType: ConnectionType,
      eventData: Record<string, unknown>
    ) => {
      return moduleInterconnectService.notifyConnectedModules(
        sourceModule,
        eventType,
        eventData
      );
    },
    []
  );

  const refreshAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['unified-sessions'] });
    queryClient.invalidateQueries({ queryKey: ['session-stats'] });
    queryClient.invalidateQueries({ queryKey: ['module-recommendations'] });
    queryClient.invalidateQueries({ queryKey: ['cross-module-insights'] });
  }, [queryClient]);

  // Listen for module events
  useEffect(() => {
    const handleModuleEvent = (event: CustomEvent) => {
      // Refresh data when modules communicate
      if (event.detail?.type === 'triggers' || event.detail?.type === 'shares_data') {
        queryClient.invalidateQueries({ queryKey: ['unified-sessions'] });
        queryClient.invalidateQueries({ queryKey: ['session-stats'] });
      }
    };

    window.addEventListener('module-event', handleModuleEvent as EventListener);
    return () => {
      window.removeEventListener('module-event', handleModuleEvent as EventListener);
    };
  }, [queryClient]);

  return {
    // Data
    sessions,
    stats,
    recommendations,
    insights,
    
    // State
    isLoading: sessionsLoading || statsLoading || recsLoading || insightsLoading,
    isError: sessionsError || statsError || recsError || insightsError,
    
    // Actions
    createSession,
    syncFromModule,
    notifyModules,
    refreshAll
  };
}

export default useModuleInterconnect;
