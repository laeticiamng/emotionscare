/**
 * Hook pour l'export des sessions de coaching
 * Permet l'export en PDF/PNG des conversations et rapports
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  exportSessionToPDF,
  exportMultipleSessionsReport,
  type PDFExportOptions,
  type PDFExportResult
} from '../pdfExport';

export interface UseCoachExportOptions {
  onExportStart?: () => void;
  onExportComplete?: (result: PDFExportResult) => void;
  onExportError?: (error: string) => void;
}

export function useCoachExport(options: UseCoachExportOptions = {}) {
  const { onExportStart, onExportComplete, onExportError } = options;

  const [isExporting, setIsExporting] = useState(false);
  const [lastExportResult, setLastExportResult] = useState<PDFExportResult | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  // Exporter une session unique
  const exportSession = useCallback(async (
    sessionId: string,
    exportOptions: PDFExportOptions = {}
  ): Promise<PDFExportResult> => {
    setIsExporting(true);
    setExportProgress(10);
    onExportStart?.();

    try {
      setExportProgress(30);
      toast.loading('Préparation de l\'export...', { id: 'coach-export' });

      setExportProgress(50);
      const result = await exportSessionToPDF(sessionId, exportOptions);

      setExportProgress(90);

      if (result.success) {
        toast.success('Export réussi !', { id: 'coach-export' });
        setLastExportResult(result);
        onExportComplete?.(result);
      } else {
        toast.error(result.error || 'Erreur d\'export', { id: 'coach-export' });
        onExportError?.(result.error || 'Unknown error');
      }

      setExportProgress(100);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(errorMessage, { id: 'coach-export' });
      onExportError?.(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 500);
    }
  }, [onExportStart, onExportComplete, onExportError]);

  // Exporter un rapport multi-sessions
  const exportReport = useCallback(async (
    exportOptions: PDFExportOptions = {}
  ): Promise<PDFExportResult> => {
    setIsExporting(true);
    setExportProgress(10);
    onExportStart?.();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Non authentifié');
      }

      setExportProgress(30);
      toast.loading('Génération du rapport...', { id: 'coach-report' });

      setExportProgress(50);
      const result = await exportMultipleSessionsReport(user.id, exportOptions);

      setExportProgress(90);

      if (result.success) {
        toast.success('Rapport généré !', { id: 'coach-report' });
        setLastExportResult(result);
        onExportComplete?.(result);
      } else {
        toast.error(result.error || 'Erreur de génération', { id: 'coach-report' });
        onExportError?.(result.error || 'Unknown error');
      }

      setExportProgress(100);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(errorMessage, { id: 'coach-report' });
      onExportError?.(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 500);
    }
  }, [onExportStart, onExportComplete, onExportError]);

  // Exporter les sessions d'une période donnée
  const exportPeriod = useCallback(async (
    startDate: Date,
    endDate: Date,
    exportOptions: Omit<PDFExportOptions, 'dateRange'> = {}
  ): Promise<PDFExportResult> => {
    return exportReport({
      ...exportOptions,
      dateRange: { from: startDate, to: endDate }
    });
  }, [exportReport]);

  // Exporter les 7 derniers jours
  const exportLastWeek = useCallback(async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    return exportPeriod(startDate, endDate, {
      includeStats: true,
      includeEmotions: true,
      includeTechniques: true
    });
  }, [exportPeriod]);

  // Exporter le mois en cours
  const exportCurrentMonth = useCallback(async () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    
    return exportPeriod(startDate, endDate, {
      includeStats: true,
      includeEmotions: true,
      includeTechniques: true,
      includeResources: true
    });
  }, [exportPeriod]);

  // Télécharger le dernier export
  const downloadLastExport = useCallback(() => {
    if (lastExportResult?.downloadUrl && lastExportResult?.filename) {
      const link = document.createElement('a');
      link.href = lastExportResult.downloadUrl;
      link.download = lastExportResult.filename;
      link.click();
    } else {
      toast.error('Aucun export disponible');
    }
  }, [lastExportResult]);

  // Partager le dernier export
  const shareLastExport = useCallback(async () => {
    if (!lastExportResult?.downloadUrl) {
      toast.error('Aucun export à partager');
      return false;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rapport de Coaching EmotionsCare',
          text: 'Mon rapport de sessions de coaching IA',
          url: lastExportResult.downloadUrl
        });
        return true;
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(lastExportResult.downloadUrl);
        toast.success('Lien copié dans le presse-papier');
        return true;
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast.error('Erreur de partage');
      }
      return false;
    }
  }, [lastExportResult]);

  return {
    // État
    isExporting,
    exportProgress,
    lastExportResult,

    // Actions d'export
    exportSession,
    exportReport,
    exportPeriod,
    exportLastWeek,
    exportCurrentMonth,

    // Actions sur le dernier export
    downloadLastExport,
    shareLastExport,

    // Utilitaires
    hasExport: lastExportResult?.success ?? false
  };
}

export default useCoachExport;
