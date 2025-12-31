import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface BreathExportSession {
  id: string;
  created_at: string;
  duration_seconds: number;
  pattern: string;
  mood_before?: number | null;
  mood_after?: number | null;
  notes?: string | null;
  vr_mode?: boolean;
}

export interface BreathExportData {
  exportDate: string;
  user: string;
  sessions: BreathExportSession[];
  stats: {
    totalSessions: number;
    totalMinutes: number;
    averageDuration: number;
    favoritePattern: string;
    moodDeltaAverage: number | null;
  };
}

export const useBreathExport = () => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const fetchAllSessions = useCallback(async (): Promise<BreathExportSession[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
      .from('breathing_vr_sessions')
      .select('id, created_at, duration_seconds, pattern, mood_before, mood_after, notes, vr_mode')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }, []);

  const calculateStats = (sessions: BreathExportSession[]) => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        averageDuration: 0,
        favoritePattern: 'N/A',
        moodDeltaAverage: null,
      };
    }

    const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const averageDuration = Math.round(totalSeconds / sessions.length);

    // Find favorite pattern
    const patternCounts: Record<string, number> = {};
    sessions.forEach(s => {
      if (s.pattern) {
        patternCounts[s.pattern] = (patternCounts[s.pattern] || 0) + 1;
      }
    });
    const favoritePattern = Object.entries(patternCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate mood delta average
    const moodDeltas = sessions
      .filter(s => s.mood_before != null && s.mood_after != null)
      .map(s => (s.mood_after! - s.mood_before!));
    const moodDeltaAverage = moodDeltas.length > 0
      ? Math.round((moodDeltas.reduce((a, b) => a + b, 0) / moodDeltas.length) * 10) / 10
      : null;

    return {
      totalSessions: sessions.length,
      totalMinutes,
      averageDuration,
      favoritePattern,
      moodDeltaAverage,
    };
  };

  const exportAsJSON = useCallback(async () => {
    setExporting(true);
    try {
      const sessions = await fetchAllSessions();
      const { data: { user } } = await supabase.auth.getUser();

      const exportData: BreathExportData = {
        exportDate: new Date().toISOString(),
        user: user?.email || 'anonymous',
        sessions,
        stats: calculateStats(sessions),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `breath-sessions-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: 'Export réussi', description: `${sessions.length} sessions exportées en JSON.` });
      logger.info('breath:export:json', { count: sessions.length }, 'EXPORT');
    } catch (error) {
      logger.error('breath:export:json:error', error as Error, 'EXPORT');
      toast({ title: 'Erreur d\'export', description: 'Impossible d\'exporter les données.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  }, [fetchAllSessions, toast]);

  const exportAsCSV = useCallback(async () => {
    setExporting(true);
    try {
      const sessions = await fetchAllSessions();

      const headers = ['Date', 'Durée (sec)', 'Pattern', 'Humeur avant', 'Humeur après', 'Delta humeur', 'Mode VR', 'Notes'];
      const rows = sessions.map(s => [
        new Date(s.created_at).toLocaleString('fr-FR'),
        s.duration_seconds?.toString() || '0',
        s.pattern || '',
        s.mood_before?.toString() || '',
        s.mood_after?.toString() || '',
        (s.mood_before != null && s.mood_after != null) ? (s.mood_after - s.mood_before).toString() : '',
        s.vr_mode ? 'Oui' : 'Non',
        (s.notes || '').replace(/"/g, '""'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `breath-sessions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: 'Export réussi', description: `${sessions.length} sessions exportées en CSV.` });
      logger.info('breath:export:csv', { count: sessions.length }, 'EXPORT');
    } catch (error) {
      logger.error('breath:export:csv:error', error as Error, 'EXPORT');
      toast({ title: 'Erreur d\'export', description: 'Impossible d\'exporter les données.', variant: 'destructive' });
    } finally {
      setExporting(false);
    }
  }, [fetchAllSessions, toast]);

  return {
    exporting,
    exportAsJSON,
    exportAsCSV,
  };
};
