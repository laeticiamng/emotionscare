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
export type ReactionType = 'like' | 'love' | 'support' | 'celebrate';

/**
 * Post de communauté
 */
export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[];
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

/**
 * Commentaire sur un post
 */
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  moderation_status: ModerationStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Réaction sur un post
 */
export interface PostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}
