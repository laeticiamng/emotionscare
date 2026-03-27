// @ts-nocheck
/**
 * Hook pour les logs d'audit B2B
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';
import type { B2BAuditLog } from '@/features/b2b/types';

export interface B2BAuditData {
  logs: B2BAuditLog[];
  totalLogs: number;
  recentActions: string[];
  topActors: { email: string; count: number }[];
}

const DEFAULT_DATA: B2BAuditData = {
  logs: [],
  totalLogs: 0,
  recentActions: [],
  topActors: [],
};

async function fetchAuditLogs(orgId: string, limit = 100): Promise<B2BAuditData> {
  try {
    const { data: logsData, error, count } = await supabase
      .from('b2b_audit_logs')
      .select('*', { count: 'exact' })
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      logger.warn('Audit logs fetch error', error.message);
      return DEFAULT_DATA;
    }

    const logs: B2BAuditLog[] = (logsData || []).map(log => ({
      id: log.id,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      userId: log.user_id,
      userEmail: log.user_email || 'Utilisateur inconnu',
      details: log.details || {},
      createdAt: log.created_at
    }));

    // Analyser les actions récentes uniques
    const recentActions = [...new Set(logs.slice(0, 20).map(l => l.action))];

    // Top acteurs
    const actorCounts = logs.reduce((acc, log) => {
      acc[log.userEmail] = (acc[log.userEmail] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActors = Object.entries(actorCounts)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      logs,
      totalLogs: count || logs.length,
      recentActions,
      topActors,
    };
  } catch (error) {
    logger.error('Error fetching audit logs', error as Error, 'B2B');
    return DEFAULT_DATA;
  }
}

export function useB2BAudit(limit = 100) {
  const { user } = useAuth();
  const { toast } = useToast();
  const orgId = user?.user_metadata?.org_id as string | undefined;

  const query = useQuery({
    queryKey: ['b2b-audit', orgId, limit],
    queryFn: () => fetchAuditLogs(orgId!, limit),
    enabled: !!orgId,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const exportMutation = useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate?: string; endDate?: string }) => {
      const { data, error } = await supabase.functions.invoke('b2b-audit-export', {
        body: { startDate, endDate }
      });

      if (error) throw error;
      return data.downloadUrl as string;
    },
    onSuccess: (url) => {
      window.open(url, '_blank');
      toast({ title: 'Export prêt', description: 'Le téléchargement des logs d\'audit va commencer' });
    },
    onError: (error) => {
      toast({ title: 'Erreur', description: 'Impossible d\'exporter les logs', variant: 'destructive' });
      logger.error('Export audit error', error as Error, 'B2B');
    }
  });

  return {
    data: query.data || DEFAULT_DATA,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    exportLogs: exportMutation.mutate,
    isExporting: exportMutation.isPending,
  };
}
