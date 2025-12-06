/**
 * Service pour la communauté et les interactions sociales
 */

import { supabase } from '@/integrations/supabase/client';
import type { CommunityStats } from './types';

export interface AuraConnection {
  id: string;
  user_id_a: string;
  user_id_b: string;
  connection_strength: number;
  interaction_types?: any[];
  last_interaction_at: string;
  created_at: string;
}

export interface Buddy {
  id: string;
  user_id: string;
  buddy_user_id: string;
  date: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  category?: string;
  tags?: string[];
  mood?: string;
  is_anonymous: boolean;
  is_featured: boolean;
  moderation_status: string;
  likes_count: number;
  comments_count: number;
  shares_count?: number;
  views_count?: number;
  media_urls?: string[];
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  likes_count: number;
  is_anonymous: boolean;
  moderation_status: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  is_private: boolean;
  join_approval_required: boolean;
  max_members: number;
  current_members: number;
  moderator_ids: string[];
  rules?: string[];
  created_by: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  post_id?: string;
  comment_id?: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'care';
  created_at: string;
}

export interface NotificationPayload {
  user_id: string;
  type: 'comment' | 'reaction' | 'mention' | 'follow' | 'group_invite';
  title: string;
  message: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

export class CommunityService {
  /**
   * Récupérer les connexions aura d'un utilisateur
   */
  static async fetchConnections(userId: string): Promise<AuraConnection[]> {
    const { data, error } = await supabase
      .from('aura_connections')
      .select('*')
      .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`)
      .order('connection_strength', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer ou mettre à jour une connexion
   */
  static async updateConnection(
    userIdA: string,
    userIdB: string,
    interactionType: string
  ): Promise<void> {
    const { data: existing } = await supabase
      .from('aura_connections')
      .select('*')
      .or(`and(user_id_a.eq.${userIdA},user_id_b.eq.${userIdB}),and(user_id_a.eq.${userIdB},user_id_b.eq.${userIdA})`)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('aura_connections')
        .update({
          connection_strength: existing.connection_strength + 1,
          last_interaction_at: new Date().toISOString(),
          interaction_types: [...(existing.interaction_types || []), interactionType]
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('aura_connections')
        .insert({
          user_id_a: userIdA,
          user_id_b: userIdB,
          connection_strength: 1,
          interaction_types: [interactionType]
        });

      if (error) throw error;
    }
  }

  /**
   * Trouver un buddy
   */
  static async findBuddy(userId: string): Promise<string | null> {
    // Logique de matching simple - à améliorer selon les besoins
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .neq('user_id', userId)
      .limit(1)
      .single();

    if (error || !data) return null;

    // Créer le lien buddy
    await supabase
      .from('buddies')
      .insert({
        user_id: userId,
        buddy_user_id: data.user_id
      });

    return data.user_id;
  }

  /**
   * Récupérer les buddies
   */
  static async fetchBuddies(userId: string): Promise<Buddy[]> {
    const { data, error } = await supabase
      .from('buddies')
      .select('*')
      .or(`user_id.eq.${userId},buddy_user_id.eq.${userId}`)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Récupérer le leaderboard
   */
  static async fetchLeaderboard(orgId?: string, limit: number = 50): Promise<any[]> {
    let query = supabase
      .from('gamification_metrics')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (orgId) {
      query = query.eq('org_id', orgId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // ==================== POSTS ====================

  /**
   * Récupérer les posts avec pagination
   */
  static async fetchPosts(
    filter: 'all' | 'trending' | 'following' | 'featured' = 'all',
    page: number = 1,
    pageSize: number = 20,
    userId?: string
  ): Promise<{ posts: Post[]; hasMore: boolean; totalCount: number }> {
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from('community_posts')
      .select('*, profiles!community_posts_user_id_fkey(id, full_name, avatar_url)', { count: 'exact' })
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    // Apply filters
    if (filter === 'trending') {
      // Posts with high engagement in last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query = query
        .gte('created_at', yesterday.toISOString())
        .order('likes_count', { ascending: false });
    } else if (filter === 'featured') {
      query = query.eq('is_featured', true);
    } else if (filter === 'following' && userId) {
      // Get posts from users the current user follows
      const { data: following } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);

      if (following && following.length > 0) {
        const followingIds = following.map(f => f.following_id);
        query = query.in('user_id', followingIds);
      }
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      posts: data || [],
      hasMore: offset + pageSize < (count || 0),
      totalCount: count || 0
    };
  }

  /**
   * Créer un post
   */
  static async createPost(postData: {
    content: string;
    mood?: string;
    category?: string;
    tags?: string[];
    isAnonymous?: boolean;
    mediaUrls?: string[];
    location?: string;
  }): Promise<Post> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        content: postData.content,
        mood: postData.mood,
        category: postData.category,
        tags: postData.tags || [],
        is_anonymous: postData.isAnonymous || false,
        media_urls: postData.mediaUrls,
        location: postData.location,
        moderation_status: 'pending', // Will be moderated
        is_featured: false,
        likes_count: 0,
        comments_count: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mettre à jour un post
   */
  static async updatePost(postId: string, updates: {
    content?: string;
    tags?: string[];
    mood?: string;
    category?: string;
  }): Promise<Post> {
    const { data, error } = await supabase
      .from('community_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Supprimer un post
   */
  static async deletePost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  }

  /**
   * Rechercher des posts
   */
  static async searchPosts(
    query: string,
    filters?: {
      category?: string;
      tags?: string[];
      mood?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<Post[]> {
    let dbQuery = supabase
      .from('community_posts')
      .select('*')
      .eq('moderation_status', 'approved')
      .ilike('content', `%${query}%`);

    if (filters?.category) {
      dbQuery = dbQuery.eq('category', filters.category);
    }

    if (filters?.tags && filters.tags.length > 0) {
      dbQuery = dbQuery.contains('tags', filters.tags);
    }

    if (filters?.mood) {
      dbQuery = dbQuery.eq('mood', filters.mood);
    }

    if (filters?.dateFrom) {
      dbQuery = dbQuery.gte('created_at', filters.dateFrom);
    }

    if (filters?.dateTo) {
      dbQuery = dbQuery.lte('created_at', filters.dateTo);
    }

    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // ==================== REACTIONS ====================

  /**
   * Ajouter/retirer une réaction à un post
   */
  static async toggleReaction(
    targetId: string,
    targetType: 'post' | 'comment',
    reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'care'
  ): Promise<{ added: boolean }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const column = targetType === 'post' ? 'post_id' : 'comment_id';

    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('post_reactions')
      .select('*')
      .eq(column, targetId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Remove reaction if same type, or update if different
      if (existing.reaction_type === reactionType) {
        await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);

        // Decrement count
        if (targetType === 'post') {
          await supabase.rpc('decrement_post_likes', { post_id: targetId });
        }

        return { added: false };
      } else {
        await supabase
          .from('post_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id);

        return { added: true };
      }
    } else {
      // Add new reaction
      await supabase
        .from('post_reactions')
        .insert({
          [column]: targetId,
          user_id: user.id,
          reaction_type: reactionType
        });

      // Increment count
      if (targetType === 'post') {
        await supabase.rpc('increment_post_likes', { post_id: targetId });
      } else {
        await supabase.rpc('increment_comment_likes', { comment_id: targetId });
      }

      return { added: true };
    }
  }

  /**
   * Récupérer les réactions d'un post/comment
   */
  static async fetchReactions(
    targetId: string,
    targetType: 'post' | 'comment'
  ): Promise<{ type: string; count: number; userReacted: boolean }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const column = targetType === 'post' ? 'post_id' : 'comment_id';

    const { data, error } = await supabase
      .from('post_reactions')
      .select('*')
      .eq(column, targetId);

    if (error) throw error;

    // Group by reaction type
    const grouped = (data || []).reduce((acc, reaction) => {
      if (!acc[reaction.reaction_type]) {
        acc[reaction.reaction_type] = {
          type: reaction.reaction_type,
          count: 0,
          userReacted: false
        };
      }
      acc[reaction.reaction_type].count++;
      if (user && reaction.user_id === user.id) {
        acc[reaction.reaction_type].userReacted = true;
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  // ==================== COMMENTS ====================

  /**
   * Récupérer les commentaires d'un post
   */
  static async fetchComments(postId: string, parentId?: string): Promise<Comment[]> {
    let query = supabase
      .from('post_comments')
      .select('*, profiles!post_comments_user_id_fkey(id, full_name, avatar_url)')
      .eq('post_id', postId)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: true });

    if (parentId) {
      query = query.eq('parent_comment_id', parentId);
    } else {
      query = query.is('parent_comment_id', null);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer un commentaire
   */
  static async createComment(commentData: {
    postId: string;
    content: string;
    isAnonymous?: boolean;
    parentCommentId?: string;
  }): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: commentData.postId,
        user_id: user.id,
        content: commentData.content,
        is_anonymous: commentData.isAnonymous || false,
        parent_comment_id: commentData.parentCommentId,
        moderation_status: 'approved',
        likes_count: 0
      })
      .select()
      .single();

    if (error) throw error;

    // Increment post comment count
    await supabase.rpc('increment_post_comments', { post_id: commentData.postId });

    return data;
  }

  /**
   * Supprimer un commentaire
   */
  static async deleteComment(commentId: string, postId: string): Promise<void> {
    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    // Decrement post comment count
    await supabase.rpc('decrement_post_comments', { post_id: postId });
  }

  // ==================== GROUPS ====================

  /**
   * Récupérer les groupes
   */
  static async fetchGroups(
    filter: 'all' | 'my_groups' | 'public' = 'all',
    userId?: string
  ): Promise<Group[]> {
    let query = supabase
      .from('support_groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter === 'public') {
      query = query.eq('is_private', false);
    } else if (filter === 'my_groups' && userId) {
      const { data: memberships } = await supabase
        .from('group_memberships')
        .select('group_id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (memberships && memberships.length > 0) {
        const groupIds = memberships.map(m => m.group_id);
        query = query.in('id', groupIds);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Créer un groupe
   */
  static async createGroup(groupData: {
    name: string;
    description: string;
    category: string;
    isPrivate?: boolean;
    requireApproval?: boolean;
    maxMembers?: number;
    rules?: string[];
  }): Promise<Group> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('support_groups')
      .insert({
        name: groupData.name,
        description: groupData.description,
        category: groupData.category,
        is_private: groupData.isPrivate || false,
        join_approval_required: groupData.requireApproval || false,
        max_members: groupData.maxMembers || 100,
        current_members: 1,
        moderator_ids: [user.id],
        rules: groupData.rules || [],
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Auto-join as admin
    await supabase
      .from('group_memberships')
      .insert({
        group_id: data.id,
        user_id: user.id,
        role: 'admin',
        status: 'active'
      });

    return data;
  }

  /**
   * Rejoindre un groupe
   */
  static async joinGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get group info
    const { data: group } = await supabase
      .from('support_groups')
      .select('join_approval_required')
      .eq('id', groupId)
      .single();

    const { error } = await supabase
      .from('group_memberships')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member',
        status: group?.join_approval_required ? 'pending' : 'active'
      });

    if (error) throw error;

    // Increment member count if auto-approved
    if (!group?.join_approval_required) {
      await supabase.rpc('increment_group_members', { group_id: groupId });
    }
  }

  /**
   * Quitter un groupe
   */
  static async leaveGroup(groupId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('group_memberships')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Decrement member count
    await supabase.rpc('decrement_group_members', { group_id: groupId });
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Créer une notification
   */
  static async createNotification(notification: NotificationPayload): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        metadata: notification.metadata,
        is_read: false
      });

    if (error) throw error;
  }

  /**
   * Envoyer une notification de mention
   */
  static async notifyMention(mentionedUserId: string, postId: string, mentionerName: string): Promise<void> {
    await this.createNotification({
      user_id: mentionedUserId,
      type: 'mention',
      title: 'Nouvelle mention',
      message: `${mentionerName} vous a mentionné dans un post`,
      action_url: `/community/post/${postId}`
    });
  }

  // ==================== TAGS ====================

  /**
   * Récupérer les tags recommandés
   */
  static async getRecommendedTags(limit: number = 20): Promise<string[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('tags')
      .not('tags', 'is', null)
      .limit(100);

    if (error) return [];

    // Flatten and count tags
    const tagCounts: Record<string, number> = {};
    (data || []).forEach(post => {
      (post.tags || []).forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Sort by count and return top tags
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  // ==================== STATS ====================

  /**
   * Récupérer les statistiques de la communauté
   */
  static async getCommunityStats(userId?: string): Promise<CommunityStats> {
    const stats: CommunityStats = {
      totalPosts: 0,
      totalComments: 0,
      totalLikes: 0
    };

    // Total posts
    const { count: postsCount } = await supabase
      .from('community_posts')
      .select('*', { count: 'exact', head: true })
      .eq('moderation_status', 'approved');

    stats.totalPosts = postsCount || 0;

    // Total comments
    const { count: commentsCount } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('moderation_status', 'approved');

    stats.totalComments = commentsCount || 0;

    // Total likes
    const { count: likesCount } = await supabase
      .from('post_reactions')
      .select('*', { count: 'exact', head: true });

    stats.totalLikes = likesCount || 0;

    // User-specific stats
    if (userId) {
      const { count: myPostsCount } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      stats.myPosts = myPostsCount || 0;

      const { count: myCommentsCount } = await supabase
        .from('post_comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      stats.myComments = myCommentsCount || 0;
    }

    return stats;
  }
}
