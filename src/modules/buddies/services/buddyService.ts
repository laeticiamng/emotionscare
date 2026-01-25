/**
 * Service pour le module buddies
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  BuddyProfile,
  BuddyMatch,
  BuddyMessage,
  BuddyActivity,
  BuddyRequest,
  BuddySession,
  BuddyStats,
  BuddyFilters
} from '../types';

export const BuddyService = {
  /**
   * Récupérer le profil buddy de l'utilisateur
   */
  async getMyProfile(userId: string): Promise<BuddyProfile | null> {
    const { data, error } = await supabase
      .from('buddy_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as BuddyProfile | null;
  },

  /**
   * Créer ou mettre à jour le profil buddy
   */
  async upsertProfile(userId: string, profile: Partial<BuddyProfile>): Promise<BuddyProfile> {
    const { data, error } = await supabase
      .from('buddy_profiles')
      .upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as BuddyProfile;
  },

  /**
   * Mettre à jour le statut de disponibilité
   */
  async updateAvailability(userId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('buddy_profiles')
      .update({ 
        availability_status: status,
        last_active_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Rechercher des buddies potentiels
   */
  async discoverBuddies(userId: string, filters: BuddyFilters = {}, limit = 20): Promise<BuddyProfile[]> {
    let query = supabase
      .from('buddy_profiles')
      .select('*')
      .neq('user_id', userId)
      .eq('is_visible', true)
      .order('last_active_at', { ascending: false })
      .limit(limit);

    if (filters.availability) {
      query = query.eq('availability_status', filters.availability);
    }
    if (filters.experienceLevel) {
      query = query.eq('experience_level', filters.experienceLevel);
    }
    if (filters.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as BuddyProfile[];
  },

  /**
   * Récupérer les matches acceptés
   */
  async getMatches(userId: string): Promise<BuddyMatch[]> {
    const { data, error } = await supabase
      .from('buddy_matches')
      .select('*')
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .eq('status', 'accepted')
      .order('last_interaction_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    // Récupérer les profils des buddies
    const matches = data || [];
    const buddyIds = matches.map(m => m.user_id_1 === userId ? m.user_id_2 : m.user_id_1);
    
    if (buddyIds.length === 0) return [];

    const { data: profiles } = await supabase
      .from('buddy_profiles')
      .select('*')
      .in('user_id', buddyIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    return matches.map(m => ({
      ...m,
      buddy_profile: profileMap.get(m.user_id_1 === userId ? m.user_id_2 : m.user_id_1)
    })) as BuddyMatch[];
  },

  /**
   * Envoyer une demande de buddy
   */
  async sendRequest(fromUserId: string, toUserId: string, message?: string): Promise<BuddyRequest> {
    const { data, error } = await supabase
      .from('buddy_requests')
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data as BuddyRequest;
  },

  /**
   * Récupérer les demandes reçues
   */
  async getReceivedRequests(userId: string): Promise<BuddyRequest[]> {
    const { data, error } = await supabase
      .from('buddy_requests')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Récupérer les profils
    const requests = data || [];
    const fromIds = requests.map(r => r.from_user_id);
    
    if (fromIds.length === 0) return [];

    const { data: profiles } = await supabase
      .from('buddy_profiles')
      .select('*')
      .in('user_id', fromIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));

    return requests.map(r => ({
      ...r,
      from_profile: profileMap.get(r.from_user_id)
    })) as BuddyRequest[];
  },

  /**
   * Répondre à une demande
   */
  async respondToRequest(requestId: string, accept: boolean, _userId: string): Promise<void> {
    const { data: request, error: fetchError } = await supabase
      .from('buddy_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;

    // Mettre à jour la demande
    const { error: updateError } = await supabase
      .from('buddy_requests')
      .update({
        status: accept ? 'accepted' : 'declined',
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Si accepté, créer le match
    if (accept) {
      const { error: matchError } = await supabase
        .from('buddy_matches')
        .insert({
          user_id_1: request.from_user_id,
          user_id_2: request.to_user_id,
          compatibility_score: request.compatibility_score || 70,
          status: 'accepted',
          initiated_by: request.from_user_id,
          matched_at: new Date().toISOString()
        });

      if (matchError && !matchError.message.includes('duplicate')) {
        throw matchError;
      }
    }
  },

  /**
   * Récupérer les messages d'un match
   */
  async getMessages(matchId: string, limit = 100): Promise<BuddyMessage[]> {
    const { data, error } = await supabase
      .from('buddy_messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []) as BuddyMessage[];
  },

  /**
   * Envoyer un message
   */
  async sendMessage(matchId: string, senderId: string, receiverId: string, content: string, type = 'text'): Promise<BuddyMessage> {
    const { data, error } = await supabase
      .from('buddy_messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        message_type: type
      })
      .select()
      .single();

    if (error) throw error;
    return data as BuddyMessage;
  },

  /**
   * Marquer les messages comme lus
   */
  async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('buddy_messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('match_id', matchId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Créer une activité partagée
   */
  async createActivity(matchId: string, createdBy: string, activity: Partial<BuddyActivity>): Promise<BuddyActivity> {
    const { data, error } = await supabase
      .from('buddy_activities')
      .insert({
        match_id: matchId,
        created_by: createdBy,
        title: activity.title,
        description: activity.description,
        activity_type: activity.activity_type,
        scheduled_at: activity.scheduled_at,
        duration_minutes: activity.duration_minutes || 30,
        status: 'planned'
      })
      .select()
      .single();

    if (error) throw error;
    return data as BuddyActivity;
  },

  /**
   * Récupérer les activités d'un match
   */
  async getActivities(matchId: string): Promise<BuddyActivity[]> {
    const { data, error } = await supabase
      .from('buddy_activities')
      .select('*')
      .eq('match_id', matchId)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return (data || []) as BuddyActivity[];
  },

  /**
   * Compléter une activité
   */
  async completeActivity(activityId: string, moodAfter?: Record<string, number>, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('buddy_activities')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        participants_mood_after: moodAfter,
        outcome_notes: notes
      })
      .eq('id', activityId);

    if (error) throw error;
  },

  /**
   * Récupérer les statistiques
   */
  async getStats(userId: string): Promise<BuddyStats | null> {
    const { data, error } = await supabase
      .from('buddy_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as BuddyStats | null;
  },

  /**
   * Compter les messages non lus
   */
  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('buddy_messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};
