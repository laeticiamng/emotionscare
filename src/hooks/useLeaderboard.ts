import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useGamificationStore, Scope, Period, LeaderboardEntry, MyGamification } from '@/store/gamification.store';

interface UseLeaderboardProps {
  scope: Scope;
  period: Period;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  next_cursor?: string;
  min_n?: number;
}

interface MyGamificationResponse extends MyGamification {}

export const useLeaderboard = ({ scope, period }: UseLeaderboardProps) => {
  const {
    myRank,
    entries,
    nextCursor,
    loading,
    error,
    setMyRank,
    setEntries,
    appendEntries,
    setLoading,
    setError,
    setNextCursor,
  } = useGamificationStore();

  // Fetch user's personal rank data
  const { data: myData, error: myError } = useQuery({
    queryKey: ['gamification', 'me', period],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('gamification-me', {
        body: { period }
      });
      if (error) throw error;
      return data as MyGamificationResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
    refetchInterval: 5 * 60 * 1000,
  });

  // Fetch leaderboard data
  const { data: leaderboardData, error: leaderboardError, isFetching } = useQuery({
    queryKey: ['leaderboard', scope, period],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('gamification-leaderboard', {
        body: { 
          scope, 
          period,
          cursor: undefined // Start fresh
        }
      });
      if (error) throw error;
      return data as LeaderboardResponse;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  // Update store when data changes
  useEffect(() => {
    if (myData) {
      setMyRank(myData);
    }
  }, [myData, setMyRank]);

  useEffect(() => {
    if (leaderboardData) {
      setEntries(leaderboardData.entries);
      setNextCursor(leaderboardData.next_cursor || null);
    }
  }, [leaderboardData, setEntries, setNextCursor]);

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  useEffect(() => {
    const errorMsg = myError?.message || leaderboardError?.message || null;
    setError(errorMsg);
  }, [myError, leaderboardError, setError]);

  // Fetch more entries for pagination
  const fetchNext = async () => {
    if (!nextCursor || loading) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('gamification-leaderboard', {
        body: { 
          scope, 
          period,
          cursor: nextCursor
        }
      });

      if (error) throw error;

      const response = data as LeaderboardResponse;
      appendEntries(response.entries);
      setNextCursor(response.next_cursor || null);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'gami_leaderboard_page', {
          custom_cursor: nextCursor
        });
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Analytics on view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'gami_leaderboard_view', {
        custom_scope: scope,
        custom_period: period
      });
    }
  }, [scope, period]);

  return {
    me: myRank,
    leaderboard: entries,
    next: nextCursor,
    loading,
    error,
    fetchNext,
  };
};