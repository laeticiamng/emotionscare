import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  fetchMonitoringEvents,
  fetchMonitoringStats,
  insertMonitoringEvent,
  cleanupOldMonitoringEvents,
  type EventType,
  type EventSeverity,
  type EventContext,
  type MonitoringEventInsert,
} from '@/services/monitoring/monitoringEventsService';

interface UseMonitoringEventsOptions {
  limit?: number;
  offset?: number;
  severity?: EventSeverity;
  context?: EventContext;
  eventType?: EventType;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useMonitoringEvents(options?: UseMonitoringEventsOptions) {
  const queryKey = ['monitoring-events', options];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchMonitoringEvents(options),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval || 30000, // Refresh every 30 seconds by default
    staleTime: 10000,
  });

  return {
    events: query.data?.events || [],
    count: query.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useMonitoringStats(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
  const query = useQuery({
    queryKey: ['monitoring-stats', timeRange],
    queryFn: () => fetchMonitoringStats(timeRange),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useInsertMonitoringEvent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (event: Omit<MonitoringEventInsert, 'id' | 'created_at'>) => insertMonitoringEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring-events'] });
      queryClient.invalidateQueries({ queryKey: ['monitoring-stats'] });
    },
  });

  const logEvent = useCallback(
    (params: {
      eventType: EventType;
      severity: EventSeverity;
      message: string;
      context: EventContext;
      aiAnalysis?: any;
      metadata?: any;
    }) => {
      return mutation.mutate({
        event_type: params.eventType,
        severity: params.severity,
        message: params.message,
        context: params.context,
        ai_analysis: params.aiAnalysis,
        metadata: params.metadata,
      });
    },
    [mutation]
  );

  return {
    logEvent,
    isLogging: mutation.isPending,
    error: mutation.error,
  };
}

export function useCleanupMonitoringEvents() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (daysOld: number) => cleanupOldMonitoringEvents(daysOld),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitoring-events'] });
      queryClient.invalidateQueries({ queryKey: ['monitoring-stats'] });
    },
  });

  return {
    cleanup: mutation.mutate,
    isCleaningUp: mutation.isPending,
    error: mutation.error,
  };
}
