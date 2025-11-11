// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  id: string;
  pseudo_anonyme: string;
  total_badges: number;
  rank: number | null;
  monthly_badge: boolean;
  zones_completed: any[];
}

export const useLeaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myEntry, setMyEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const { data: topEntries, error: fetchError } = await supabase
        .from('user_leaderboard')
        .select('*')
        .order('rank', { ascending: true })
        .limit(100);

      if (fetchError) throw fetchError;

      setEntries(topEntries || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userEntry, error: userError } = await supabase
          .from('user_leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user entry:', userError);
        } else if (userEntry) {
          setMyEntry(userEntry);
        }
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMyEntry = async (totalBadges: number, zonesCompleted: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from('user_leaderboard')
        .select('id, pseudo_anonyme')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('user_leaderboard')
          .update({
            total_badges: totalBadges,
            zones_completed: zonesCompleted,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setMyEntry(data);
      } else {
        const { data: pseudoData, error: pseudoError } = await supabase
          .rpc('generate_anonymous_pseudo');

        if (pseudoError) throw pseudoError;

        const { data, error } = await supabase
          .from('user_leaderboard')
          .insert({
            user_id: user.id,
            pseudo_anonyme: pseudoData || `User${Math.floor(Math.random() * 9999)}`,
            total_badges: totalBadges,
            zones_completed: zonesCompleted
          })
          .select()
          .single();

        if (error) throw error;
        setMyEntry(data);
      }

      await supabase.functions.invoke('calculate-rankings');
      
      await fetchLeaderboard();
    } catch (err: any) {
      console.error('Error updating leaderboard entry:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_leaderboard'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    entries,
    myEntry,
    loading,
    error,
    updateMyEntry,
    refresh: fetchLeaderboard
  };
};
