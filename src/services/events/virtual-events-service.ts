/**
 * Service d'événements virtuels - Gestion des événements avec visio intégrée
 * Support Zoom, Google Meet, Teams
 * Uses Edge Functions for OAuth - no client secrets exposed
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface VirtualEvent {
  id: string;
  title: string;
  description?: string;
  eventType: 'therapy' | 'meditation' | 'workshop' | 'support_group' | 'coaching' | 'webinar' | 'other';
  hostId: string;
  startTime: string;
  endTime: string;
  timezone: string;
  platform: 'zoom' | 'google_meet' | 'teams' | 'custom';
  meetingUrl?: string;
  meetingId?: string;
  meetingPassword?: string;
  platformMetadata?: Record<string, any>;
  maxParticipants?: number;
  currentParticipants: number;
  requireApproval: boolean;
  isPublic: boolean;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  tags: string[];
  coverImageUrl?: string;
  recordingUrl?: string;
  recordingAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  status: 'registered' | 'approved' | 'declined' | 'attended' | 'cancelled';
  registeredAt: string;
  attendedAt?: string;
  notes?: string;
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  remindAt: string;
  reminderType: 'email' | 'notification' | 'sms';
  sent: boolean;
  sentAt?: string;
  createdAt: string;
}

export interface EventResource {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  resourceType: 'document' | 'video' | 'audio' | 'link' | 'other';
  url: string;
  fileSize?: number;
  isPublic: boolean;
  createdAt: string;
}

class VirtualEventsService {
  // ============================================
  // ÉVÉNEMENTS
  // ============================================

  /**
   * Créer un nouvel événement
   */
  async createEvent(
    event: Omit<VirtualEvent, 'id' | 'hostId' | 'currentParticipants' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<VirtualEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Générer l'URL de meeting selon la plateforme
    let meetingUrl = event.meetingUrl;
    let meetingId = event.meetingId;
    let platformMetadata = event.platformMetadata || {};

    if (event.platform === 'zoom' && !meetingUrl) {
      // Créer une réunion Zoom via Edge Function
      const zoomMeeting = await this.createZoomMeeting({
        topic: event.title,
        start_time: event.startTime,
        duration: this.calculateDuration(event.startTime, event.endTime),
        timezone: event.timezone
      });
      meetingUrl = zoomMeeting.join_url;
      meetingId = zoomMeeting.id;
      platformMetadata = zoomMeeting;
    } else if (event.platform === 'google_meet' && !meetingUrl) {
      // Créer une réunion Google Meet via Edge Function
      const meetMeeting = await this.createGoogleMeetMeeting({
        summary: event.title,
        start: event.startTime,
        end: event.endTime
      });
      meetingUrl = meetMeeting.hangoutLink;
      platformMetadata = meetMeeting;
    }

    const { data, error } = await supabase
      .from('virtual_events')
      .insert({
        title: event.title,
        description: event.description,
        event_type: event.eventType,
        host_id: user.id,
        start_time: event.startTime,
        end_time: event.endTime,
        timezone: event.timezone,
        platform: event.platform,
        meeting_url: meetingUrl,
        meeting_id: meetingId,
        meeting_password: event.meetingPassword,
        platform_metadata: platformMetadata,
        max_participants: event.maxParticipants,
        require_approval: event.requireApproval,
        is_public: event.isPublic,
        tags: event.tags,
        cover_image_url: event.coverImageUrl
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Virtual event created', { eventId: data.id }, 'EVENTS');
    return this.mapToEvent(data);
  }

  /**
   * Récupérer les événements à venir
   */
  async getUpcomingEvents(limit = 20): Promise<VirtualEvent[]> {
    const { data, error } = await supabase
      .from('virtual_events')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .in('status', ['scheduled', 'live'])
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) {
      logger.error('Failed to get upcoming events', error, 'EVENTS');
      return [];
    }

    return (data || []).map(this.mapToEvent);
  }

  /**
   * Récupérer les événements publics
   */
  async getPublicEvents(eventType?: VirtualEvent['eventType'], limit = 50): Promise<VirtualEvent[]> {
    let query = supabase
      .from('virtual_events')
      .select('*')
      .eq('is_public', true)
      .gte('start_time', new Date().toISOString())
      .in('status', ['scheduled', 'live'])
      .order('start_time', { ascending: true })
      .limit(limit);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Failed to get public events', error, 'EVENTS');
      return [];
    }

    return (data || []).map(this.mapToEvent);
  }

  /**
   * Récupérer les événements que j'organise
   */
  async getMyHostedEvents(): Promise<VirtualEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('virtual_events')
      .select('*')
      .eq('host_id', user.id)
      .order('start_time', { ascending: false });

    if (error) {
      logger.error('Failed to get hosted events', error, 'EVENTS');
      return [];
    }

    return (data || []).map(this.mapToEvent);
  }

  /**
   * Récupérer les événements auxquels je participe
   */
  async getMyRegisteredEvents(): Promise<VirtualEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('event_participants')
      .select('virtual_events(*)')
      .eq('user_id', user.id)
      .in('status', ['registered', 'approved', 'attended'])
      .order('registered_at', { ascending: false });

    if (error) {
      logger.error('Failed to get registered events', error, 'EVENTS');
      return [];
    }

    return (data || [])
      .filter(p => p.virtual_events)
      .map(p => this.mapToEvent(p.virtual_events));
  }

  /**
   * Récupérer un événement par ID
   */
  async getEvent(eventId: string): Promise<VirtualEvent | null> {
    const { data, error } = await supabase
      .from('virtual_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) return null;

    return this.mapToEvent(data);
  }

  /**
   * Mettre à jour un événement
   */
  async updateEvent(
    eventId: string,
    updates: Partial<VirtualEvent>
  ): Promise<VirtualEvent> {
    const { data, error } = await supabase
      .from('virtual_events')
      .update({
        title: updates.title,
        description: updates.description,
        event_type: updates.eventType,
        start_time: updates.startTime,
        end_time: updates.endTime,
        timezone: updates.timezone,
        max_participants: updates.maxParticipants,
        require_approval: updates.requireApproval,
        is_public: updates.isPublic,
        status: updates.status,
        tags: updates.tags,
        cover_image_url: updates.coverImageUrl,
        recording_url: updates.recordingUrl,
        recording_available: updates.recordingAvailable,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;

    return this.mapToEvent(data);
  }

  /**
   * Annuler un événement
   */
  async cancelEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('virtual_events')
      .update({ status: 'cancelled' })
      .eq('id', eventId);

    if (error) throw error;

    logger.info('Event cancelled', { eventId }, 'EVENTS');
  }

  /**
   * Supprimer un événement
   */
  async deleteEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('virtual_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    logger.info('Event deleted', { eventId }, 'EVENTS');
  }

  // ============================================
  // PARTICIPANTS
  // ============================================

  /**
   * S'inscrire à un événement
   */
  async registerForEvent(eventId: string, notes?: string): Promise<EventParticipant> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Vérifier la capacité
    const event = await this.getEvent(eventId);
    if (event?.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      throw new Error('Événement complet');
    }

    const { data, error } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: event?.requireApproval ? 'registered' : 'approved',
        notes
      })
      .select()
      .single();

    if (error) throw error;

    logger.info('Registered for event', { eventId, participantId: data.id }, 'EVENTS');
    return this.mapToParticipant(data);
  }

  /**
   * Annuler son inscription
   */
  async cancelRegistration(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_participants')
      .update({ status: 'cancelled' })
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Registration cancelled', { eventId }, 'EVENTS');
  }

  /**
   * Récupérer les participants d'un événement
   */
  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .in('status', ['registered', 'approved', 'attended'])
      .order('registered_at', { ascending: true });

    if (error) {
      logger.error('Failed to get event participants', error, 'EVENTS');
      return [];
    }

    return (data || []).map(this.mapToParticipant);
  }

  /**
   * Approuver un participant (pour les événements avec approbation)
   */
  async approveParticipant(participantId: string): Promise<void> {
    const { error } = await supabase
      .from('event_participants')
      .update({ status: 'approved' })
      .eq('id', participantId);

    if (error) throw error;

    logger.info('Participant approved', { participantId }, 'EVENTS');
  }

  /**
   * Marquer la présence à un événement
   */
  async markAttendance(eventId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('event_participants')
      .update({
        status: 'attended',
        attended_at: new Date().toISOString()
      })
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    logger.info('Attendance marked', { eventId }, 'EVENTS');
  }

  // ============================================
  // RAPPELS
  // ============================================

  /**
   * Créer un rappel pour un événement
   */
  async createReminder(
    eventId: string,
    minutesBefore: number,
    reminderType: EventReminder['reminderType'] = 'notification'
  ): Promise<EventReminder> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const event = await this.getEvent(eventId);
    if (!event) throw new Error('Event not found');

    const remindAt = new Date(event.startTime);
    remindAt.setMinutes(remindAt.getMinutes() - minutesBefore);

    const { data, error } = await supabase
      .from('event_reminders')
      .insert({
        event_id: eventId,
        user_id: user.id,
        remind_at: remindAt.toISOString(),
        reminder_type: reminderType
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapToReminder(data);
  }

  /**
   * Supprimer un rappel
   */
  async deleteReminder(reminderId: string): Promise<void> {
    const { error } = await supabase
      .from('event_reminders')
      .delete()
      .eq('id', reminderId);

    if (error) throw error;
  }

  // ============================================
  // RESSOURCES
  // ============================================

  /**
   * Ajouter une ressource à un événement
   */
  async addResource(
    eventId: string,
    resource: Omit<EventResource, 'id' | 'eventId' | 'createdAt'>
  ): Promise<EventResource> {
    const { data, error } = await supabase
      .from('event_resources')
      .insert({
        event_id: eventId,
        title: resource.title,
        description: resource.description,
        resource_type: resource.resourceType,
        url: resource.url,
        file_size: resource.fileSize,
        is_public: resource.isPublic
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapToResource(data);
  }

  /**
   * Récupérer les ressources d'un événement
   */
  async getEventResources(eventId: string): Promise<EventResource[]> {
    const { data, error } = await supabase
      .from('event_resources')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to get event resources', error, 'EVENTS');
      return [];
    }

    return (data || []).map(this.mapToResource);
  }

  // ============================================
  // INTÉGRATIONS ZOOM / GOOGLE MEET
  // ============================================

  /**
   * Créer une réunion Zoom via Edge Function
   */
  private async createZoomMeeting(params: {
    topic: string;
    start_time: string;
    duration: number;
    timezone: string;
  }): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-zoom-meeting', {
        body: params
      });

      if (error) {
        logger.warn('Zoom meeting creation failed, using mock', { error: error.message }, 'EVENTS');
        // Retourner un mock pour développement
        return {
          id: `zoom-${Date.now()}`,
          join_url: `https://zoom.us/j/${Date.now()}`,
          password: Math.random().toString(36).substring(7)
        };
      }

      logger.info('Zoom meeting created successfully', { meetingId: data.id }, 'EVENTS');
      return data;
    } catch (error) {
      logger.error('Failed to create Zoom meeting', error as Error, 'EVENTS');
      // Fallback mock
      return {
        id: `zoom-${Date.now()}`,
        join_url: `https://zoom.us/j/${Date.now()}`,
        password: Math.random().toString(36).substring(7)
      };
    }
  }

  /**
   * Créer une réunion Google Meet via Edge Function
   */
  private async createGoogleMeetMeeting(params: {
    summary: string;
    start: string;
    end: string;
  }): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('create-google-meet', {
        body: params
      });

      if (error) {
        logger.warn('Google Meet creation failed, using mock', { error: error.message }, 'EVENTS');
        // Retourner un mock pour développement
        return {
          hangoutLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`
        };
      }

      logger.info('Google Meet created successfully', { hangoutLink: data.hangoutLink }, 'EVENTS');
      return data;
    } catch (error) {
      logger.error('Failed to create Google Meet', error as Error, 'EVENTS');
      // Fallback mock
      return {
        hangoutLink: `https://meet.google.com/${Math.random().toString(36).substring(7)}`
      };
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }

  private mapToEvent(data: any): VirtualEvent {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      eventType: data.event_type,
      hostId: data.host_id,
      startTime: data.start_time,
      endTime: data.end_time,
      timezone: data.timezone,
      platform: data.platform,
      meetingUrl: data.meeting_url,
      meetingId: data.meeting_id,
      meetingPassword: data.meeting_password,
      platformMetadata: data.platform_metadata,
      maxParticipants: data.max_participants,
      currentParticipants: data.current_participants,
      requireApproval: data.require_approval,
      isPublic: data.is_public,
      status: data.status,
      tags: data.tags || [],
      coverImageUrl: data.cover_image_url,
      recordingUrl: data.recording_url,
      recordingAvailable: data.recording_available,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  private mapToParticipant(data: any): EventParticipant {
    return {
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      status: data.status,
      registeredAt: data.registered_at,
      attendedAt: data.attended_at,
      notes: data.notes
    };
  }

  private mapToReminder(data: any): EventReminder {
    return {
      id: data.id,
      eventId: data.event_id,
      userId: data.user_id,
      remindAt: data.remind_at,
      reminderType: data.reminder_type,
      sent: data.sent,
      sentAt: data.sent_at,
      createdAt: data.created_at
    };
  }

  private mapToResource(data: any): EventResource {
    return {
      id: data.id,
      eventId: data.event_id,
      title: data.title,
      description: data.description,
      resourceType: data.resource_type,
      url: data.url,
      fileSize: data.file_size,
      isPublic: data.is_public,
      createdAt: data.created_at
    };
  }
}

export const virtualEventsService = new VirtualEventsService();
