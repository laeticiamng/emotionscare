/**
 * Types pour le module Community
 * Gestion de la communauté, posts, commentaires et interactions
 */

/**
 * Statistiques de la communauté
 */
export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalGroups?: number;
  totalMembers?: number;
  myPosts?: number;
  myComments?: number;
}

/**
 * Statut de modération
 */
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Type de réaction
 */
export type ReactionType = 'like' | 'love' | 'laugh' | 'wow' | 'care' | 'support' | 'celebrate';

/**
 * Post de communauté
 */
export interface CommunityPost {
  id: string;
  user_id: string;
  author_id?: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  mood?: string;
  is_anonymous?: boolean;
  is_featured?: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count?: number;
  views_count?: number;
  media_urls?: string[];
  group_id?: string;
  author?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Commentaire sur un post
 */
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  is_anonymous?: boolean;
  moderation_status: ModerationStatus;
  likes_count?: number;
  created_at: string;
  updated_at: string;
  author?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Réaction sur un post
 */
export interface PostReaction {
  id: string;
  post_id?: string;
  comment_id?: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

/**
 * Groupe de communauté
 */
export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  is_private?: boolean;
  join_approval_required?: boolean;
  max_members?: number;
  member_count?: number;
  is_member?: boolean;
  moderator_ids?: string[];
  rules?: string[];
  created_by: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Notification communautaire
 */
export interface CommunityNotification {
  id: string;
  user_id: string;
  type: 'comment' | 'reaction' | 'mention' | 'follow' | 'group_invite';
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Follow utilisateur
 */
export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

/**
 * Stats de follow
 */
export interface FollowStats {
  followersCount: number;
  followingCount: number;
}
