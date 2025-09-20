import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { useToast } from '@/hooks/use-toast';
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
  const [breaks, setBreaks] = useState<SocialBreakPlan[]>([]);
  const [quietHours, setQuietHours] = useState<QuietHoursSettings | null>(null);

  const breaksQuery = useQuery({
    queryKey: ['social-breaks'],
    queryFn: fetchUpcomingBreaks,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 30,
    refetchInterval: options?.enabled === false ? false : 1000 * 60 * 5,
  });

  const quietHoursQuery = useQuery({
    queryKey: ['social-quiet-hours'],
    queryFn: fetchQuietHours,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 60,
  });

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

      return scheduleMutation.mutateAsync(payload).catch(() => null);
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
