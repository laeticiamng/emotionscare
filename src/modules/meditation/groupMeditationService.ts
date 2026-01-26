/**
 * Group Meditation Service - Sessions collaboratives synchronisées
 * Mode groupe pour méditation avec synchronisation temps réel
 */

import { supabase } from '@/integrations/supabase/client';
import type { MeditationTechnique } from './types';

// ============================================================================
// TYPES
// ============================================================================

export interface GroupSession {
  id: string;
  host_id: string;
  host_name: string;
  title: string;
  technique: MeditationTechnique;
  duration_minutes: number;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  max_participants: number;
  is_public: boolean;
  join_code?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface GroupParticipant {
  id: string;
  session_id: string;
  user_id: string;
  user_name: string;
  joined_at: string;
  left_at?: string;
  mood_before?: number;
  mood_after?: number;
  is_host: boolean;
}

export interface GroupSessionState {
  currentPhase: 'waiting' | 'breathing' | 'meditation' | 'closing';
  elapsedSeconds: number;
  totalSeconds: number;
  participantCount: number;
  hostHeartbeat?: number;
  syncTimestamp: string;
}

export interface CreateGroupSessionParams {
  title: string;
  technique: MeditationTechnique;
  durationMinutes: number;
  scheduledAt: Date;
  maxParticipants?: number;
  isPublic?: boolean;
}

export interface JoinGroupSessionParams {
  sessionId?: string;
  joinCode?: string;
  userName?: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export class GroupMeditationService {
  private static realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

  /**
   * Créer une session de groupe
   */
  static async createSession(params: CreateGroupSessionParams): Promise<GroupSession> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Récupérer le nom d'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    const hostName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Hôte'
      : 'Hôte';

    // Générer un code de participation unique
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data, error } = await supabase
      .from('group_meditation_sessions')
      .insert({
        host_id: user.id,
        host_name: hostName,
        title: params.title,
        technique: params.technique,
        duration_minutes: params.durationMinutes,
        scheduled_at: params.scheduledAt.toISOString(),
        max_participants: params.maxParticipants || 20,
        is_public: params.isPublic ?? false,
        join_code: joinCode,
        status: 'scheduled'
      })
      .select()
      .single();

    if (error) throw error;

    // Ajouter l'hôte comme participant
    await this.joinAsHost(data.id, user.id, hostName);

    return data;
  }

  /**
   * Rejoindre une session comme hôte
   */
  private static async joinAsHost(sessionId: string, userId: string, userName: string): Promise<void> {
    await supabase
      .from('group_meditation_participants')
      .insert({
        session_id: sessionId,
        user_id: userId,
        user_name: userName,
        is_host: true
      });
  }

  /**
   * Rejoindre une session existante
   */
  static async joinSession(params: JoinGroupSessionParams): Promise<{
    session: GroupSession;
    participant: GroupParticipant;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Trouver la session par ID ou code
    let query = supabase.from('group_meditation_sessions').select('*');
    
    if (params.sessionId) {
      query = query.eq('id', params.sessionId);
    } else if (params.joinCode) {
      query = query.eq('join_code', params.joinCode.toUpperCase());
    } else {
      throw new Error('ID ou code de session requis');
    }

    const { data: session, error: sessionError } = await query.single();
    if (sessionError || !session) throw new Error('Session non trouvée');

    // Vérifier si la session accepte encore des participants
    const { count } = await supabase
      .from('group_meditation_participants')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .is('left_at', null);

    if ((count || 0) >= session.max_participants) {
      throw new Error('Session complète');
    }

    if (session.status === 'completed' || session.status === 'cancelled') {
      throw new Error('Session terminée');
    }

    // Récupérer le nom d'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    const userName = params.userName || 
      (profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '') || 
      'Participant';

    // Rejoindre la session
    const { data: participant, error: participantError } = await supabase
      .from('group_meditation_participants')
      .insert({
        session_id: session.id,
        user_id: user.id,
        user_name: userName,
        is_host: false
      })
      .select()
      .single();

    if (participantError) throw participantError;

    return { session, participant };
  }

  /**
   * Démarrer une session (hôte uniquement)
   */
  static async startSession(sessionId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    // Vérifier que l'utilisateur est l'hôte
    const { data: session } = await supabase
      .from('group_meditation_sessions')
      .select('host_id')
      .eq('id', sessionId)
      .single();

    if (session?.host_id !== user.id) {
      throw new Error('Seul l\'hôte peut démarrer la session');
    }

    await supabase
      .from('group_meditation_sessions')
      .update({
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Notifier tous les participants via le canal temps réel
    await supabase.channel(`group-meditation:${sessionId}`).send({
      type: 'broadcast',
      event: 'session_started',
      payload: { startedAt: new Date().toISOString() }
    });
  }

  /**
   * Terminer une session
   */
  static async completeSession(sessionId: string): Promise<void> {
    await supabase
      .from('group_meditation_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    await supabase.channel(`group-meditation:${sessionId}`).send({
      type: 'broadcast',
      event: 'session_completed',
      payload: { completedAt: new Date().toISOString() }
    });
  }

  /**
   * Enregistrer l'humeur d'un participant
   */
  static async recordMood(
    participantId: string,
    moodType: 'before' | 'after',
    value: number
  ): Promise<void> {
    const updateData = moodType === 'before' 
      ? { mood_before: value }
      : { mood_after: value };

    await supabase
      .from('group_meditation_participants')
      .update(updateData)
      .eq('id', participantId);
  }

  /**
   * Quitter une session
   */
  static async leaveSession(sessionId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('group_meditation_participants')
      .update({ left_at: new Date().toISOString() })
      .eq('session_id', sessionId)
      .eq('user_id', user.id);
  }

  /**
   * Obtenir les participants actuels
   */
  static async getParticipants(sessionId: string): Promise<GroupParticipant[]> {
    const { data, error } = await supabase
      .from('group_meditation_participants')
      .select('*')
      .eq('session_id', sessionId)
      .is('left_at', null)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer les sessions publiques disponibles
   */
  static async getPublicSessions(): Promise<GroupSession[]> {
    const { data, error } = await supabase
      .from('group_meditation_sessions')
      .select('*')
      .eq('is_public', true)
      .in('status', ['scheduled', 'in_progress'])
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  /**
   * Souscrire aux mises à jour temps réel d'une session
   */
  static subscribeToSession(
    sessionId: string,
    callbacks: {
      onStateChange?: (state: GroupSessionState) => void;
      onParticipantJoin?: (participant: GroupParticipant) => void;
      onParticipantLeave?: (userId: string) => void;
      onSessionStart?: () => void;
      onSessionComplete?: () => void;
    }
  ): () => void {
    const channel = supabase.channel(`group-meditation:${sessionId}`);

    channel
      .on('broadcast', { event: 'state_update' }, ({ payload }) => {
        callbacks.onStateChange?.(payload as GroupSessionState);
      })
      .on('broadcast', { event: 'participant_joined' }, ({ payload }) => {
        callbacks.onParticipantJoin?.(payload as GroupParticipant);
      })
      .on('broadcast', { event: 'participant_left' }, ({ payload }) => {
        callbacks.onParticipantLeave?.(payload.userId);
      })
      .on('broadcast', { event: 'session_started' }, () => {
        callbacks.onSessionStart?.();
      })
      .on('broadcast', { event: 'session_completed' }, () => {
        callbacks.onSessionComplete?.();
      })
      .subscribe();

    this.realtimeChannel = channel;

    return () => {
      channel.unsubscribe();
      this.realtimeChannel = null;
    };
  }

  /**
   * Synchroniser l'état de la session (hôte)
   */
  static async syncSessionState(
    sessionId: string,
    state: GroupSessionState
  ): Promise<void> {
    await supabase.channel(`group-meditation:${sessionId}`).send({
      type: 'broadcast',
      event: 'state_update',
      payload: {
        ...state,
        syncTimestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Obtenir les statistiques des sessions de groupe
   */
  static async getGroupStats(userId: string): Promise<{
    sessionsHosted: number;
    sessionsJoined: number;
    totalParticipants: number;
    avgMoodImprovement: number;
  }> {
    // Sessions hébergées
    const { count: hostedCount } = await supabase
      .from('group_meditation_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('host_id', userId)
      .eq('status', 'completed');

    // Sessions rejointes
    const { count: joinedCount } = await supabase
      .from('group_meditation_participants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_host', false);

    // Total participants dans les sessions hébergées
    const { data: hostedSessions } = await supabase
      .from('group_meditation_sessions')
      .select('id')
      .eq('host_id', userId);

    let totalParticipants = 0;
    if (hostedSessions?.length) {
      const { count } = await supabase
        .from('group_meditation_participants')
        .select('*', { count: 'exact', head: true })
        .in('session_id', hostedSessions.map(s => s.id))
        .eq('is_host', false);
      totalParticipants = count || 0;
    }

    // Amélioration d'humeur moyenne
    const { data: participations } = await supabase
      .from('group_meditation_participants')
      .select('mood_before, mood_after')
      .eq('user_id', userId)
      .not('mood_before', 'is', null)
      .not('mood_after', 'is', null);

    const moodImprovements = (participations || [])
      .map(p => (p.mood_after || 0) - (p.mood_before || 0))
      .filter(d => d !== 0);
    
    const avgMoodImprovement = moodImprovements.length > 0
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length
      : 0;

    return {
      sessionsHosted: hostedCount || 0,
      sessionsJoined: joinedCount || 0,
      totalParticipants,
      avgMoodImprovement
    };
  }
}

export const groupMeditationService = GroupMeditationService;
