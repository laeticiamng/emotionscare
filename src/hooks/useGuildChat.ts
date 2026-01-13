/**
 * Hook pour le chat de guilde en temps réel
 * TOP 5 #2 Éléments moins développés - Système de guildes avec chat
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  display_name: string;
  avatar_emoji: string;
  role: 'leader' | 'officer' | 'member';
  joined_at: string;
  last_active_at: string;
  contribution_points: number;
  is_online: boolean;
}

export interface GuildMessage {
  id: string;
  guild_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  message_type: 'text' | 'system' | 'achievement' | 'event';
  metadata?: Record<string, unknown>;
  created_at: string;
  is_pinned: boolean;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  banner_emoji: string;
  created_at: string;
  leader_id: string;
  member_count: number;
  max_members: number;
  total_xp: number;
  level: number;
  is_public: boolean;
  tags: string[];
}

export function useGuildChat(guildId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [messages, setMessages] = useState<GuildMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [userMembership, setUserMembership] = useState<GuildMember | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les données de la guilde
  const fetchGuildData = useCallback(async () => {
    if (!guildId) return;
    setIsLoading(true);

    try {
      // Guilde
      const { data: guildData, error: gError } = await supabase
        .from('guilds')
        .select('*')
        .eq('id', guildId)
        .single();

      if (gError) throw gError;
      setGuild(guildData as Guild);

      // Membres
      const { data: membersData, error: mError } = await supabase
        .from('guild_members')
        .select('*')
        .eq('guild_id', guildId)
        .order('role', { ascending: true });

      if (mError) throw mError;
      const typedMembers = (membersData || []) as GuildMember[];
      setMembers(typedMembers);
      setOnlineCount(typedMembers.filter(m => m.is_online).length);

      // Membership utilisateur
      if (user) {
        const userMember = typedMembers.find(m => m.user_id === user.id);
        setUserMembership(userMember || null);
      }

      // Messages récents
      const { data: messagesData, error: msgError } = await supabase
        .from('guild_messages')
        .select('*')
        .eq('guild_id', guildId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (msgError) throw msgError;
      setMessages(((messagesData || []) as GuildMessage[]).reverse());

    } catch (error) {
      logger.error('Failed to fetch guild data', error as Error, 'GUILD');
    } finally {
      setIsLoading(false);
    }
  }, [guildId, user]);

  // Envoyer un message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !guildId || !userMembership || !content.trim()) return null;
    setIsSending(true);

    try {
      const { data, error } = await supabase
        .from('guild_messages')
        .insert({
          guild_id: guildId,
          sender_id: userMembership.id,
          sender_name: userMembership.display_name,
          sender_avatar: userMembership.avatar_emoji,
          content: content.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      // Le message sera ajouté via le realtime subscription
      return data as GuildMessage;

    } catch (error) {
      logger.error('Failed to send message', error as Error, 'GUILD');
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSending(false);
    }
  }, [user, guildId, userMembership, toast]);

  // Épingler un message (officers+)
  const pinMessage = useCallback(async (messageId: string) => {
    if (!userMembership || userMembership.role === 'member') {
      toast({
        title: 'Permission refusée',
        description: 'Seuls les officiers peuvent épingler des messages',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('guild_messages')
        .update({ is_pinned: true })
        .eq('id', messageId);

      if (error) throw error;
      
      toast({
        title: '📌 Message épinglé',
        description: 'Le message a été épinglé'
      });
      return true;

    } catch (error) {
      logger.error('Failed to pin message', error as Error, 'GUILD');
      return false;
    }
  }, [userMembership, toast]);

  // Rejoindre une guilde
  const joinGuild = useCallback(async (displayName: string, avatarEmoji: string) => {
    if (!user || !guildId) return null;

    try {
      if (userMembership) {
        toast({
          title: 'Déjà membre',
          description: 'Vous êtes déjà membre de cette guilde'
        });
        return null;
      }

      if (guild && guild.member_count >= guild.max_members) {
        toast({
          title: 'Guilde complète',
          description: 'Cette guilde a atteint sa limite de membres',
          variant: 'destructive'
        });
        return null;
      }

      const { data, error } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guildId,
          user_id: user.id,
          display_name: displayName,
          avatar_emoji: avatarEmoji,
          role: 'member',
          is_online: true
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le compteur
      await supabase
        .from('guilds')
        .update({ member_count: (guild?.member_count || 0) + 1 })
        .eq('id', guildId);

      // Message système
      await supabase.from('guild_messages').insert({
        guild_id: guildId,
        sender_id: data.id,
        sender_name: 'Système',
        sender_avatar: '🎉',
        content: `${displayName} a rejoint la guilde !`,
        message_type: 'system'
      });

      toast({
        title: '🎉 Bienvenue !',
        description: `Vous avez rejoint ${guild?.name}`
      });

      await fetchGuildData();
      return data as GuildMember;

    } catch (error) {
      logger.error('Failed to join guild', error as Error, 'GUILD');
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre la guilde',
        variant: 'destructive'
      });
      return null;
    }
  }, [user, guildId, guild, userMembership, toast, fetchGuildData]);

  // Quitter la guilde
  const leaveGuild = useCallback(async () => {
    if (!userMembership || !guildId) return false;

    if (userMembership.role === 'leader') {
      toast({
        title: 'Impossible',
        description: 'Le leader ne peut pas quitter sans transférer la guilde',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('id', userMembership.id);

      if (error) throw error;

      await supabase
        .from('guilds')
        .update({ member_count: Math.max(0, (guild?.member_count || 1) - 1) })
        .eq('id', guildId);

      toast({
        title: 'Guilde quittée',
        description: 'Vous avez quitté la guilde'
      });

      setUserMembership(null);
      return true;

    } catch (error) {
      logger.error('Failed to leave guild', error as Error, 'GUILD');
      return false;
    }
  }, [userMembership, guildId, guild, toast]);

  // Mettre à jour le statut en ligne
  const updateOnlineStatus = useCallback(async (isOnline: boolean) => {
    if (!userMembership) return;

    try {
      await supabase
        .from('guild_members')
        .update({ 
          is_online: isOnline,
          last_active_at: new Date().toISOString()
        })
        .eq('id', userMembership.id);
    } catch (error) {
      logger.error('Failed to update online status', error as Error, 'GUILD');
    }
  }, [userMembership]);

  // Messages épinglés
  const pinnedMessages = messages.filter(m => m.is_pinned);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    if (!guildId) return;

    fetchGuildData();

    // Marquer comme en ligne
    if (userMembership) {
      updateOnlineStatus(true);
    }

    const channel = supabase
      .channel(`guild-${guildId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guild_messages',
        filter: `guild_id=eq.${guildId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as GuildMessage]);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'guild_members',
        filter: `guild_id=eq.${guildId}`
      }, () => {
        fetchGuildData();
      })
      .subscribe();

    // Marquer comme hors ligne quand on quitte
    const handleBeforeUnload = () => {
      if (userMembership) {
        updateOnlineStatus(false);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (userMembership) {
        updateOnlineStatus(false);
      }
    };
  }, [guildId, fetchGuildData, userMembership, updateOnlineStatus]);

  return {
    guild,
    members,
    messages,
    pinnedMessages,
    userMembership,
    onlineCount,
    isLoading,
    isSending,
    isMember: !!userMembership,
    isLeader: userMembership?.role === 'leader',
    isOfficer: userMembership?.role === 'officer' || userMembership?.role === 'leader',
    sendMessage,
    pinMessage,
    joinGuild,
    leaveGuild,
    refresh: fetchGuildData,
    messagesEndRef
  };
}

// Hook pour lister les guildes
export function useAvailableGuilds() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGuilds = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .eq('is_public', true)
        .order('total_xp', { ascending: false });

      if (error) throw error;
      setGuilds((data || []) as Guild[]);
    } catch (error) {
      logger.error('Failed to fetch guilds', error as Error, 'GUILD');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuilds();
  }, [fetchGuilds]);

  return { guilds, isLoading, refresh: fetchGuilds };
}
