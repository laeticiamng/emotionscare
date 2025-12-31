/**
 * Service pour la gestion des mentions
 */

import { supabase } from '@/integrations/supabase/client';

export interface CommunityMention {
  id: string;
  post_id?: string;
  comment_id?: string;
  mentioned_user_id: string;
  mentioned_by: string;
  is_read: boolean;
  created_at: string;
}

export class CommunityMentionService {
  /**
   * Créer une mention dans un post
   */
  static async createPostMention(
    postId: string,
    mentionedUserId: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_mentions')
      .insert({
        post_id: postId,
        mentioned_user_id: mentionedUserId,
        mentioned_by: user.id,
        is_read: false
      });

    if (error) throw error;

    // Create a notification for the mentioned user
    await supabase
      .from('notifications')
      .insert({
        user_id: mentionedUserId,
        type: 'mention',
        title: 'Vous avez été mentionné',
        message: 'Quelqu\'un vous a mentionné dans un post',
        action_link: `/app/community/post/${postId}`,
        read: false
      });
  }

  /**
   * Créer une mention dans un commentaire
   */
  static async createCommentMention(
    commentId: string,
    postId: string,
    mentionedUserId: string
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('community_mentions')
      .insert({
        comment_id: commentId,
        mentioned_user_id: mentionedUserId,
        mentioned_by: user.id,
        is_read: false
      });

    if (error) throw error;

    // Create a notification
    await supabase
      .from('notifications')
      .insert({
        user_id: mentionedUserId,
        type: 'mention',
        title: 'Vous avez été mentionné',
        message: 'Quelqu\'un vous a mentionné dans un commentaire',
        action_link: `/app/community/post/${postId}`,
        read: false
      });
  }

  /**
   * Récupérer les mentions non lues
   */
  static async getUnreadMentions(): Promise<CommunityMention[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('community_mentions')
      .select('*')
      .eq('mentioned_user_id', user.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Marquer une mention comme lue
   */
  static async markAsRead(mentionId: string): Promise<void> {
    const { error } = await supabase
      .from('community_mentions')
      .update({ is_read: true })
      .eq('id', mentionId);

    if (error) throw error;
  }

  /**
   * Marquer toutes les mentions comme lues
   */
  static async markAllAsRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('community_mentions')
      .update({ is_read: true })
      .eq('mentioned_user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
  }
}
