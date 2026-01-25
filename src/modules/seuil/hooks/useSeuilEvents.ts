/**
 * Hook pour la gestion des événements SEUIL
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { SeuilEvent, CreateSeuilEventInput, SeuilZone, SeuilActionType } from '../types';

export function useSeuilEvents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seuil-events', user?.id],
    queryFn: async (): Promise<SeuilEvent[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('seuil_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map(e => ({
        id: e.id,
        userId: e.user_id,
        thresholdLevel: e.threshold_level,
        zone: e.zone as SeuilZone,
        actionTaken: e.action_taken || undefined,
        actionType: e.action_type as SeuilActionType | undefined,
        sessionCompleted: e.session_completed || false,
        notes: e.notes || undefined,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }));
    },
    enabled: !!user?.id,
  });
}

export function useCreateSeuilEvent() {
  const { user } = useAuth();
  const {  } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSeuilEventInput) => {
      if (!user?.id) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('seuil_events')
        .insert({
          user_id: user.id,
          threshold_level: input.thresholdLevel,
          zone: input.zone,
          action_type: input.actionType,
          action_taken: input.actionTaken,
          notes: input.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seuil-events'] });
    },
    onError: (error) => {
      console.error('Error creating seuil event:', error);
    },
  });
}

export function useCompleteSeuilSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, actionType, notes }: { 
      eventId: string; 
      actionType?: SeuilActionType;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('seuil_events')
        .update({
          session_completed: true,
          action_type: actionType,
          notes,
        })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seuil-events'] });
    },
  });
}

export function useTodaySeuilEvents() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seuil-events-today', user?.id],
    queryFn: async (): Promise<SeuilEvent[]> => {
      if (!user?.id) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('seuil_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(e => ({
        id: e.id,
        userId: e.user_id,
        thresholdLevel: e.threshold_level,
        zone: e.zone as SeuilZone,
        actionTaken: e.action_taken || undefined,
        actionType: e.action_type as SeuilActionType | undefined,
        sessionCompleted: e.session_completed || false,
        notes: e.notes || undefined,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      }));
    },
    enabled: !!user?.id,
  });
}
