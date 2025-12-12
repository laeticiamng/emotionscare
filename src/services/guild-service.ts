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

  // ========== MÉTHODES ENRICHIES ==========

  async getUserGuild(): Promise<Guild | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: membership } = await supabase
        .from('guild_members')
        .select('guild_id')
        .eq('user_id', user.id)
        .single();

      if (!membership) return null;

      return this.getGuildById(membership.guild_id);
    } catch (error) {
      logger.error('Error fetching user guild', error as Error, 'GuildService');
      return null;
    }
  }

  async getUserMembership(guildId: string): Promise<GuildMember | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('guild_members')
        .select(`*, user:user_id(display_name, avatar_url)`)
        .eq('guild_id', guildId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching membership', error as Error, 'GuildService');
      return null;
    }
  }

  async updateGuild(guildId: string, updates: Partial<Guild>): Promise<Guild | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const guild = await this.getGuildById(guildId);
      if (!guild || guild.owner_id !== user.id) throw new Error('Not authorized');

      const { data, error } = await supabase
        .from('music_guilds')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', guildId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating guild', error as Error, 'GuildService');
      return null;
    }
  }

  async deleteGuild(guildId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const guild = await this.getGuildById(guildId);
      if (!guild || guild.owner_id !== user.id) throw new Error('Not authorized');

      const { error } = await supabase
        .from('music_guilds')
        .delete()
        .eq('id', guildId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error deleting guild', error as Error, 'GuildService');
      return false;
    }
  }

  async promoteToAdmin(guildId: string, userId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const guild = await this.getGuildById(guildId);
      if (!guild || guild.owner_id !== user.id) throw new Error('Not authorized');

      const { error } = await supabase
        .from('guild_members')
        .update({ role: 'admin' })
        .eq('guild_id', guildId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error promoting member', error as Error, 'GuildService');
      return false;
    }
  }

  async demoteFromAdmin(guildId: string, userId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const guild = await this.getGuildById(guildId);
      if (!guild || guild.owner_id !== user.id) throw new Error('Not authorized');

      const { error } = await supabase
        .from('guild_members')
        .update({ role: 'member' })
        .eq('guild_id', guildId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error demoting member', error as Error, 'GuildService');
      return false;
    }
  }

  async kickMember(guildId: string, userId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const membership = await this.getUserMembership(guildId);
      if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('guild_id', guildId)
        .eq('user_id', userId)
        .neq('role', 'owner');

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error kicking member', error as Error, 'GuildService');
      return false;
    }
  }

  async contributeXP(guildId: string, xp: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const guild = await this.getGuildById(guildId);
      if (!guild) throw new Error('Guild not found');

      await supabase.rpc('increment_guild_xp', {
        p_guild_id: guildId,
        p_user_id: user.id,
        p_xp: xp
      });

      return true;
    } catch (error) {
      // Fallback to manual update if RPC not available
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: membership } = await supabase
          .from('guild_members')
          .select('contribution_xp')
          .eq('guild_id', guildId)
          .eq('user_id', user.id)
          .single();

        if (membership) {
          await supabase
            .from('guild_members')
            .update({ contribution_xp: (membership.contribution_xp || 0) + xp })
            .eq('guild_id', guildId)
            .eq('user_id', user.id);
        }

        const { data: guild } = await supabase
          .from('music_guilds')
          .select('total_xp')
          .eq('id', guildId)
          .single();

        if (guild) {
          await supabase
            .from('music_guilds')
            .update({ total_xp: (guild.total_xp || 0) + xp })
            .eq('id', guildId);
        }

        return true;
      } catch {
        return false;
      }
    }
  }

  async createChallenge(
    guildId: string,
    challenge: Omit<GuildChallenge, 'id' | 'guild_id' | 'current_value' | 'status' | 'created_at' | 'completed_at'>
  ): Promise<GuildChallenge | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const membership = await this.getUserMembership(guildId);
      if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const { data, error } = await supabase
        .from('guild_challenges')
        .insert({
          ...challenge,
          guild_id: guildId,
          current_value: 0,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating challenge', error as Error, 'GuildService');
      return null;
    }
  }

  async getGuildLeaderboard(limit: number = 20): Promise<Array<Guild & { rank: number }>> {
    try {
      const { data, error } = await supabase
        .from('music_guilds')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((guild, index) => ({
        ...guild,
        rank: index + 1
      }));
    } catch (error) {
      logger.error('Error fetching guild leaderboard', error as Error, 'GuildService');
      return [];
    }
  }

  async getMemberLeaderboard(guildId: string): Promise<Array<GuildMember & { rank: number }>> {
    try {
      const members = await this.getGuildMembers(guildId);
      return members.map((member, index) => ({
        ...member,
        rank: index + 1
      }));
    } catch (error) {
      logger.error('Error fetching member leaderboard', error as Error, 'GuildService');
      return [];
    }
  }

  async getGuildStats(guildId: string): Promise<{
    totalXP: number;
    memberCount: number;
    activeMembers: number;
    completedChallenges: number;
    activeChallenges: number;
    avgContribution: number;
    topContributor: GuildMember | null;
  }> {
    try {
      const [guild, members, challenges] = await Promise.all([
        this.getGuildById(guildId),
        this.getGuildMembers(guildId),
        this.getGuildChallenges(guildId)
      ]);

      const completedChallenges = challenges.filter(c => c.status === 'completed').length;
      const activeChallenges = challenges.filter(c => c.status === 'active').length;
      const totalContribution = members.reduce((sum, m) => sum + (m.contribution_xp || 0), 0);
      const avgContribution = members.length > 0 ? Math.round(totalContribution / members.length) : 0;
      const topContributor = members.length > 0 ? members[0] : null;

      // Active members (contributed in last 7 days would need timestamp tracking)
      const activeMembers = members.filter(m => (m.contribution_xp || 0) > 0).length;

      return {
        totalXP: guild?.total_xp || 0,
        memberCount: members.length,
        activeMembers,
        completedChallenges,
        activeChallenges,
        avgContribution,
        topContributor
      };
    } catch (error) {
      logger.error('Error fetching guild stats', error as Error, 'GuildService');
      return {
        totalXP: 0, memberCount: 0, activeMembers: 0, completedChallenges: 0,
        activeChallenges: 0, avgContribution: 0, topContributor: null
      };
    }
  }

  async searchGuilds(query: string, filters?: {
    genre?: string;
    minMembers?: number;
    maxMembers?: number;
  }): Promise<Guild[]> {
    try {
      let queryBuilder = supabase
        .from('music_guilds')
        .select('*')
        .eq('is_public', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

      if (filters?.genre) {
        queryBuilder = queryBuilder.eq('music_genre', filters.genre);
      }
      if (filters?.minMembers) {
        queryBuilder = queryBuilder.gte('member_count', filters.minMembers);
      }
      if (filters?.maxMembers) {
        queryBuilder = queryBuilder.lte('member_count', filters.maxMembers);
      }

      const { data, error } = await queryBuilder
        .order('total_xp', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error searching guilds', error as Error, 'GuildService');
      return [];
    }
  }

  async getActiveChallenges(guildId: string): Promise<GuildChallenge[]> {
    try {
      const { data, error } = await supabase
        .from('guild_challenges')
        .select('*')
        .eq('guild_id', guildId)
        .eq('status', 'active')
        .order('expires_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching active challenges', error as Error, 'GuildService');
      return [];
    }
  }
}

export const guildService = new GuildService();
