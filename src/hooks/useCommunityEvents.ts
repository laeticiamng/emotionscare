/**
 * useCommunityEvents - Événements virtuels communautaires
 * Permet de créer et participer à des événements de groupe
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'meditation' | 'breathing' | 'discussion' | 'workshop' | 'other';
  host_id: string;
  host_name: string;
  host_avatar?: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  is_private: boolean;
  meeting_url?: string;
  tags: string[];
  created_at: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rsvp_status: 'going' | 'maybe' | 'not_going';
  joined_at: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  event_type: CommunityEvent['event_type'];
  start_time: string;
  duration_minutes: number;
  max_participants?: number;
  is_private?: boolean;
  tags?: string[];
}

export const useCommunityEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [myEvents, setMyEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les événements
  const loadEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .gte('end_time', new Date().toISOString())
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedEvents: CommunityEvent[] = (data || []).map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || '',
        event_type: e.event_type || 'other',
        host_id: e.host_id,
        host_name: e.host_name || 'Anonyme',
        host_avatar: e.host_avatar,
        start_time: e.start_time,
        end_time: e.end_time,
        max_participants: e.max_participants || 50,
        current_participants: e.current_participants || 0,
        is_private: e.is_private || false,
        meeting_url: e.meeting_url,
        tags: e.tags || [],
        created_at: e.created_at,
        status: determineEventStatus(e.start_time, e.end_time, e.cancelled),
      }));

      setEvents(formattedEvents);

      // Filtrer mes événements
      if (user?.id) {
        setMyEvents(formattedEvents.filter(e => e.host_id === user.id));
      }
    } catch (error) {
      logger.error('Failed to load community events', error as Error, 'COMMUNITY');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Déterminer le statut d'un événement
  const determineEventStatus = (startTime: string, endTime: string, cancelled?: boolean): CommunityEvent['status'] => {
    if (cancelled) return 'cancelled';
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'completed';
  };

  // Créer un événement
  const createEvent = useCallback(async (input: CreateEventInput): Promise<CommunityEvent | null> => {
    if (!user?.id) {
      toast.error('Connecte-toi pour créer un événement');
      return null;
    }

    try {
      const endTime = new Date(input.start_time);
      endTime.setMinutes(endTime.getMinutes() + input.duration_minutes);

      const { data, error } = await supabase
        .from('community_events')
        .insert({
          title: input.title,
          description: input.description,
          event_type: input.event_type,
          host_id: user.id,
          host_name: user.email?.split('@')[0] || 'Hôte',
          start_time: input.start_time,
          end_time: endTime.toISOString(),
          max_participants: input.max_participants || 50,
          is_private: input.is_private || false,
          tags: input.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Événement créé avec succès !');
      await loadEvents();
      
      return data as CommunityEvent;
    } catch (error) {
      logger.error('Failed to create community event', error as Error, 'COMMUNITY');
      toast.error('Erreur lors de la création de l\'événement');
      return null;
    }
  }, [user, loadEvents]);

  // Rejoindre un événement
  const joinEvent = useCallback(async (eventId: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Connecte-toi pour rejoindre un événement');
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_event_participants')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          rsvp_status: 'going',
        });

      if (error) throw error;

      toast.success('Tu participes à cet événement !');
      await loadEvents();
      return true;
    } catch (error) {
      logger.error('Failed to join community event', error as Error, 'COMMUNITY');
      toast.error('Erreur lors de l\'inscription');
      return false;
    }
  }, [user?.id, loadEvents]);

  // Quitter un événement
  const leaveEvent = useCallback(async (eventId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('community_event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Tu ne participes plus à cet événement');
      await loadEvents();
      return true;
    } catch (error) {
      logger.error('Failed to leave community event', error as Error, 'COMMUNITY');
      return false;
    }
  }, [user?.id, loadEvents]);

  // Annuler un événement (hôte seulement)
  const cancelEvent = useCallback(async (eventId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('community_events')
        .update({ cancelled: true })
        .eq('id', eventId)
        .eq('host_id', user.id);

      if (error) throw error;

      toast.success('Événement annulé');
      await loadEvents();
      return true;
    } catch (error) {
      logger.error('Failed to cancel community event', error as Error, 'COMMUNITY');
      return false;
    }
  }, [user?.id, loadEvents]);

  // Effet initial
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    myEvents,
    loading,
    createEvent,
    joinEvent,
    leaveEvent,
    cancelEvent,
    refresh: loadEvents,
  };
};
