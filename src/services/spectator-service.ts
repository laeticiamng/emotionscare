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

  // ========== MÉTHODES ENRICHIES ==========

  async getMatchPredictions(matchId: string): Promise<{
    player1Predictions: number;
    player2Predictions: number;
    player1Percentage: number;
    player2Percentage: number;
  }> {
    try {
      const { data: match } = await supabase
        .from('tournament_matches')
        .select('player1_id, player2_id')
        .eq('id', matchId)
        .single();

      if (!match) return { player1Predictions: 0, player2Predictions: 0, player1Percentage: 50, player2Percentage: 50 };

      const { data: predictions } = await supabase
        .from('match_predictions')
        .select('predicted_winner_id')
        .eq('match_id', matchId);

      const player1Count = (predictions || []).filter(p => p.predicted_winner_id === match.player1_id).length;
      const player2Count = (predictions || []).filter(p => p.predicted_winner_id === match.player2_id).length;
      const total = player1Count + player2Count;

      return {
        player1Predictions: player1Count,
        player2Predictions: player2Count,
        player1Percentage: total > 0 ? Math.round((player1Count / total) * 100) : 50,
        player2Percentage: total > 0 ? Math.round((player2Count / total) * 100) : 50
      };
    } catch (error) {
      logger.error('Error fetching match predictions', error as Error, 'SpectatorService');
      return { player1Predictions: 0, player2Predictions: 0, player1Percentage: 50, player2Percentage: 50 };
    }
  }

  async getSpectatorList(matchId: string, limit: number = 20): Promise<Array<{
    userId: string;
    displayName: string;
    avatarUrl?: string;
    joinedAt: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('tournament_spectators')
        .select(`
          user_id,
          last_seen_at,
          user:user_id(display_name, avatar_url)
        `)
        .eq('match_id', matchId)
        .order('last_seen_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(s => ({
        userId: s.user_id,
        displayName: (s.user as any)?.display_name || 'Spectator',
        avatarUrl: (s.user as any)?.avatar_url,
        joinedAt: s.last_seen_at
      }));
    } catch (error) {
      logger.error('Error fetching spectator list', error as Error, 'SpectatorService');
      return [];
    }
  }

  async updatePrediction(matchId: string, predictedWinnerId: string, confidence: number): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('match_predictions')
        .upsert({
          match_id: matchId,
          user_id: user.id,
          predicted_winner_id: predictedWinnerId,
          confidence
        }, {
          onConflict: 'match_id,user_id'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error updating prediction', error as Error, 'SpectatorService');
      return false;
    }
  }

  async getPredictionHistory(limit: number = 20): Promise<Array<{
    matchId: string;
    predictedWinnerId: string;
    actualWinnerId?: string;
    correct: boolean;
    confidence: number;
    rewardEarned: number;
    createdAt: string;
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: predictions, error } = await supabase
        .from('match_predictions')
        .select(`
          *,
          match:match_id(winner_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (predictions || []).map(p => ({
        matchId: p.match_id,
        predictedWinnerId: p.predicted_winner_id,
        actualWinnerId: (p.match as any)?.winner_id,
        correct: (p.match as any)?.winner_id === p.predicted_winner_id,
        confidence: p.confidence,
        rewardEarned: p.reward_earned || 0,
        createdAt: p.created_at
      }));
    } catch (error) {
      logger.error('Error fetching prediction history', error as Error, 'SpectatorService');
      return [];
    }
  }

  async getPredictionStats(): Promise<{
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    totalRewardsEarned: number;
    streak: number;
    bestStreak: number;
  }> {
    try {
      const history = await this.getPredictionHistory(100);
      const correct = history.filter(p => p.correct).length;
      const totalRewards = history.reduce((sum, p) => sum + p.rewardEarned, 0);

      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      for (const p of history.reverse()) {
        if (p.correct) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      for (const p of [...history].reverse()) {
        if (p.correct) currentStreak++;
        else break;
      }

      return {
        totalPredictions: history.length,
        correctPredictions: correct,
        accuracy: history.length > 0 ? Math.round((correct / history.length) * 100) : 0,
        totalRewardsEarned: totalRewards,
        streak: currentStreak,
        bestStreak
      };
    } catch (error) {
      logger.error('Error fetching prediction stats', error as Error, 'SpectatorService');
      return { totalPredictions: 0, correctPredictions: 0, accuracy: 0, totalRewardsEarned: 0, streak: 0, bestStreak: 0 };
    }
  }

  async sendReaction(matchId: string, reaction: 'cheer' | 'clap' | 'wow' | 'sad'): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('match_reactions')
        .insert({
          match_id: matchId,
          user_id: user.id,
          reaction_type: reaction
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error sending reaction', error as Error, 'SpectatorService');
      return false;
    }
  }

  async getReactionCounts(matchId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('match_reactions')
        .select('reaction_type')
        .eq('match_id', matchId);

      if (error) throw error;

      const counts: Record<string, number> = { cheer: 0, clap: 0, wow: 0, sad: 0 };
      (data || []).forEach(r => {
        counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
      });

      return counts;
    } catch (error) {
      logger.error('Error fetching reaction counts', error as Error, 'SpectatorService');
      return { cheer: 0, clap: 0, wow: 0, sad: 0 };
    }
  }

  async getLiveMatches(): Promise<Array<{
    matchId: string;
    tournamentName: string;
    player1Name: string;
    player2Name: string;
    player1Score: number;
    player2Score: number;
    spectatorCount: number;
  }>> {
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select(`
          id,
          player1_score,
          player2_score,
          player1:player1_id(display_name),
          player2:player2_id(display_name),
          tournament:tournament_id(name)
        `)
        .eq('status', 'in_progress');

      if (error) throw error;

      const matchesWithSpectators = await Promise.all(
        (data || []).map(async (match) => {
          const stats = await this.getSpectatorStats(match.id);
          return {
            matchId: match.id,
            tournamentName: (match.tournament as any)?.name || 'Tournament',
            player1Name: (match.player1 as any)?.display_name || 'Player 1',
            player2Name: (match.player2 as any)?.display_name || 'Player 2',
            player1Score: match.player1_score,
            player2Score: match.player2_score,
            spectatorCount: stats.active_viewers
          };
        })
      );

      return matchesWithSpectators;
    } catch (error) {
      logger.error('Error fetching live matches', error as Error, 'SpectatorService');
      return [];
    }
  }

  async heartbeat(matchId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('tournament_spectators')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .eq('user_id', user.id);
    } catch (error) {
      logger.error('Error sending heartbeat', error as Error, 'SpectatorService');
    }
  }
}

export const spectatorService = new SpectatorService();
