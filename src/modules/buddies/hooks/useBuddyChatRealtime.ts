/**
 * Hook pour le chat en temps réel avec un buddy
 * Utilise Supabase Realtime pour les messages
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BuddyService } from '../services/buddyService';
import type { BuddyMessage } from '../types';
import { toast } from 'sonner';

export function useBuddyChatRealtime(matchId: string, buddyUserId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<BuddyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [buddyTyping, setBuddyTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les messages initiaux
  const loadMessages = useCallback(async () => {
    if (!matchId) return;

    setLoading(true);
    try {
      const msgs = await BuddyService.getMessages(matchId);
      setMessages(msgs);
      
      // Marquer comme lus
      if (user) {
        await BuddyService.markMessagesAsRead(matchId, user.id);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [matchId, user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!matchId || !user) return;

    const channel = supabase
      .channel(`chat-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'buddy_messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          const newMessage = payload.new as BuddyMessage;
          // Éviter les doublons (notre propre message)
          if (newMessage.sender_id !== user.id) {
            setMessages(prev => {
              // Vérifier si le message existe déjà
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
            // Marquer comme lu
            BuddyService.markMessagesAsRead(matchId, user.id);
          }
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.userId === buddyUserId) {
          setBuddyTyping(true);
          // Reset après 3 secondes
          setTimeout(() => setBuddyTyping(false), 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user, buddyUserId]);

  // Envoyer un message
  const sendMessage = useCallback(async (content: string, type: string = 'text') => {
    if (!user || !matchId) return null;

    try {
      const message = await BuddyService.sendMessage(matchId, user.id, buddyUserId, content, type);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      return null;
    }
  }, [user, matchId, buddyUserId]);

  // Envoyer l'état "en train d'écrire"
  const sendTypingIndicator = useCallback(async () => {
    if (!user || !matchId) return;

    const channel = supabase.channel(`chat-${matchId}`);
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { odaL: user.id }
    });

    // Reset typing après 2 secondes
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping(true);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 2000);
  }, [user, matchId]);

  // Envoyer un emoji
  const sendEmoji = useCallback(async (emoji: string) => {
    return sendMessage(emoji, 'emoji');
  }, [sendMessage]);

  // Envoyer une invitation d'activité
  const sendActivityInvite = useCallback(async (activityType: string, title: string) => {
    const content = JSON.stringify({ activityType, title });
    return sendMessage(content, 'activity_invite');
  }, [sendMessage]);

  return {
    messages,
    loading,
    typing,
    buddyTyping,
    loadMessages,
    sendMessage,
    sendTypingIndicator,
    sendEmoji,
    sendActivityInvite
  };
}
