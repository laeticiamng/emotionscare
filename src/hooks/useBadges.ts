import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGamificationStore, Badge } from '@/store/gamification.store';

interface BadgesResponse {
  unlocked: Badge[];
  locked: Badge[];
}

export const useBadges = () => {
  const { badges, setBadges, setError } = useGamificationStore();

  const { data, error, isFetching } = useQuery({
    queryKey: ['gamification', 'badges'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('gamification-badges');
      if (error) throw error;
      return data as BadgesResponse;
    },
    staleTime: 10 * 60 * 1000, // 10 min cache (badges change less frequently)
    refetchInterval: 10 * 60 * 1000,
  });

  // Update store when data changes
  useEffect(() => {
    if (data) {
      setBadges(data);
    }
  }, [data, setBadges]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  // Redeem a badge (if applicable)
  const redeemBadge = async (badgeId: string) => {
    try {
      const { error } = await supabase.functions.invoke('gamification-redeem', {
        body: { badge_id: badgeId }
      });

      if (error) throw error;

      // Refetch badges to update state
      // The query will automatically update due to cache invalidation
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'gami_badge_redeem', {
          custom_badge_id: badgeId
        });
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de récupération');
      return false;
    }
  };

  // View badge analytics
  const viewBadge = (badgeId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gami_badge_view', {
        custom_badge_id: badgeId
      });
    }
  };

  return {
    badges,
    loading: isFetching,
    error,
    redeemBadge,
    viewBadge,
  };
};