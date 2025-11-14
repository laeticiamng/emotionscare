import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Guild {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  owner_id: string;
  total_xp: number;
  member_count: number;
  max_members: number;
  is_public: boolean;
  music_genre: string | null;
  created_at: string;
  updated_at: string;
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  contribution_xp: number;
  joined_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface GuildMessage {
  id: string;
  guild_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface GuildChallenge {
  id: string;
  guild_id: string;
  title: string;
  description: string | null;
  challenge_type: 'collective_xp' | 'quest_completion' | 'streak_maintenance' | 'music_listening';
  target_value: number;
  current_value: number;
  reward_description: string | null;
  reward_xp: number;
  status: 'active' | 'completed' | 'expired';
  created_at: string;
  expires_at: string;
  completed_at: string | null;
}

class GuildService {
  async createGuild(
    name: string,
    description: string,
    isPublic: boolean = true,
    musicGenre?: string
  ): Promise<Guild | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: guild, error: guildError } = await supabase
        .from('music_guilds')
        .insert({
          name,
          description,
          owner_id: user.id,
          is_public: isPublic,
          music_genre: musicGenre,
        })
        .select()
        .single();

      if (guildError) throw guildError;

      // Ajouter le créateur comme membre
      const { error: memberError } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guild.id,
          user_id: user.id,
          role: 'owner',
        });

      if (memberError) throw memberError;

      return guild;
    } catch (error) {
      logger.error('Error creating guild', error as Error, 'GuildService');
      return null;
    }
  }

  async getGuilds(limit: number = 50): Promise<Guild[]> {
    try {
      const { data, error } = await supabase
        .from('music_guilds')
        .select('*')
        .eq('is_public', true)
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching guilds', error as Error, 'GuildService');
      return [];
    }
  }

  async getGuildById(guildId: string): Promise<Guild | null> {
    try {
      const { data, error } = await supabase
        .from('music_guilds')
        .select('*')
        .eq('id', guildId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching guild', error as Error, 'GuildService');
      return null;
    }
  }

  async joinGuild(guildId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guildId,
          user_id: user.id,
          role: 'member',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error joining guild', error as Error, 'GuildService');
      return false;
    }
  }

  async leaveGuild(guildId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('guild_id', guildId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error leaving guild', error as Error, 'GuildService');
      return false;
    }
  }

  async getGuildMembers(guildId: string): Promise<GuildMember[]> {
    try {
      const { data, error } = await supabase
        .from('guild_members')
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .eq('guild_id', guildId)
        .order('contribution_xp', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching guild members', error as Error, 'GuildService');
      return [];
    }
  }

  async sendMessage(guildId: string, message: string): Promise<GuildMessage | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('guild_messages')
        .insert({
          guild_id: guildId,
          user_id: user.id,
          message,
        })
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error sending message', error as Error, 'GuildService');
      return null;
    }
  }

  async getMessages(guildId: string, limit: number = 100): Promise<GuildMessage[]> {
    try {
      const { data, error } = await supabase
        .from('guild_messages')
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .eq('guild_id', guildId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).reverse();
    } catch (error) {
      logger.error('Error fetching messages', error as Error, 'GuildService');
      return [];
    }
  }

  async getGuildChallenges(guildId: string): Promise<GuildChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('guild_challenges')
        .select('*')
        .eq('guild_id', guildId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching guild challenges', error as Error, 'GuildService');
      return [];
    }
  }

  async updateChallengeProgress(challengeId: string, increment: number): Promise<boolean> {
    try {
      const { data: challenge, error: fetchError } = await supabase
        .from('guild_challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (fetchError) throw fetchError;

      const newValue = challenge.current_value + increment;
      const completed = newValue >= challenge.target_value;

      const { error } = await supabase
        .from('guild_challenges')
        .update({
          current_value: newValue,
          status: completed ? 'completed' : 'active',
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', challengeId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating challenge progress', error as Error, 'GuildService');
      return false;
    }
  }

  subscribeToGuildMessages(guildId: string, callback: (message: GuildMessage) => void) {
    const channel = supabase
      .channel(`guild_messages:${guildId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guild_messages',
          filter: `guild_id=eq.${guildId}`,
        },
        async (payload) => {
          // Fetch user info for the new message
          const { data: user } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', payload.new.user_id)
            .single();

          callback({
            ...payload.new,
            user,
          } as GuildMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const guildService = new GuildService();
