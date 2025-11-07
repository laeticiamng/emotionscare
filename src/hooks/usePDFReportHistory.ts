// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface PDFReport {
  id: string;
  user_id: string;
  report_type: 'audit' | 'violations' | 'dsar' | 'full';
  report_version: number;
  title: string;
  file_url: string | null;
  file_size: number | null;
  metadata: any;
  score_global: number | null;
  created_at: string;
}

interface PDFReportSchedule {
  id: string;
  report_type: string;
  recipient_emails: string[];
  schedule_cron: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  options: any;
  created_at: string;
  updated_at: string;
}

export const usePDFReportHistory = (reportType?: string) => {
  const [reports, setReports] = useState<PDFReport[]>([]);
  const [schedules, setSchedules] = useState<PDFReportSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('pdf_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportType) {
        query = query.eq('report_type', reportType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setReports(data || []);
      logger.info('PDF reports fetched', { count: data?.length }, 'GDPR');
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors du chargement des rapports';
      setError(errorMsg);
      logger.error('Error fetching PDF reports', { error: err }, 'GDPR');
      toast({
        title: 'Erreur',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [reportType]);

  const fetchSchedules = useCallback(async () => {
    try {
      let query = supabase
        .from('pdf_report_schedules')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportType) {
        query = query.eq('report_type', reportType);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setSchedules(data || []);
    } catch (err: any) {
      logger.error('Error fetching schedules', { error: err }, 'GDPR');
    }
  }, [reportType]);

  const deleteReport = useCallback(async (reportId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('pdf_reports')
        .delete()
        .eq('id', reportId);

      if (deleteError) throw deleteError;

      setReports((prev) => prev.filter((r) => r.id !== reportId));
      
      toast({
        title: 'Rapport supprimé',
        description: 'Le rapport a été supprimé avec succès',
      });

      logger.info('PDF report deleted', { reportId }, 'GDPR');
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors de la suppression';
      logger.error('Error deleting report', { error: err }, 'GDPR');
      toast({
        title: 'Erreur',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, []);

  const createSchedule = useCallback(
    async (scheduleData: Omit<PDFReportSchedule, 'id' | 'created_at' | 'updated_at' | 'last_run_at'>) => {
      try {
        const { data, error: insertError } = await supabase
          .from('pdf_report_schedules')
          .insert(scheduleData)
          .select()
          .single();

        if (insertError) throw insertError;

        setSchedules((prev) => [data, ...prev]);
        
        toast({
          title: 'Planification créée',
          description: 'Les rapports seront envoyés automatiquement selon le planning',
        });

        logger.info('Schedule created', { scheduleId: data.id }, 'GDPR');
        return data;
      } catch (err: any) {
        const errorMsg = err.message || 'Erreur lors de la création de la planification';
        logger.error('Error creating schedule', { error: err }, 'GDPR');
        toast({
          title: 'Erreur',
          description: errorMsg,
          variant: 'destructive',
        });
        throw err;
      }
    },
    []
  );

  const updateSchedule = useCallback(
    async (scheduleId: string, updates: Partial<PDFReportSchedule>) => {
      try {
        const { data, error: updateError } = await supabase
          .from('pdf_report_schedules')
          .update(updates)
          .eq('id', scheduleId)
          .select()
          .single();

        if (updateError) throw updateError;

        setSchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? data : s))
        );

        toast({
          title: 'Planification mise à jour',
          description: 'Les modifications ont été enregistrées',
        });

        logger.info('Schedule updated', { scheduleId }, 'GDPR');
      } catch (err: any) {
        const errorMsg = err.message || 'Erreur lors de la mise à jour';
        logger.error('Error updating schedule', { error: err }, 'GDPR');
        toast({
          title: 'Erreur',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    },
    []
  );

  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('pdf_report_schedules')
        .delete()
        .eq('id', scheduleId);

      if (deleteError) throw deleteError;

      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      
      toast({
        title: 'Planification supprimée',
        description: 'La planification a été supprimée avec succès',
      });

      logger.info('Schedule deleted', { scheduleId }, 'GDPR');
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors de la suppression';
      logger.error('Error deleting schedule', { error: err }, 'GDPR');
      toast({
        title: 'Erreur',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, []);

  const compareReports = useCallback((report1: PDFReport, report2: PDFReport) => {
    // Comparaison des scores
    const scoreDiff = report2.score_global && report1.score_global 
      ? report2.score_global - report1.score_global 
      : null;

    const timeDiff = new Date(report2.created_at).getTime() - new Date(report1.created_at).getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return {
      scoreDifference: scoreDiff,
      scoreImproved: scoreDiff ? scoreDiff > 0 : null,
      timeDifference: daysDiff,
      versionDifference: report2.report_version - report1.report_version,
      olderReport: report1,
      newerReport: report2,
    };
  }, []);

  useEffect(() => {
    fetchReports();
    fetchSchedules();
  }, [fetchReports, fetchSchedules]);

  return {
    reports,
    schedules,
    isLoading,
    error,
    fetchReports,
    fetchSchedules,
    deleteReport,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    compareReports,
  };
};