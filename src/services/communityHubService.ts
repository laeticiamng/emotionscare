/**
 * Community Hub Service - Gestion des interactions communautaires
 * Partage, réactions, notifications sociales, temps réel
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  type: 'mood' | 'achievement' | 'tip' | 'question' | 'story';
  visibility: 'public' | 'friends' | 'private';
  reactions: Record<string, number>;
  comments_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  type: 'heart' | 'support' | 'celebrate' | 'hug' | 'inspire';
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface SocialNotification {
  id: string;
  type: 'reaction' | 'comment' | 'follow' | 'mention' | 'badge';
  actor_id: string;
  target_id?: string;
  message: string;
  read: boolean;
  created_at: string;
}

class CommunityHubService {
  private realtimeChannel: RealtimeChannel | null = null;
  private notificationListeners: Set<(notification: SocialNotification) => void> = new Set();

  /**
   * Récupère les posts de la communauté
   */
  async getPosts(options: {
    type?: CommunityPost['type'];
    limit?: number;
    offset?: number;
  } = {}): Promise<CommunityPost[]> {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(options.limit || 20);

      if (options.type) {
        query = query.eq('type', options.type);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(post => ({
        ...post,
        author: post.profiles,
        reactions: typeof post.reactions === 'string' ? JSON.parse(post.reactions) : (post.reactions || {}),
      }));
    } catch (error) {
      logger.error('[CommunityHub] Get posts error', error as Error, 'COMMUNITY');
      return [];
    }
  }

  /**
   * Crée un nouveau post
   */
  async createPost(
    userId: string,
    content: string,
    type: CommunityPost['type'],
    visibility: CommunityPost['visibility'] = 'public'
  ): Promise<CommunityPost | null> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: userId,
          content,
          type,
          visibility,
          reactions: {},
          comments_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('[CommunityHub] Post created', { type }, 'COMMUNITY');
      return data;
    } catch (error) {
      logger.error('[CommunityHub] Create post error', error as Error, 'COMMUNITY');
      return null;
    }
  }

  /**
   * Ajoute une réaction à un post
   */
  async addReaction(
    userId: string,
    postId: string,
    type: Reaction['type']
  ): Promise<boolean> {
    try {
      // Vérifier si déjà réagi
      const { data: existing } = await supabase
        .from('community_reactions')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .eq('type', type)
        .maybeSingle();

      if (existing) {
        // Retirer la réaction
        await supabase
          .from('community_reactions')
          .delete()
          .eq('id', existing.id);
      } else {
        // Ajouter la réaction
        await supabase
          .from('community_reactions')
          .insert({
            user_id: userId,
            post_id: postId,
            type,
          });
      }

      // Mettre à jour le compteur sur le post
      await this.updateReactionCount(postId);

      logger.debug('[CommunityHub] Reaction toggled', { postId, type }, 'COMMUNITY');
      return true;
    } catch (error) {
      logger.error('[CommunityHub] Add reaction error', error as Error, 'COMMUNITY');
      return false;
    }
  }

  /**
   * Met à jour le compteur de réactions
   */
  private async updateReactionCount(postId: string): Promise<void> {
    try {
      const { data: reactions } = await supabase
        .from('community_reactions')
        .select('type')
        .eq('post_id', postId);

      const counts: Record<string, number> = {};
      (reactions || []).forEach(r => {
        counts[r.type] = (counts[r.type] || 0) + 1;
      });

      await supabase
        .from('community_posts')
        .update({ reactions: counts })
        .eq('id', postId);
    } catch (error) {
      logger.warn('[CommunityHub] Update reaction count error', error, 'COMMUNITY');
    }
  }

  /**
   * Ajoute un commentaire
   */
  async addComment(
    userId: string,
    postId: string,
    content: string
  ): Promise<Comment | null> {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          user_id: userId,
          post_id: postId,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Incrémenter le compteur
      await supabase.rpc('increment_comment_count', { post_id: postId });

      logger.info('[CommunityHub] Comment added', { postId }, 'COMMUNITY');
      return data;
    } catch (error) {
      logger.error('[CommunityHub] Add comment error', error as Error, 'COMMUNITY');
      return null;
    }
  }

  /**
   * Récupère les commentaires d'un post
   */
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(comment => ({
        ...comment,
        author: comment.profiles,
      }));
    } catch (error) {
      logger.error('[CommunityHub] Get comments error', error as Error, 'COMMUNITY');
      return [];
    }
  }

  /**
   * S'abonne aux notifications en temps réel
   */
  subscribeToNotifications(userId: string, callback: (notification: SocialNotification) => void): () => void {
    this.notificationListeners.add(callback);

    if (!this.realtimeChannel) {
      this.realtimeChannel = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'social_notifications',
            filter: `target_user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new as SocialNotification;
            this.notificationListeners.forEach(listener => listener(notification));
          }
        )
        .subscribe();

      logger.info('[CommunityHub] Subscribed to notifications', { userId }, 'COMMUNITY');
    }

    return () => {
      this.notificationListeners.delete(callback);
      if (this.notificationListeners.size === 0 && this.realtimeChannel) {
        this.realtimeChannel.unsubscribe();
        this.realtimeChannel = null;
      }
    };
  }

  /**
   * Récupère les notifications non lues
   */
  async getUnreadNotifications(userId: string): Promise<SocialNotification[]> {
    try {
      const { data, error } = await supabase
        .from('social_notifications')
        .select('*')
        .eq('target_user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('[CommunityHub] Get notifications error', error as Error, 'COMMUNITY');
      return [];
    }
  }

  /**
   * Marque les notifications comme lues
   */
  async markNotificationsRead(userId: string, notificationIds?: string[]): Promise<void> {
    try {
      let query = supabase
        .from('social_notifications')
        .update({ read: true })
        .eq('target_user_id', userId);

      if (notificationIds?.length) {
        query = query.in('id', notificationIds);
      }

      await query;
      logger.debug('[CommunityHub] Notifications marked as read', { count: notificationIds?.length || 'all' }, 'COMMUNITY');
    } catch (error) {
      logger.error('[CommunityHub] Mark read error', error as Error, 'COMMUNITY');
    }
  }

  /**
   * Partage un achievement
   */
  async shareAchievement(
    userId: string,
    achievementName: string,
    achievementIcon: string
  ): Promise<CommunityPost | null> {
    const content = `🏆 J'ai débloqué le badge "${achievementName}" ! ${achievementIcon}`;
    return this.createPost(userId, content, 'achievement');
  }

  /**
   * Partage une amélioration d'humeur
   */
  async shareMoodImprovement(
    userId: string,
    improvement: number,
    technique: string
  ): Promise<CommunityPost | null> {
    const content = `✨ Mon humeur s'est améliorée de ${improvement} points grâce à "${technique}" !`;
    return this.createPost(userId, content, 'mood');
  }
}

export const communityHubService = new CommunityHubService();
export default communityHubService;
