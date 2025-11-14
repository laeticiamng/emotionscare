import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MatchChatMessage {
  id: string;
  match_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface MatchPrediction {
  id: string;
  match_id: string;
  user_id: string;
  predicted_winner_id: string;
  confidence: number;
  reward_earned: number;
  created_at: string;
}

export interface SpectatorStats {
  total_spectators: number;
  active_viewers: number;
  predictions_count: number;
}

class SpectatorService {
  private channels: Map<string, RealtimeChannel> = new Map();

  async joinAsSpectator(matchId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tournament_spectators')
        .upsert({
          match_id: matchId,
          user_id: user.id,
          last_seen_at: new Date().toISOString(),
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error joining as spectator', error as Error, 'SpectatorService');
      return false;
    }
  }

  async leaveAsSpectator(matchId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('tournament_spectators')
        .delete()
        .eq('match_id', matchId)
        .eq('user_id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error leaving as spectator', error as Error, 'SpectatorService');
      return false;
    }
  }

  subscribeToMatch(
    matchId: string,
    onScoreUpdate: (payload: any) => void,
    onChatMessage: (message: MatchChatMessage) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'tournament_matches',
        filter: `id=eq.${matchId}`,
      }, onScoreUpdate)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'match_chat_messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => onChatMessage(payload.new as MatchChatMessage))
      .subscribe();

    this.channels.set(matchId, channel);
    return channel;
  }

  unsubscribeFromMatch(matchId: string): void {
    const channel = this.channels.get(matchId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(matchId);
    }
  }

  async sendChatMessage(matchId: string, message: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('match_chat_messages')
        .insert({
          match_id: matchId,
          user_id: user.id,
          message,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error sending chat message', error as Error, 'SpectatorService');
      return false;
    }
  }

  async getChatMessages(matchId: string, limit: number = 50): Promise<MatchChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('match_chat_messages')
        .select(`
          *,
          user:user_id(display_name, avatar_url)
        `)
        .eq('match_id', matchId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Error fetching chat messages', error as Error, 'SpectatorService');
      return [];
    }
  }

  async submitPrediction(
    matchId: string,
    predictedWinnerId: string,
    confidence: number
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('match_predictions')
        .insert({
          match_id: matchId,
          user_id: user.id,
          predicted_winner_id: predictedWinnerId,
          confidence,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error submitting prediction', error as Error, 'SpectatorService');
      return false;
    }
  }

  async getUserPrediction(matchId: string): Promise<MatchPrediction | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('match_predictions')
        .select('*')
        .eq('match_id', matchId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching user prediction', error as Error, 'SpectatorService');
      return null;
    }
  }

  async getSpectatorStats(matchId: string): Promise<SpectatorStats> {
    try {
      const [spectatorsRes, predictionsRes] = await Promise.all([
        supabase
          .from('tournament_spectators')
          .select('*', { count: 'exact', head: true })
          .eq('match_id', matchId),
        supabase
          .from('match_predictions')
          .select('*', { count: 'exact', head: true })
          .eq('match_id', matchId),
      ]);

      return {
        total_spectators: spectatorsRes.count || 0,
        active_viewers: spectatorsRes.count || 0,
        predictions_count: predictionsRes.count || 0,
      };
    } catch (error) {
      logger.error('Error fetching spectator stats', error as Error, 'SpectatorService');
      return { total_spectators: 0, active_viewers: 0, predictions_count: 0 };
    }
  }
}

export const spectatorService = new SpectatorService();
