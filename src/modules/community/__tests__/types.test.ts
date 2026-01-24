/**
 * Tests pour les types du module Community
 */

import { describe, it, expect } from 'vitest';
import type {
  CommunityStats,
  ModerationStatus,
  ReactionType,
  CommunityPost,
  PostComment,
  PostReaction,
  CommunityGroup,
  CommunityNotification,
  UserFollow,
  FollowStats,
} from '../types';

describe('Community Types', () => {
  describe('CommunityStats', () => {
    it('should validate stats structure with required fields', () => {
      const stats: CommunityStats = {
        totalPosts: 150,
        totalComments: 430,
        totalLikes: 1250,
      };

      expect(stats.totalPosts).toBe(150);
      expect(stats.totalComments).toBe(430);
      expect(stats.totalLikes).toBe(1250);
    });

    it('should accept optional fields', () => {
      const stats: CommunityStats = {
        totalPosts: 10,
        totalComments: 20,
        totalLikes: 50,
        totalGroups: 5,
        totalMembers: 200,
        myPosts: 3,
        myComments: 8,
      };

      expect(stats.totalGroups).toBe(5);
      expect(stats.totalMembers).toBe(200);
      expect(stats.myPosts).toBe(3);
    });
  });

  describe('ModerationStatus', () => {
    it('should accept valid moderation statuses', () => {
      const statuses: ModerationStatus[] = ['pending', 'approved', 'rejected'];
      expect(statuses).toHaveLength(3);
      expect(statuses).toContain('pending');
      expect(statuses).toContain('approved');
      expect(statuses).toContain('rejected');
    });
  });

  describe('ReactionType', () => {
    it('should accept all valid reaction types', () => {
      const reactions: ReactionType[] = ['like', 'love', 'laugh', 'wow', 'care', 'support', 'celebrate'];
      expect(reactions).toHaveLength(7);
    });
  });

  describe('CommunityPost', () => {
    it('should validate post structure', () => {
      const post: CommunityPost = {
        id: 'post-123',
        user_id: 'user-456',
        title: 'Mon premier post',
        content: 'Contenu du post...',
        tags: ['santé', 'bien-être'],
        moderation_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 42,
        comments_count: 7,
      };

      expect(post.id).toBeDefined();
      expect(post.title).toBe('Mon premier post');
      expect(post.tags).toContain('santé');
      expect(post.moderation_status).toBe('approved');
    });

    it('should accept optional author info', () => {
      const post: CommunityPost = {
        id: 'post-abc',
        user_id: 'user-xyz',
        title: 'Post avec auteur',
        content: 'Contenu',
        tags: [],
        moderation_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        author: {
          id: 'author-1',
          full_name: 'Jean Dupont',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      };

      expect(post.author?.full_name).toBe('Jean Dupont');
    });

    it('should handle anonymous posts', () => {
      const post: CommunityPost = {
        id: 'post-anon',
        user_id: 'user-hidden',
        title: 'Post anonyme',
        content: 'Je veux rester anonyme',
        tags: ['anonyme'],
        moderation_status: 'approved',
        is_anonymous: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes_count: 5,
        comments_count: 2,
      };

      expect(post.is_anonymous).toBe(true);
    });
  });

  describe('PostComment', () => {
    it('should validate comment structure', () => {
      const comment: PostComment = {
        id: 'comment-1',
        post_id: 'post-123',
        user_id: 'user-456',
        content: 'Super post !',
        moderation_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(comment.post_id).toBe('post-123');
      expect(comment.content).toBe('Super post !');
    });

    it('should support nested comments', () => {
      const reply: PostComment = {
        id: 'comment-2',
        post_id: 'post-123',
        user_id: 'user-789',
        content: 'Je suis d\'accord',
        parent_comment_id: 'comment-1',
        moderation_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(reply.parent_comment_id).toBe('comment-1');
    });
  });

  describe('PostReaction', () => {
    it('should validate reaction on post', () => {
      const reaction: PostReaction = {
        id: 'reaction-1',
        post_id: 'post-123',
        user_id: 'user-456',
        reaction_type: 'love',
        created_at: new Date().toISOString(),
      };

      expect(reaction.reaction_type).toBe('love');
      expect(reaction.post_id).toBe('post-123');
    });

    it('should support reaction on comment', () => {
      const reaction: PostReaction = {
        id: 'reaction-2',
        comment_id: 'comment-1',
        user_id: 'user-789',
        reaction_type: 'support',
        created_at: new Date().toISOString(),
      };

      expect(reaction.comment_id).toBe('comment-1');
      expect(reaction.post_id).toBeUndefined();
    });
  });

  describe('CommunityGroup', () => {
    it('should validate group structure', () => {
      const group: CommunityGroup = {
        id: 'group-1',
        name: 'Méditation Quotidienne',
        description: 'Groupe pour pratiquer ensemble',
        icon: '🧘',
        category: 'bien-être',
        is_private: false,
        member_count: 150,
        created_by: 'user-admin',
        created_at: new Date().toISOString(),
      };

      expect(group.name).toBe('Méditation Quotidienne');
      expect(group.is_private).toBe(false);
    });

    it('should handle private groups with approval', () => {
      const privateGroup: CommunityGroup = {
        id: 'group-private',
        name: 'Groupe Privé',
        is_private: true,
        join_approval_required: true,
        max_members: 50,
        moderator_ids: ['mod-1', 'mod-2'],
        rules: ['Respectez-vous', 'Pas de spam'],
        created_by: 'user-creator',
        created_at: new Date().toISOString(),
      };

      expect(privateGroup.is_private).toBe(true);
      expect(privateGroup.join_approval_required).toBe(true);
      expect(privateGroup.moderator_ids).toHaveLength(2);
    });
  });

  describe('CommunityNotification', () => {
    it('should validate notification structure', () => {
      const notification: CommunityNotification = {
        id: 'notif-1',
        user_id: 'user-123',
        type: 'comment',
        title: 'Nouveau commentaire',
        message: 'Jean a commenté votre post',
        is_read: false,
        created_at: new Date().toISOString(),
      };

      expect(notification.type).toBe('comment');
      expect(notification.is_read).toBe(false);
    });

    it('should support all notification types', () => {
      const types: CommunityNotification['type'][] = [
        'comment', 'reaction', 'mention', 'follow', 'group_invite'
      ];
      expect(types).toHaveLength(5);
    });
  });

  describe('UserFollow & FollowStats', () => {
    it('should validate follow relationship', () => {
      const follow: UserFollow = {
        id: 'follow-1',
        follower_id: 'user-a',
        following_id: 'user-b',
        created_at: new Date().toISOString(),
      };

      expect(follow.follower_id).toBe('user-a');
      expect(follow.following_id).toBe('user-b');
    });

    it('should validate follow stats', () => {
      const stats: FollowStats = {
        followersCount: 1500,
        followingCount: 200,
      };

      expect(stats.followersCount).toBeGreaterThan(stats.followingCount);
    });
  });
});
