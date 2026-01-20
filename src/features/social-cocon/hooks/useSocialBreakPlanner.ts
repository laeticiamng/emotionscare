/**
 * Social Break Planner Hook
 *
 * Hook for scheduling social breaks with quiet hours support.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Sentry } from '@/lib/errors/sentry-compat';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import {
  cancelScheduledBreak,
  fetchQuietHours,
  fetchUpcomingBreaks,
  scheduleBreak as scheduleBreakRequest,
} from '../api';
import {
  type QuietHoursSettings,
  type ScheduleBreakPayload,
  type SocialBreakPlan,
  isWithinQuietHours,
} from '../types';

interface UseSocialBreakPlannerOptions {
  enabled?: boolean;
}

interface UseSocialBreakPlannerResult {
  quietHours: QuietHoursSettings | null;
  upcomingBreaks: SocialBreakPlan[];
  isLoading: boolean;
  quietHoursLoading: boolean;
  scheduleBreak: (payload: ScheduleBreakPayload) => Promise<SocialBreakPlan | null>;
  cancelBreak: (breakId: string) => Promise<void>;
  isScheduling: boolean;
}

const sortByDate = (entries: SocialBreakPlan[]) =>
  [...entries].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

export const useSocialBreakPlanner = (
  options?: UseSocialBreakPlannerOptions
): UseSocialBreakPlannerResult => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [breaks, setBreaks] = useState<SocialBreakPlan[]>([]);
  const [quietHours, setQuietHours] = useState<QuietHoursSettings | null>(null);

  const breaksQuery = useQuery({
    queryKey: ['social-breaks'],
    queryFn: fetchUpcomingBreaks,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
  });

  const quietHoursQuery = useQuery({
    queryKey: ['social-quiet-hours'],
    queryFn: fetchQuietHours,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60,
  });

  // Supabase Realtime subscription for breaks
  useEffect(() => {
    if (options?.enabled === false) return;

    const channel = supabase
      .channel('social-breaks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_room_breaks' },
        (payload) => {
          logger.info('social:realtime:breaks', { eventType: payload.eventType }, 'SOCIAL');
          queryClient.invalidateQueries({ queryKey: ['social-breaks'] });
          queryClient.invalidateQueries({ queryKey: ['social-breaks-past'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quiet_hours_settings' },
        (payload) => {
          logger.info('social:realtime:quiet-hours', { eventType: payload.eventType }, 'SOCIAL');
          queryClient.invalidateQueries({ queryKey: ['social-quiet-hours'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('social:realtime:breaks:subscribed', {}, 'SOCIAL');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options?.enabled, queryClient]);

  useEffect(() => {
    if (breaksQuery.data) {
      setBreaks(sortByDate(breaksQuery.data));
    }
  }, [breaksQuery.data]);

  useEffect(() => {
    if (quietHoursQuery.data) {
      setQuietHours(quietHoursQuery.data);
    }
  }, [quietHoursQuery.data]);

  const scheduleMutation = useMutation({
    mutationFn: scheduleBreakRequest,
    onSuccess: (plan) => {
      setBreaks((prev) => sortByDate([plan, ...prev.filter((existing) => existing.id !== plan.id)]));
      toast({
        title: 'Pause planifiée',
        description: 'Un rappel sera envoyé 10 minutes avant si vous avez opté pour le rappel.',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Planification impossible',
        description: 'Le créneau n’a pas pu être enregistré.',
        variant: 'destructive',
      });
      Sentry.captureException(error, {
        tags: { feature: 'social-cocon', mutation: 'schedule-break' },
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: cancelScheduledBreak,
    onSuccess: (_, breakId) => {
      setBreaks((prev) => prev.filter((plan) => plan.id !== breakId));
      toast({
        title: 'Pause annulée',
        description: 'Le créneau ne sera plus rappelé.',
        variant: 'info',
      });
    },
  });

  const scheduleBreak = useCallback(
    async (payload: ScheduleBreakPayload) => {
      const startsAt = new Date(payload.startsAtUtc);
      if (isWithinQuietHours(startsAt, quietHours)) {
        toast({
          title: 'En dehors des heures disponibles',
          description: 'Ce créneau chevauche les quiet hours définies par votre équipe.',
          variant: 'warning',
        });
        return null;
      }

      return scheduleMutation.mutateAsync(payload).catch((error: Error) => {
        logger.error('social:schedule_break_failed', { error: error.message }, 'SOCIAL');
        return null;
      });
    },
    [quietHours, scheduleMutation, toast]
  );

  const cancelBreak = useCallback(
    async (breakId: string) => {
      await cancelMutation.mutateAsync(breakId);
    },
    [cancelMutation]
  );

  return useMemo(
    () => ({
      quietHours,
      upcomingBreaks: breaks,
      isLoading: breaksQuery.isLoading,
      quietHoursLoading: quietHoursQuery.isLoading,
      scheduleBreak,
      cancelBreak,
      isScheduling: scheduleMutation.isPending,
    }),
    [
      quietHours,
      breaks,
      breaksQuery.isLoading,
      quietHoursQuery.isLoading,
      scheduleBreak,
      cancelBreak,
      scheduleMutation.isPending,
    ]
  );
};

export default useSocialBreakPlanner;
