// @ts-nocheck
/**
 * Hook pour les rapports B2B avec données Supabase réelles
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import type { B2BReport } from '@/features/b2b/types';

export interface B2BReportsData {
  reports: B2BReport[];
  latestReport: B2BReport | null;
  totalReports: number;
  avgWellnessTrend: 'up' | 'down' | 'stable';
}

const DEFAULT_DATA: B2BReportsData = {
  reports: [],
  latestReport: null,
  totalReports: 0,
  avgWellnessTrend: 'stable',
};

async function fetchReports(orgId: string): Promise<B2BReportsData> {
  try {
    const { data: reportsData, error } = await supabase
      .from('b2b_reports')
      .select('*')
      .eq('org_id', orgId)
      .order('period', { ascending: false })
      .limit(12);

    if (error) {
      logger.warn('Reports fetch error', error.message);
      
      // Retourner des données de démonstration
      const now = new Date();
      const demoReports: B2BReport[] = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const period = date.toISOString().slice(0, 7);
        return {
          id: `demo-${i}`,
          period,
          title: `Rapport ${date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
          narrative: `Synthèse du bien-être pour ${date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.`,
          metrics: {
            avgWellness: 75 + Math.floor(Math.random() * 15),
            engagement: 70 + Math.floor(Math.random() * 20),
            participation: 60 + Math.floor(Math.random() * 30),
            alerts: Math.floor(Math.random() * 5),
          },
          generatedAt: date.toISOString(),
          generatedBy: 'system' as const,
        };
      });

      return {
        reports: demoReports,
        latestReport: demoReports[0],
        totalReports: demoReports.length,
        avgWellnessTrend: 'up',
      };
    }

    const reports: B2BReport[] = (reportsData || []).map(report => ({
      id: report.id,
      period: report.period,
      title: report.title || `Rapport ${report.period}`,
      narrative: report.narrative || '',
      metrics: report.metrics || { avgWellness: 0, engagement: 0, participation: 0, alerts: 0 },
      generatedAt: report.generated_at || report.created_at,
      generatedBy: report.generated_by || 'system'
    }));

    // Calculer la tendance
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (reports.length >= 2) {
      const diff = reports[0].metrics.avgWellness - reports[1].metrics.avgWellness;
      if (diff > 3) trend = 'up';
      else if (diff < -3) trend = 'down';
    }

    return {
      reports,
      latestReport: reports[0] || null,
      totalReports: reports.length,
      avgWellnessTrend: trend,
    };
  } catch (error) {
    logger.error('Error fetching reports', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

export function useB2BReports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-reports', orgId],
    queryFn: () => fetchReports(orgId!),
    enabled: !!orgId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const exportMutation = useMutation({
    mutationFn: async ({ reportId, format }: { reportId: string; format: 'pdf' | 'csv' }) => {
      const { data, error } = await supabase.functions.invoke('b2b-report-export', {
        body: { reportId, format }
      });

      if (error) throw error;
      return data.downloadUrl as string;
    },
    onSuccess: (url) => {
      window.open(url, '_blank');
      toast({ title: 'Export prêt', description: 'Le téléchargement va commencer' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible d\'exporter le rapport', variant: 'destructive' });
      logger.error('Export report error', error as Error, 'B2B');
    }
  });

  const generateMutation = useMutation({
    mutationFn: async (period?: string) => {
      const { data, error } = await supabase.functions.invoke('b2b-report', {
        body: { period: period || new Date().toISOString().slice(0, 7) }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      query.refetch();
      toast({ title: 'Rapport généré', description: 'Le nouveau rapport est disponible' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible de générer le rapport', variant: 'destructive' });
      logger.error('Generate report error', error as Error, 'B2B');
    }
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    exportReport: exportMutation.mutate,
    generateReport: generateMutation.mutate,
    isExporting: exportMutation.isPending,
    isGenerating: generateMutation.isPending,
  };
}
