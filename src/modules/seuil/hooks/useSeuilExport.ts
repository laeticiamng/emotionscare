/**
 * Hook pour l'export des données SEUIL
 */
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { SeuilEvent, SeuilZone } from '../types';

const ZONE_LABELS: Record<SeuilZone, string> = {
  low: 'Basse',
  intermediate: 'Intermédiaire',
  critical: 'Critique',
  closure: 'Clôture',
};

export function useSeuilExport() {
  const { user } = useAuth();
  const { toast } = useToast();

  const exportJSON = useCallback(async () => {
    if (!user?.id) {
      toast({ title: 'Non connecté', variant: 'destructive' });
      return;
    }

    // Fetch ALL events without limit
    const { data, error } = await supabase
      .from('seuil_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      toast({ title: 'Aucune donnée', description: 'Pas de données à exporter.', variant: 'destructive' });
      return;
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: user.email || 'unknown',
      totalEvents: data.length,
      events: data.map(e => ({
        date: e.created_at,
        level: e.threshold_level,
        zone: e.zone,
        zoneLabel: ZONE_LABELS[e.zone as SeuilZone] || e.zone,
        action: e.action_type,
        completed: e.session_completed,
        notes: e.notes,
      })),
      summary: {
        averageLevel: data.reduce((s, e) => s + e.threshold_level, 0) / data.length,
        completionRate: (data.filter(e => e.session_completed).length / data.length) * 100,
        zoneDistribution: {
          low: data.filter(e => e.zone === 'low').length,
          intermediate: data.filter(e => e.zone === 'intermediate').length,
          critical: data.filter(e => e.zone === 'critical').length,
          closure: data.filter(e => e.zone === 'closure').length,
        },
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seuil-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Export réussi', description: `${data.length} sessions exportées.` });
  }, [user, toast]);

  const exportCSV = useCallback(async () => {
    if (!user?.id) {
      toast({ title: 'Non connecté', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase
      .from('seuil_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      toast({ title: 'Aucune donnée', variant: 'destructive' });
      return;
    }

    const headers = ['Date', 'Heure', 'Niveau', 'Zone', 'Action', 'Complétée', 'Notes'];
    const rows = data.map(e => [
      format(new Date(e.created_at), 'dd/MM/yyyy'),
      format(new Date(e.created_at), 'HH:mm'),
      e.threshold_level,
      ZONE_LABELS[e.zone as SeuilZone] || e.zone,
      e.action_type || '',
      e.session_completed ? 'Oui' : 'Non',
      e.notes || '',
    ]);

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seuil-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Export CSV réussi', description: `${data.length} sessions exportées.` });
  }, [user, toast]);

  return { exportJSON, exportCSV };
}
