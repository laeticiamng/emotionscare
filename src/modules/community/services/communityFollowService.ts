/**
 * Service pour la gestion des follows entre utilisateurs
 */

import { supabase } from '@/integrations/supabase/client';

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export class CommunityFollowService {
  /**
   * Suivre un utilisateur
   */
  static async followUser(targetUserId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_follows')
      .insert({
        follower_id: user.id,
        following_id: targetUserId
      });

    if (error) throw error;
  }

  /**
   * Ne plus suivre un utilisateur
   */
  static async unfollowUser(targetUserId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (error) throw error;
  }

  /**
   * Vérifier si l'utilisateur courant suit un autre utilisateur
   */
  static async isFollowing(targetUserId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  /**
   * Récupérer les followers d'un utilisateur
   */
  static async getFollowers(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_follows')
      .select('follower_id')
      .eq('following_id', userId);

    if (error) throw error;
    return (data || []).map(f => f.follower_id);
  }

  /**
   * Récupérer les utilisateurs suivis
   */
  static async getFollowing(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId);

    if (error) throw error;
    return (data || []).map(f => f.following_id);
  }

  /**
   * Récupérer les statistiques de follow
   */
  static async getFollowStats(userId: string): Promise<FollowStats> {
    const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
      supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId),
      supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId)
    ]);

    return {
      followersCount: followersCount || 0,
      followingCount: followingCount || 0
    };
  }
}
