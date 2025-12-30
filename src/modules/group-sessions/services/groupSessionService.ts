/**
 * Service pour les sessions de groupe
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  GroupSession, 
  GroupSessionParticipant, 
  GroupSessionMessage,
  GroupSessionCategory,
  GroupSessionResource,
  GroupSessionFilters,
  CreateSessionInput
} from '../types';

export const GroupSessionService = {
  /**
   * Récupérer toutes les sessions avec filtres
   */
  async getSessions(filters: GroupSessionFilters = {}): Promise<GroupSession[]> {
    let query = supabase
      .from('group_sessions')
      .select('*')
      .order('scheduled_at', { ascending: true });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters.startDate) {
      query = query.gte('scheduled_at', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('scheduled_at', filters.endDate);
    }
    if (filters.hostId) {
      query = query.eq('host_id', filters.hostId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as GroupSession[];
  },

  /**
   * Récupérer les sessions à venir
   */
  async getUpcomingSessions(limit = 10): Promise<GroupSession[]> {
    const { data, error } = await supabase
      .from('group_sessions')
      .select('*')
      .in('status', ['scheduled', 'live'])
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []) as GroupSession[];
  },

  /**
   * Récupérer les sessions en direct
   */
  async getLiveSessions(): Promise<GroupSession[]> {
    const { data, error } = await supabase
      .from('group_sessions')
      .select('*')
      .eq('status', 'live')
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return (data || []) as GroupSession[];
  },

  /**
   * Récupérer une session par ID
   */
  async getSession(sessionId: string): Promise<GroupSession | null> {
    const { data, error } = await supabase
      .from('group_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data as GroupSession;
  },

  /**
   * Créer une nouvelle session
   */
  async createSession(input: CreateSessionInput, hostId: string): Promise<GroupSession> {
    const { data, error } = await supabase
      .from('group_sessions')
      .insert({
        ...input,
        host_id: hostId,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;
    return data as GroupSession;
  },

  /**
   * Mettre à jour une session
   */
  async updateSession(sessionId: string, updates: Partial<GroupSession>): Promise<GroupSession> {
    const { data, error } = await supabase
      .from('group_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data as GroupSession;
  },

  /**
   * Supprimer une session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('group_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) throw error;
  },

  /**
   * S'inscrire à une session
   */
  async registerForSession(sessionId: string, userId: string): Promise<GroupSessionParticipant> {
    const { data, error } = await supabase
      .from('group_session_participants')
      .insert({
        session_id: sessionId,
        user_id: userId,
        status: 'registered',
        role: 'participant'
      })
      .select()
      .single();

    if (error) throw error;
    return data as GroupSessionParticipant;
  },

  /**
   * Se désinscrire d'une session
   */
  async unregisterFromSession(sessionId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_session_participants')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Rejoindre une session en direct
   */
  async joinSession(sessionId: string, userId: string, moodBefore?: number): Promise<void> {
    const { error } = await supabase
      .from('group_session_participants')
      .update({
        status: 'attended',
        joined_at: new Date().toISOString(),
        mood_before: moodBefore
      })
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Quitter une session
   */
  async leaveSession(sessionId: string, userId: string, moodAfter?: number, feedback?: string, rating?: number): Promise<void> {
    const { error } = await supabase
      .from('group_session_participants')
      .update({
        left_at: new Date().toISOString(),
        mood_after: moodAfter,
        feedback,
        rating
      })
      .eq('session_id', sessionId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Récupérer les participants d'une session
   */
  async getParticipants(sessionId: string): Promise<GroupSessionParticipant[]> {
    const { data, error } = await supabase
      .from('group_session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data || []) as GroupSessionParticipant[];
  },

  /**
   * Vérifier si l'utilisateur est inscrit
   */
  async isRegistered(sessionId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('group_session_participants')
      .select('id')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  /**
   * Récupérer les sessions de l'utilisateur
   */
  async getUserSessions(userId: string): Promise<GroupSession[]> {
    const { data: participations, error: pError } = await supabase
      .from('group_session_participants')
      .select('session_id')
      .eq('user_id', userId);

    if (pError) throw pError;
    
    const sessionIds = (participations || []).map(p => p.session_id);
    if (sessionIds.length === 0) return [];

    const { data, error } = await supabase
      .from('group_sessions')
      .select('*')
      .in('id', sessionIds)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return (data || []) as GroupSession[];
  },

  /**
   * Récupérer les catégories
   */
  async getCategories(): Promise<GroupSessionCategory[]> {
    const { data, error } = await supabase
      .from('group_session_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []) as GroupSessionCategory[];
  },

  /**
   * Envoyer un message
   */
  async sendMessage(sessionId: string, userId: string, content: string, replyToId?: string): Promise<GroupSessionMessage> {
    const { data, error } = await supabase
      .from('group_session_messages')
      .insert({
        session_id: sessionId,
        user_id: userId,
        content,
        message_type: 'text',
        reply_to_id: replyToId
      })
      .select()
      .single();

    if (error) throw error;
    return data as GroupSessionMessage;
  },

  /**
   * Récupérer les messages d'une session
   */
  async getMessages(sessionId: string, limit = 100): Promise<GroupSessionMessage[]> {
    const { data, error } = await supabase
      .from('group_session_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []) as GroupSessionMessage[];
  },

  /**
   * Ajouter une réaction
   */
  async addReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase
      .from('group_session_reactions')
      .insert({
        message_id: messageId,
        user_id: userId,
        emoji
      });

    if (error && !error.message.includes('duplicate')) throw error;
  },

  /**
   * Supprimer une réaction
   */
  async removeReaction(messageId: string, userId: string, emoji: string): Promise<void> {
    const { error } = await supabase
      .from('group_session_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('emoji', emoji);

    if (error) throw error;
  },

  /**
   * Récupérer les ressources d'une session
   */
  async getResources(sessionId: string): Promise<GroupSessionResource[]> {
    const { data, error } = await supabase
      .from('group_session_resources')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as GroupSessionResource[];
  },

  /**
   * Ajouter une ressource
   */
  async addResource(sessionId: string, userId: string, resource: Partial<GroupSessionResource>): Promise<GroupSessionResource> {
    const { data, error } = await supabase
      .from('group_session_resources')
      .insert({
        session_id: sessionId,
        uploaded_by: userId,
        title: resource.title,
        resource_type: resource.resource_type,
        url: resource.url,
        description: resource.description
      })
      .select()
      .single();

    if (error) throw error;
    return data as GroupSessionResource;
  },

  /**
   * Statistiques utilisateur
   */
  async getUserStats(userId: string): Promise<{
    totalSessions: number;
    hostedSessions: number;
    totalMinutes: number;
    averageMoodImprovement: number;
    xpEarned: number;
  }> {
    const [participations, hosted] = await Promise.all([
      supabase
        .from('group_session_participants')
        .select('*, group_sessions(duration_minutes)')
        .eq('user_id', userId)
        .eq('status', 'attended'),
      supabase
        .from('group_sessions')
        .select('id')
        .eq('host_id', userId)
    ]);

    const totalSessions = participations.data?.length || 0;
    const hostedSessions = hosted.data?.length || 0;
    
    let totalMinutes = 0;
    let moodImprovements: number[] = [];
    let totalXp = 0;

    (participations.data || []).forEach((p: any) => {
      totalMinutes += p.group_sessions?.duration_minutes || 0;
      if (p.mood_before && p.mood_after) {
        moodImprovements.push(p.mood_after - p.mood_before);
      }
      totalXp += p.xp_earned || 0;
    });

    const averageMoodImprovement = moodImprovements.length > 0 
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length 
      : 0;

    return {
      totalSessions,
      hostedSessions,
      totalMinutes,
      averageMoodImprovement: Math.round(averageMoodImprovement * 10) / 10,
      xpEarned: totalXp
    };
  }
};
