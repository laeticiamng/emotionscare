// @ts-nocheck

import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { CoachEvent } from '@/types/coach/CoachEvent';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Utilisation de la nouvelle interface CoachEvent
export const useCoach = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [coachStatus, setCoachStatus] = useState<'active' | 'idle' | 'disabled'>('idle');

  // Fetch coach events from Supabase
  const {
    data: events = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['coach-events', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('coach_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('Error loading coach events', error as Error, 'UI');
        throw error;
      }

      return (data || []).map((item) => ({
        id: item.id,
        type: item.type || 'message',
        content: item.content || '',
        timestamp: item.created_at || item.timestamp,
        userId: item.user_id,
        metadata: item.metadata || {},
        read: item.read ?? false,
      })) as CoachEvent[];
    },
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutation to add a new event
  const addEventMutation = useMutation({
    mutationFn: async (event: Omit<CoachEvent, 'id' | 'timestamp' | 'userId'>) => {
      const { data, error } = await supabase
        .from('coach_events')
        .insert({
          user_id: userId,
          type: event.type,
          content: event.content,
          read: event.read ?? false,
          metadata: event.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coach-events', userId] });
    },
    onError: (error) => {
      logger.error('Error adding coach event', error as Error, 'UI');
    },
  });

  // Ajouter un nouvel événement
  const addEvent = useCallback(
    (event: Omit<CoachEvent, 'id' | 'timestamp' | 'userId'>) => {
      // Optimistically update local state via query cache
      const tempId = `temp-${Date.now()}`;
      const newEvent: CoachEvent = {
        id: tempId,
        timestamp: new Date().toISOString(),
        userId,
        ...event,
      };

      // Optimistic update
      queryClient.setQueryData(['coach-events', userId], (old: CoachEvent[] = []) => [
        newEvent,
        ...old,
      ]);

      // Persist to Supabase
      addEventMutation.mutate(event);

      // Afficher une notification pour certains types d'événements
      if (event.type === 'suggestion' || event.type === 'notification') {
        toast({
          title: 'Message du coach',
          description: event.content,
        });
      }

      return tempId;
    },
    [userId, toast, queryClient, addEventMutation]
  );

  // Mutation to mark event as read
  const markAsReadMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('coach_events')
        .update({ read: true })
        .eq('id', eventId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-events', userId] });
    },
  });

  // Démarrer une session
  const startSession = useCallback(() => {
    setCoachStatus('active');
    addEvent({
      type: 'message',
      content: 'Session démarrée. Je suis là pour vous accompagner !',
      read: false,
    });
  }, [addEvent]);

  // Terminer une session
  const endSession = useCallback(() => {
    setCoachStatus('idle');
  }, []);

  // Marquer un événement comme lu
  const markAsRead = useCallback(
    (eventId: string) => {
      // Optimistic update
      queryClient.setQueryData(['coach-events', userId], (old: CoachEvent[] = []) =>
        old.map((event) => (event.id === eventId ? { ...event, read: true } : event))
      );
      markAsReadMutation.mutate(eventId);
    },
    [queryClient, userId, markAsReadMutation]
  );

  return {
    events,
    isLoading,
    isError,
    error,
    coachStatus,
    addEvent,
    startSession,
    endSession,
    markAsRead,
    unreadCount: events.filter((e) => !e.read).length,
  };
};

export default useCoach;
