// @ts-nocheck
import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MoodHistoryEntry {
  id: string;
  userId: string;
  sessionId?: string;
  moodSnapshot: {
    energy: number;
    calm: number;
    joy: number;
    focus: number;
    comfort: number;
    serenity: number;
  };
  presetUsed?: string;
  notes?: string;
  duration: number;
  satisfaction?: number;
  createdAt: string;
}

export interface MoodTrend {
  date: string;
  avgEnergy: number;
  avgCalm: number;
  avgJoy: number;
  avgFocus: number;
  avgComfort: number;
  avgSerenity: number;
  sessionsCount: number;
}

export interface UseMoodHistoryReturn {
  history: MoodHistoryEntry[];
  isLoading: boolean;
  trends: MoodTrend[];
  weeklyStats: {
    totalSessions: number;
    avgDuration: number;
    avgSatisfaction: number;
    mostUsedPreset: string | null;
  };
  addHistoryEntry: (entry: Omit<MoodHistoryEntry, 'id' | 'createdAt'>) => void;
  deleteEntry: (id: string) => void;
  getEntriesForPeriod: (startDate: Date, endDate: Date) => MoodHistoryEntry[];
}

export function useMoodHistory(userId?: string): UseMoodHistoryReturn {
  const queryClient = useQueryClient();

  const { data: rawHistory = [], isLoading } = useQuery({
    queryKey: ['mood-mixer-full-history', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('mood_mixer_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Erreur chargement historique:', error);
        return [];
      }

      return (data || []).map(session => ({
        id: session.id,
        userId: session.user_id,
        sessionId: session.id,
        moodSnapshot: session.components_snapshot || {
          energy: 50, calm: 50, joy: 50, focus: 50, comfort: 50, serenity: 50
        },
        presetUsed: session.preset_used,
        notes: session.notes,
        duration: session.duration || 0,
        satisfaction: session.satisfaction,
        createdAt: session.created_at,
      })) as MoodHistoryEntry[];
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  const history = useMemo(() => rawHistory, [rawHistory]);

  const trends = useMemo((): MoodTrend[] => {
    const last30Days = history.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    const byDate: Record<string, MoodHistoryEntry[]> = {};
    last30Days.forEach(entry => {
      const date = entry.createdAt.split('T')[0];
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(entry);
    });

    return Object.entries(byDate).map(([date, entries]) => ({
      date,
      avgEnergy: entries.reduce((sum, e) => sum + (e.moodSnapshot.energy || 0), 0) / entries.length,
      avgCalm: entries.reduce((sum, e) => sum + (e.moodSnapshot.calm || 0), 0) / entries.length,
      avgJoy: entries.reduce((sum, e) => sum + (e.moodSnapshot.joy || 0), 0) / entries.length,
      avgFocus: entries.reduce((sum, e) => sum + (e.moodSnapshot.focus || 0), 0) / entries.length,
      avgComfort: entries.reduce((sum, e) => sum + (e.moodSnapshot.comfort || 0), 0) / entries.length,
      avgSerenity: entries.reduce((sum, e) => sum + (e.moodSnapshot.serenity || 0), 0) / entries.length,
      sessionsCount: entries.length,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [history]);

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekEntries = history.filter(entry => 
      new Date(entry.createdAt) >= weekAgo
    );

    const presetCounts: Record<string, number> = {};
    weekEntries.forEach(entry => {
      if (entry.presetUsed) {
        presetCounts[entry.presetUsed] = (presetCounts[entry.presetUsed] || 0) + 1;
      }
    });

    const mostUsedPreset = Object.entries(presetCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const satisfactionEntries = weekEntries.filter(e => e.satisfaction !== undefined);

    return {
      totalSessions: weekEntries.length,
      avgDuration: weekEntries.length > 0 
        ? Math.round(weekEntries.reduce((sum, e) => sum + e.duration, 0) / weekEntries.length)
        : 0,
      avgSatisfaction: satisfactionEntries.length > 0
        ? Math.round((satisfactionEntries.reduce((sum, e) => sum + (e.satisfaction || 0), 0) / satisfactionEntries.length) * 10) / 10
        : 0,
      mostUsedPreset,
    };
  }, [history]);

  const addEntryMutation = useMutation({
    mutationFn: async (entry: Omit<MoodHistoryEntry, 'id' | 'createdAt'>) => {
      if (!userId) throw new Error('User ID required');
      
      const { data, error } = await supabase
        .from('mood_mixer_sessions')
        .insert({
          user_id: entry.userId,
          components_snapshot: entry.moodSnapshot,
          preset_used: entry.presetUsed,
          notes: entry.notes,
          duration: entry.duration,
          satisfaction: entry.satisfaction,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-full-history', userId] });
      toast.success('Entrée ajoutée à l\'historique');
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout à l\'historique');
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mood_mixer_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-mixer-full-history', userId] });
      toast.success('Entrée supprimée');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  const addHistoryEntry = useCallback((entry: Omit<MoodHistoryEntry, 'id' | 'createdAt'>) => {
    addEntryMutation.mutate(entry);
  }, [addEntryMutation]);

  const deleteEntry = useCallback((id: string) => {
    deleteEntryMutation.mutate(id);
  }, [deleteEntryMutation]);

  const getEntriesForPeriod = useCallback((startDate: Date, endDate: Date): MoodHistoryEntry[] => {
    return history.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }, [history]);

  return {
    history,
    isLoading,
    trends,
    weeklyStats,
    addHistoryEntry,
    deleteEntry,
    getEntriesForPeriod,
  };
}
