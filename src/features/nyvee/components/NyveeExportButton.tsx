/**
 * NyveeExportButton - Bouton d'export des données Nyvee
 */

import { memo, useState, useCallback } from 'react';
import { Download, FileJson, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useNyveeSessions, type NyveeSessionRecord } from '@/modules/nyvee/hooks/useNyveeSessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface NyveeExportButtonProps {
  className?: string;
}

export const NyveeExportButton = memo(({ className }: NyveeExportButtonProps) => {
  const { sessions, stats } = useNyveeSessions();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const formatSessionForExport = useCallback((session: NyveeSessionRecord) => ({
    id: session.id,
    date: format(new Date(session.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
    intensite: session.intensity,
    cycles_completes: session.cycles_completed,
    cycles_cible: session.target_cycles,
    humeur_avant: session.mood_before,
    humeur_apres: session.mood_after,
    evolution_humeur: session.mood_delta,
    badge: session.badge_earned,
    duree_secondes: session.session_duration,
    complete: session.completed,
  }), []);

  const exportCSV = useCallback(async () => {
    setIsExporting(true);
    try {
      const headers = [
        'ID',
        'Date',
        'Intensité',
        'Cycles complétés',
        'Cycles cible',
        'Humeur avant',
        'Humeur après',
        'Évolution humeur',
        'Badge',
        'Durée (s)',
        'Complétée',
      ];

      const rows = sessions.map(session => {
        const formatted = formatSessionForExport(session);
        return [
          formatted.id,
          formatted.date,
          formatted.intensite,
          formatted.cycles_completes,
          formatted.cycles_cible,
          formatted.humeur_avant ?? '',
          formatted.humeur_apres ?? '',
          formatted.evolution_humeur ?? '',
          formatted.badge,
          formatted.duree_secondes,
          formatted.complete ? 'Oui' : 'Non',
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nyvee-sessions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast({ title: 'Export CSV réussi', description: `${sessions.length} sessions exportées` });
    } catch (error) {
      toast({ title: 'Erreur lors de l\'export', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  }, [sessions, formatSessionForExport, toast]);

  const exportJSON = useCallback(async () => {
    setIsExporting(true);
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        stats: stats,
        sessions: sessions.map(formatSessionForExport),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nyvee-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast({ title: 'Export JSON réussi', description: `${sessions.length} sessions exportées` });
    } catch (error) {
      toast({ title: 'Erreur lors de l\'export', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  }, [sessions, stats, formatSessionForExport, toast]);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NyveeExportButton.displayName = 'NyveeExportButton';

export default NyveeExportButton;
