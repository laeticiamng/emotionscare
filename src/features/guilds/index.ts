/**
 * Guilds Feature
 *
 * Guild management, chat, and team features.
 * @module features/guilds
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export type GuildRole = 'leader' | 'officer' | 'member';
export type GuildPrivacy = 'public' | 'private' | 'invite_only';

export interface Guild {
  id: string;
  name: string;
  description: string;
  icon_emoji: string;
  banner_url?: string;
  privacy: GuildPrivacy;
  max_members: number;
  current_members: number;
  total_xp: number;
  level: number;
  leader_id: string;
  tags: string[];
  requirements?: {
    min_level?: number;
    min_streak?: number;
  };
  created_at: string;
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  role: GuildRole;
  contribution_xp: number;
  joined_at: string;
  last_active_at: string;
}

export interface GuildMessage {
  id: string;
  guild_id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  content: string;
  message_type: 'text' | 'system' | 'achievement' | 'event';
  created_at: string;
}

export interface GuildInvite {
  id: string;
  guild_id: string;
  inviter_id: string;
  invitee_id?: string;
  code: string;
  uses: number;
  max_uses?: number;
  expires_at?: string;
  created_at: string;
}

export interface GuildActivity {
  id: string;
  guild_id: string;
  user_id: string;
  activity_type: string;
  xp_earned: number;
  description: string;
  created_at: string;
}

// ============================================================================
// SERVICE
// ============================================================================

export const guildsService = {
  /**
   * Récupérer toutes les guildes publiques
   */
  async getPublicGuilds(search?: string): Promise<Guild[]> {
    let query = supabase
      .from('guilds')
      .select('*')
      .in('privacy', ['public', 'invite_only'])
      .order('total_xp', { ascending: false });

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Récupérer une guilde par ID
   */
  async getGuild(id: string): Promise<Guild | null> {
    const { data, error } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Récupérer les membres d'une guilde
   */
  async getGuildMembers(guildId: string): Promise<GuildMember[]> {
    const { data, error } = await supabase
      .from('guild_members')
      .select('*')
      .eq('guild_id', guildId)
      .order('contribution_xp', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Récupérer les messages d'une guilde
   */
  async getGuildMessages(guildId: string, limit = 50): Promise<GuildMessage[]> {
    const { data, error } = await supabase
      .from('guild_messages')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).reverse();
  },

  /**
   * Envoyer un message
   */
  async sendMessage(
    guildId: string,
    userId: string,
    displayName: string,
    content: string,
    avatarUrl?: string
  ): Promise<GuildMessage> {
    const { data, error } = await supabase
      .from('guild_messages')
      .insert({
        guild_id: guildId,
        user_id: userId,
        display_name: displayName,
        avatar_url: avatarUrl,
        content,
        message_type: 'text'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Créer une guilde
   */
  async createGuild(
    leaderId: string,
    name: string,
    description: string,
    iconEmoji: string,
    privacy: GuildPrivacy = 'public',
    tags: string[] = []
  ): Promise<Guild> {
    const { data, error } = await supabase
      .from('guilds')
      .insert({
        name,
        description,
        icon_emoji: iconEmoji,
        privacy,
        max_members: 50,
        current_members: 1,
        total_xp: 0,
        level: 1,
        leader_id: leaderId,
        tags
      })
      .select()
      .single();

    if (error) throw error;

    // Ajouter le créateur comme leader
    await supabase.from('guild_members').insert({
      guild_id: data.id,
      user_id: leaderId,
      display_name: 'Leader',
      role: 'leader',
      contribution_xp: 0
    });

    return data;
  },

  /**
   * Rejoindre une guilde
   */
  async joinGuild(
    guildId: string,
    userId: string,
    displayName: string,
    avatarUrl?: string
  ): Promise<GuildMember> {
    // Vérifier si déjà membre
    const { data: existing } = await supabase
      .from('guild_members')
      .select('id')
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .single();

    if (existing) throw new Error('Déjà membre de cette guilde');

    // Vérifier si la guilde accepte de nouveaux membres
    const guild = await this.getGuild(guildId);
    if (!guild) throw new Error('Guilde non trouvée');
    if (guild.current_members >= guild.max_members) throw new Error('Guilde complète');
    if (guild.privacy === 'private') throw new Error('Guilde privée');

    // Rejoindre
    const { data, error } = await supabase
      .from('guild_members')
      .insert({
        guild_id: guildId,
        user_id: userId,
        display_name: displayName,
        avatar_url: avatarUrl,
        role: 'member',
        contribution_xp: 0
      })
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour le compteur
    await supabase
      .from('guilds')
      .update({ current_members: guild.current_members + 1 })
      .eq('id', guildId);

    // Message système
    await this.sendSystemMessage(guildId, `${displayName} a rejoint la guilde !`);

    return data;
  },

  /**
   * Quitter une guilde
   */
  async leaveGuild(guildId: string, userId: string): Promise<void> {
    const guild = await this.getGuild(guildId);
    if (!guild) throw new Error('Guilde non trouvée');
    if (guild.leader_id === userId) throw new Error('Le leader ne peut pas quitter');

    const { data: member } = await supabase
      .from('guild_members')
      .select('display_name')
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .single();

    const { error } = await supabase
      .from('guild_members')
      .delete()
      .eq('guild_id', guildId)
      .eq('user_id', userId);

    if (error) throw error;

    await supabase
      .from('guilds')
      .update({ current_members: Math.max(0, guild.current_members - 1) })
      .eq('id', guildId);

    if (member) {
      await this.sendSystemMessage(guildId, `${member.display_name} a quitté la guilde.`);
    }
  },

  /**
   * Envoyer un message système
   */
  async sendSystemMessage(guildId: string, content: string): Promise<void> {
    await supabase.from('guild_messages').insert({
      guild_id: guildId,
      user_id: 'system',
      display_name: 'Système',
      content,
      message_type: 'system'
    });
  },

  /**
   * Changer le rôle d'un membre
   */
  async changeMemberRole(guildId: string, memberId: string, newRole: GuildRole): Promise<void> {
    const { error } = await supabase
      .from('guild_members')
      .update({ role: newRole })
      .eq('id', memberId)
      .eq('guild_id', guildId);

    if (error) throw error;
  },

  /**
   * Expulser un membre
   */
  async kickMember(guildId: string, memberId: string): Promise<void> {
    const { data: member } = await supabase
      .from('guild_members')
      .select('user_id, display_name')
      .eq('id', memberId)
      .single();

    if (!member) throw new Error('Membre non trouvé');

    const guild = await this.getGuild(guildId);
    if (guild?.leader_id === member.user_id) throw new Error('Impossible d\'expulser le leader');

    const { error } = await supabase
      .from('guild_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;

    if (guild) {
      await supabase
        .from('guilds')
        .update({ current_members: Math.max(0, guild.current_members - 1) })
        .eq('id', guildId);
    }

    await this.sendSystemMessage(guildId, `${member.display_name} a été expulsé.`);
  },

  /**
   * Vérifier si un utilisateur est membre
   */
  async isMember(guildId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('guild_members')
      .select('id')
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .single();

    return !!data;
  },

  /**
   * Récupérer la guilde d'un utilisateur
   */
  async getUserGuild(userId: string): Promise<Guild | null> {
    const { data: membership } = await supabase
      .from('guild_members')
      .select('guild_id')
      .eq('user_id', userId)
      .single();

    if (!membership) return null;
    return this.getGuild(membership.guild_id);
  },

  /**
   * Contribuer XP à la guilde
   */
  async contributeXP(guildId: string, userId: string, xp: number, reason: string): Promise<void> {
    const { data: member } = await supabase
      .from('guild_members')
      .select('contribution_xp')
      .eq('guild_id', guildId)
      .eq('user_id', userId)
      .single();

    if (!member) throw new Error('Non membre');

    const guild = await this.getGuild(guildId);
    if (!guild) throw new Error('Guilde non trouvée');

    // Mettre à jour la contribution du membre
    await supabase
      .from('guild_members')
      .update({
        contribution_xp: member.contribution_xp + xp,
        last_active_at: new Date().toISOString()
      })
      .eq('guild_id', guildId)
      .eq('user_id', userId);

    // Mettre à jour l'XP total de la guilde
    const newTotalXP = guild.total_xp + xp;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;

    await supabase
      .from('guilds')
      .update({
        total_xp: newTotalXP,
        level: newLevel
      })
      .eq('id', guildId);

    // Log l'activité
    await supabase.from('guild_activities').insert({
      guild_id: guildId,
      user_id: userId,
      activity_type: 'xp_contribution',
      xp_earned: xp,
      description: reason
    });
  }
};

// ============================================================================
// HOOKS
// ============================================================================

export function useGuilds(search?: string) {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGuilds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await guildsService.getPublicGuilds(search);
      setGuilds(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadGuilds();
  }, [loadGuilds]);

  return { guilds, loading, error, refresh: loadGuilds };
}

export function useGuild(guildId: string) {
  const { user } = useAuth();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [messages, setMessages] = useState<GuildMessage[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [userRole, setUserRole] = useState<GuildRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadGuild = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [guildData, membersData, messagesData] = await Promise.all([
        guildsService.getGuild(guildId),
        guildsService.getGuildMembers(guildId),
        guildsService.getGuildMessages(guildId)
      ]);

      setGuild(guildData);
      setMembers(membersData);
      setMessages(messagesData);

      if (user && membersData) {
        const membership = membersData.find(m => m.user_id === user.id);
        setIsMember(!!membership);
        setUserRole(membership?.role || null);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [guildId, user]);

  const join = useCallback(async (displayName: string, avatarUrl?: string) => {
    if (!user) throw new Error('Non authentifié');
    await guildsService.joinGuild(guildId, user.id, displayName, avatarUrl);
    await loadGuild();
  }, [guildId, user, loadGuild]);

  const leave = useCallback(async () => {
    if (!user) throw new Error('Non authentifié');
    await guildsService.leaveGuild(guildId, user.id);
    await loadGuild();
  }, [guildId, user, loadGuild]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user) throw new Error('Non authentifié');
    const member = members.find(m => m.user_id === user.id);
    if (!member) throw new Error('Non membre');

    const message = await guildsService.sendMessage(
      guildId,
      user.id,
      member.display_name,
      content,
      member.avatar_url
    );
    setMessages(prev => [...prev, message]);
  }, [guildId, user, members]);

  useEffect(() => {
    loadGuild();
  }, [loadGuild]);

  // Realtime subscription for messages
  useEffect(() => {
    const channel = supabase
      .channel(`guild-${guildId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guild_messages',
          filter: `guild_id=eq.${guildId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as GuildMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guildId]);

  return {
    guild,
    members,
    messages,
    isMember,
    userRole,
    isLeader: guild?.leader_id === user?.id,
    isOfficer: userRole === 'officer' || userRole === 'leader',
    loading,
    error,
    join,
    leave,
    sendMessage,
    refresh: loadGuild
  };
}

export function useUserGuild() {
  const { user } = useAuth();
  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    guildsService.getUserGuild(user.id)
      .then(setGuild)
      .finally(() => setLoading(false));
  }, [user]);

  return { guild, hasGuild: !!guild, loading };
}

// ============================================================================
// COMPONENTS
// ============================================================================

export { GuildChatPanel } from '@/components/guilds/GuildChatPanel';

// Re-export from component index
export * from '@/components/guilds';
