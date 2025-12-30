/**
 * Hook pour la gestion des follows
 */

import { useState, useEffect, useCallback } from 'react';
import { CommunityFollowService, FollowStats } from '@/modules/community/services';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseFollowReturn {
  isFollowing: boolean;
  loading: boolean;
  stats: FollowStats;
  toggleFollow: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useFollow(targetUserId: string): UseFollowReturn {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FollowStats>({ followersCount: 0, followingCount: 0 });
  const { toast } = useToast();

  const checkFollowStatus = useCallback(async () => {
    try {
      const following = await CommunityFollowService.isFollowing(targetUserId);
      setIsFollowing(following);
    } catch (err) {
      console.error('Failed to check follow status:', err);
    }
  }, [targetUserId]);

  const loadStats = useCallback(async () => {
    try {
      const s = await CommunityFollowService.getFollowStats(targetUserId);
      setStats(s);
    } catch (err) {
      console.error('Failed to load follow stats:', err);
    }
  }, [targetUserId]);

  const toggleFollow = useCallback(async () => {
    try {
      setLoading(true);

      if (isFollowing) {
        await CommunityFollowService.unfollowUser(targetUserId);
        setIsFollowing(false);
        setStats(prev => ({
          ...prev,
          followersCount: Math.max(0, prev.followersCount - 1)
        }));
        toast({
          title: 'Abonnement retiré',
          description: 'Vous ne suivez plus cet utilisateur.'
        });
      } else {
        await CommunityFollowService.followUser(targetUserId);
        setIsFollowing(true);
        setStats(prev => ({
          ...prev,
          followersCount: prev.followersCount + 1
        }));
        toast({
          title: 'Abonné !',
          description: 'Vous suivez maintenant cet utilisateur.'
        });
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Action impossible.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [isFollowing, targetUserId, toast]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([checkFollowStatus(), loadStats()]);
      setLoading(false);
    };

    if (targetUserId) {
      init();
    }
  }, [targetUserId, checkFollowStatus, loadStats]);

  return {
    isFollowing,
    loading,
    stats,
    toggleFollow,
    refreshStats: loadStats
  };
}

/**
 * Hook pour les statistiques de l'utilisateur courant
 */
export function useMyFollowStats() {
  const [stats, setStats] = useState<FollowStats>({ followersCount: 0, followingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const s = await CommunityFollowService.getFollowStats(user.id);
        setStats(s);
      } catch (err) {
        console.error('Failed to load my follow stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading };
}
