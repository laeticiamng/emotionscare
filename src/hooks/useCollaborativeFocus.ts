// @ts-nocheck
/**
 * useCollaborativeFocus - Sessions Focus Flow collaboratives en temps réel
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface TeamSession {
  id: string;
  team_name: string;
  creator_id: string;
  mode: 'work' | 'study' | 'meditation';
  duration_minutes: number;
  current_phase: 'waiting' | 'active' | 'break' | 'completed';
  phase_started_at: string | null;
  participant_count: number;
  playlist_id: string | null;
}

interface Participant {
  id: string;
  user_id: string;
  is_active: boolean;
  pomodoros_completed: number;
}

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export const useCollaborativeFocus = () => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<TeamSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  /**
   * Créer une session d'équipe
   */
  const createTeamSession = useCallback(
    async (teamName: string, mode: 'work' | 'study' | 'meditation', durationMinutes: number = 120) => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('focus_team_sessions')
          .insert({
            team_name: teamName,
            creator_id: user.id,
            mode,
            duration_minutes: durationMinutes,
            current_phase: 'waiting',
          })
          .select()
          .single();

        if (error) throw error;

        // Rejoindre automatiquement la session créée
        await joinTeamSession(data.id);

        toast.success(`Session "${teamName}" créée !`);
        logger.info('✅ Team session created', { sessionId: data.id }, 'COLLAB');

        return data;
      } catch (error) {
        logger.error('❌ Failed to create team session', error as Error, 'COLLAB');
        toast.error('Erreur lors de la création');
        return null;
      }
    },
    [user]
  );

  /**
   * Rejoindre une session d'équipe
   */
  const joinTeamSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        const { error } = await supabase.from('team_session_participants').insert({
          session_id: sessionId,
          user_id: user.id,
          is_active: true,
        });

        if (error && error.code !== '23505') throw error; // Ignore duplicate

        // Incrémenter le compteur de participants
        await supabase.rpc('increment_participant_count', { session_id: sessionId });

        toast.success('Vous avez rejoint la session !');
        logger.info('✅ Joined team session', { sessionId }, 'COLLAB');
      } catch (error) {
        logger.error('❌ Failed to join session', error as Error, 'COLLAB');
        toast.error('Erreur lors de la connexion');
      }
    },
    [user]
  );

  /**
   * Quitter une session
   */
  const leaveTeamSession = useCallback(
    async (sessionId: string) => {
      if (!user) return;

      try {
        await supabase
          .from('team_session_participants')
          .update({ is_active: false })
          .eq('session_id', sessionId)
          .eq('user_id', user.id);

        await supabase.rpc('decrement_participant_count', { session_id: sessionId });

        setActiveSession(null);
        toast.info('Vous avez quitté la session');
        logger.info('👋 Left team session', { sessionId }, 'COLLAB');
      } catch (error) {
        logger.error('❌ Failed to leave session', error as Error, 'COLLAB');
      }
    },
    [user]
  );

  /**
   * Démarrer la phase de travail
   */
  const startWorkPhase = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('focus_team_sessions')
        .update({
          current_phase: 'active',
          phase_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      toast.success('🚀 Session démarrée !');
      logger.info('▶️ Work phase started', { sessionId }, 'COLLAB');
    } catch (error) {
      logger.error('❌ Failed to start work phase', error as Error, 'COLLAB');
    }
  }, []);

  /**
   * Démarrer la pause
   */
  const startBreakPhase = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('focus_team_sessions')
        .update({
          current_phase: 'break',
          phase_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      toast.info('☕ Pause de 5 minutes !');
      logger.info('⏸️ Break phase started', { sessionId }, 'COLLAB');

      // Notification push pour tous les participants
      await notifyAllParticipants(sessionId, 'Pause Pomodoro !', '5 minutes de repos bien méritées 🎉');
    } catch (error) {
      logger.error('❌ Failed to start break', error as Error, 'COLLAB');
    }
  }, []);

  /**
   * Envoyer un message dans le chat
   */
  const sendChatMessage = useCallback(
    async (sessionId: string, message: string) => {
      if (!user || !message.trim()) return;

      try {
        await supabase.from('team_session_chat').insert({
          session_id: sessionId,
          user_id: user.id,
          message: message.trim(),
        });

        logger.info('💬 Chat message sent', { sessionId }, 'COLLAB');
      } catch (error) {
        logger.error('❌ Failed to send message', error as Error, 'COLLAB');
        toast.error('Erreur lors de l\'envoi du message');
      }
    },
    [user]
  );

  /**
   * Charger le leaderboard
   */
  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('focus_leaderboard')
        .select('*')
        .order('total_pomodoros', { ascending: false })
        .limit(10);

      if (error) throw error;

      setLeaderboard(data || []);
    } catch (error) {
      logger.error('❌ Failed to load leaderboard', error as Error, 'COLLAB');
    }
  }, []);

  /**
   * Notifier tous les participants
   */
  const notifyAllParticipants = async (sessionId: string, title: string, body: string) => {
    try {
      // Récupérer tous les participants actifs
      const { data: participants } = await supabase
        .from('team_session_participants')
        .select('user_id')
        .eq('session_id', sessionId)
        .eq('is_active', true);

      if (!participants?.length) return;

      // Envoyer notifications push via Edge Function
      await supabase.functions.invoke('send-push-notification', {
        body: {
          userIds: participants.map((p) => p.user_id),
          title,
          body,
        },
      });
    } catch (error) {
      logger.error('❌ Failed to notify participants', error as Error, 'COLLAB');
    }
  };

  /**
   * Initialiser la synchronisation temps réel
   */
  useEffect(() => {
    if (!activeSession) return;

    const channel = supabase
      .channel(`team_session_${activeSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'focus_team_sessions',
          filter: `id=eq.${activeSession.id}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setActiveSession((prev) => ({ ...prev, ...payload.new }));
            logger.info('🔄 Session updated', payload.new, 'COLLAB');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_session_participants',
          filter: `session_id=eq.${activeSession.id}`,
        },
        async () => {
          // Recharger la liste des participants
          const { data } = await supabase
            .from('team_session_participants')
            .select('*')
            .eq('session_id', activeSession.id)
            .eq('is_active', true);
          setParticipants(data || []);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_session_chat',
          filter: `session_id=eq.${activeSession.id}`,
        },
        (payload) => {
          setChatMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      supabase.removeChannel(channel);
      setRealtimeChannel(null);
    };
  }, [activeSession?.id]);

  /**
   * Charger les messages initiaux
   */
  useEffect(() => {
    if (!activeSession) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('team_session_chat')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('created_at', { ascending: true })
        .limit(50);

      setChatMessages(data || []);
    };

    loadMessages();
  }, [activeSession?.id]);

  return {
    activeSession,
    participants,
    chatMessages,
    leaderboard,
    createTeamSession,
    joinTeamSession,
    leaveTeamSession,
    startWorkPhase,
    startBreakPhase,
    sendChatMessage,
    loadLeaderboard,
  };
};
