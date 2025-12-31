/**
 * Hook pour exporter les sessions de méditation en CSV ou JSON
 */

import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MeditationExportSession {
  id: string;
  technique: string;
  duration: number;
  completed_duration: number | null;
  completed: boolean | null;
  mood_before: number | null;
  mood_after: number | null;
  mood_delta: number | null;
  with_guidance: boolean | null;
  with_music: boolean | null;
  created_at: string;
  completed_at: string | null;
}

interface ExportOptions {
  format: 'csv' | 'json';
  dateRange?: {
    from: Date;
    to: Date;
  };
  includeIncomplete?: boolean;
}

export function useMeditationExport() {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const fetchSessions = async (options: ExportOptions): Promise<MeditationExportSession[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    let query = supabase
      .from('meditation_sessions')
      .select('id, technique, duration, completed_duration, completed, mood_before, mood_after, mood_delta, with_guidance, with_music, created_at, completed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!options.includeIncomplete) {
      query = query.eq('completed', true);
    }

    if (options.dateRange) {
      query = query
        .gte('created_at', options.dateRange.from.toISOString())
        .lte('created_at', options.dateRange.to.toISOString());
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []) as MeditationExportSession[];
  };

  const toCSV = (sessions: MeditationExportSession[]): string => {
    if (sessions.length === 0) return '';

    const TECHNIQUE_LABELS: Record<string, string> = {
      'mindfulness': 'Pleine conscience',
      'breath-focus': 'Focus respiration',
      'body-scan': 'Scan corporel',
      'visualization': 'Visualisation',
      'loving-kindness': 'Bienveillance',
      'mantra': 'Mantra',
    };

    const headers = [
      'Date',
      'Heure',
      'Technique',
      'Durée prévue (min)',
      'Durée réelle (min)',
      'Complétée',
      'Humeur avant',
      'Humeur après',
      'Δ Humeur',
      'Avec guidance',
      'Avec musique',
    ];

    const rows = sessions.map(session => [
      format(new Date(session.created_at), 'dd/MM/yyyy', { locale: fr }),
      format(new Date(session.created_at), 'HH:mm', { locale: fr }),
      TECHNIQUE_LABELS[session.technique] || session.technique,
      Math.round(session.duration / 60).toString(),
      Math.round((session.completed_duration || 0) / 60).toString(),
      session.completed ? 'Oui' : 'Non',
      session.mood_before?.toString() || '',
      session.mood_after?.toString() || '',
      session.mood_delta?.toString() || '',
      session.with_guidance ? 'Oui' : 'Non',
      session.with_music ? 'Oui' : 'Non',
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';')),
    ].join('\n');

    return '\uFEFF' + csvContent; // BOM for Excel compatibility
  };

  const toJSON = (sessions: MeditationExportSession[]): string => {
    const formatted = sessions.map(session => ({
      date: session.created_at,
      technique: session.technique,
      duration_planned_seconds: session.duration,
      duration_actual_seconds: session.completed_duration,
      completed: session.completed,
      mood_before: session.mood_before,
      mood_after: session.mood_after,
      mood_delta: session.mood_delta,
      with_guidance: session.with_guidance,
      with_music: session.with_music,
      completed_at: session.completed_at,
    }));

    return JSON.stringify(formatted, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportSessions = useCallback(async (options: ExportOptions) => {
    setIsExporting(true);

    try {
      const sessions = await fetchSessions(options);

      if (sessions.length === 0) {
        toast({
          title: 'Aucune session',
          description: 'Aucune session de méditation à exporter',
          variant: 'destructive',
        });
        return;
      }

      const dateStr = format(new Date(), 'yyyy-MM-dd');

      if (options.format === 'csv') {
        const csv = toCSV(sessions);
        downloadFile(csv, `meditation-export-${dateStr}.csv`, 'text/csv;charset=utf-8');
      } else {
        const json = toJSON(sessions);
        downloadFile(json, `meditation-export-${dateStr}.json`, 'application/json');
      }

      toast({
        title: 'Export réussi',
        description: `${sessions.length} session(s) exportée(s) en ${options.format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les sessions',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  return {
    exportSessions,
    isExporting,
  };
}
