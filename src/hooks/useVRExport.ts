/**
 * Hook pour exporter les données VR
 */

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VRExportSession {
  id: string;
  date: string;
  scene: string;
  pattern: string;
  duration_minutes: number;
  cycles: number;
  coherence_score: number | null;
  hrv_delta: number | null;
}

export function useVRExport() {
  const { toast } = useToast();

  const fetchAllSessions = useCallback(async (): Promise<VRExportSession[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Export fetch error:', error);
      return [];
    }

    return (data || []).map(s => ({
      id: s.id,
      date: new Date(s.created_at).toLocaleString('fr-FR'),
      scene: s.scene,
      pattern: s.breathing_pattern,
      duration_minutes: Math.round((s.duration_s || 0) / 60 * 10) / 10,
      cycles: s.cycles_completed || 0,
      coherence_score: s.coherence_score,
      hrv_delta: s.rmssd_delta,
    }));
  }, []);

  const exportJSON = useCallback(async () => {
    try {
      const sessions = await fetchAllSessions();
      
      if (sessions.length === 0) {
        toast({
          title: 'Aucune donnée',
          description: 'Pas de sessions VR à exporter.',
          variant: 'destructive',
        });
        return;
      }

      const exportData = {
        export_date: new Date().toISOString(),
        total_sessions: sessions.length,
        sessions,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-vr-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${sessions.length} sessions exportées en JSON.`,
      });
    } catch (err) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données.',
        variant: 'destructive',
      });
    }
  }, [fetchAllSessions, toast]);

  const exportCSV = useCallback(async () => {
    try {
      const sessions = await fetchAllSessions();
      
      if (sessions.length === 0) {
        toast({
          title: 'Aucune donnée',
          description: 'Pas de sessions VR à exporter.',
          variant: 'destructive',
        });
        return;
      }

      const headers = ['Date', 'Scène', 'Pattern', 'Durée (min)', 'Cycles', 'Cohérence', 'Delta HRV'];
      const rows = sessions.map(s => [
        s.date,
        s.scene,
        s.pattern,
        s.duration_minutes.toString(),
        s.cycles.toString(),
        s.coherence_score?.toString() || 'N/A',
        s.hrv_delta?.toString() || 'N/A',
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-vr-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `${sessions.length} sessions exportées en CSV.`,
      });
    } catch (err) {
      toast({
        title: 'Erreur d\'export',
        description: 'Impossible d\'exporter les données.',
        variant: 'destructive',
      });
    }
  }, [fetchAllSessions, toast]);

  return {
    exportJSON,
    exportCSV,
  };
}
