import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface AuditTrailEntry {
  id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  affected_user_id: string | null;
  changes: any;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface AuditFilters {
  startDate?: string;
  endDate?: string;
  actionType?: string;
  entityType?: string;
  userId?: string;
}

interface AuditStatistics {
  totalActions: number;
  byActionType: Record<string, number>;
  byEntityType: Record<string, number>;
  recentActivityRate: number; // actions dans les dernières 24h
}

/**
 * Hook pour gérer l'audit trail RGPD
 */
export const useGDPRAuditTrail = (filters: AuditFilters = {}) => {
  const [entries, setEntries] = useState<AuditTrailEntry[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuditTrail = async () => {
    try {
      setIsLoading(true);

      // Construire la requête avec filtres
      let query = supabase
        .from('gdpr_audit_trail')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      // Appliquer les filtres
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      if (filters.entityType) {
        query = query.eq('entity_type', filters.entityType);
      }
      if (filters.userId) {
        query = query.or(`user_id.eq.${filters.userId},affected_user_id.eq.${filters.userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEntries(data || []);

      // Calculer les statistiques
      if (data && data.length > 0) {
        const stats = calculateStatistics(data);
        setStatistics(stats);
      } else {
        setStatistics({
          totalActions: 0,
          byActionType: {},
          byEntityType: {},
          recentActivityRate: 0,
        });
      }

      logger.debug(`Loaded ${data?.length || 0} audit trail entries`, undefined, 'GDPR');
    } catch (error) {
      logger.error('Error fetching GDPR audit trail', error as Error, 'GDPR');
      setEntries([]);
      setStatistics(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditTrail();
  }, [filters.startDate, filters.endDate, filters.actionType, filters.entityType, filters.userId]);

  // S'abonner aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('gdpr-audit-trail-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gdpr_audit_trail',
        },
        (payload) => {
          const newEntry = payload.new as AuditTrailEntry;
          setEntries((prev) => [newEntry, ...prev].slice(0, 500));
          
          // Mettre à jour les statistiques
          if (statistics) {
            setStatistics({
              ...statistics,
              totalActions: statistics.totalActions + 1,
              byActionType: {
                ...statistics.byActionType,
                [newEntry.action_type]: (statistics.byActionType[newEntry.action_type] || 0) + 1,
              },
              byEntityType: {
                ...statistics.byEntityType,
                [newEntry.entity_type]: (statistics.byEntityType[newEntry.entity_type] || 0) + 1,
              },
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statistics]);

  return {
    entries,
    statistics,
    isLoading,
    refetch: fetchAuditTrail,
  };
};

/**
 * Calculer les statistiques d'audit
 */
function calculateStatistics(entries: AuditTrailEntry[]): AuditStatistics {
  const totalActions = entries.length;
  const byActionType: Record<string, number> = {};
  const byEntityType: Record<string, number> = {};

  // Calculer les actions des dernières 24h
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  const recent24h = entries.filter(
    (entry) => new Date(entry.created_at) >= oneDayAgo
  ).length;
  const recentActivityRate = totalActions > 0 ? (recent24h / totalActions) * 100 : 0;

  entries.forEach((entry) => {
    byActionType[entry.action_type] = (byActionType[entry.action_type] || 0) + 1;
    byEntityType[entry.entity_type] = (byEntityType[entry.entity_type] || 0) + 1;
  });

  return {
    totalActions,
    byActionType,
    byEntityType,
    recentActivityRate,
  };
}

/**
 * Logger manuellement une action d'audit
 */
export const logGDPRAudit = async (
  actionType: string,
  entityType: string,
  entityId?: string,
  affectedUserId?: string,
  changes?: any,
  metadata?: any
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('log_gdpr_audit', {
      p_action_type: actionType,
      p_entity_type: entityType,
      p_entity_id: entityId || null,
      p_affected_user_id: affectedUserId || null,
      p_changes: changes || null,
      p_metadata: metadata || null,
    });

    if (error) throw error;

    logger.debug(`Logged GDPR audit: ${actionType}`, { entityType, entityId }, 'GDPR');
    return true;
  } catch (error) {
    logger.error('Error logging GDPR audit', error as Error, 'GDPR');
    return false;
  }
};

/**
 * Exporter l'audit trail en CSV
 */
export const exportAuditTrailToCSV = (entries: AuditTrailEntry[]): void => {
  const headers = [
    'Date/Heure',
    'Action',
    'Type d\'entité',
    'ID Entité',
    'Utilisateur',
    'Utilisateur concerné',
    'Détails',
  ];

  const rows = entries.map((entry) => {
    const date = new Date(entry.created_at).toLocaleString('fr-FR');
    const details = entry.changes ? JSON.stringify(entry.changes) : '';

    return [
      date,
      entry.action_type,
      entry.entity_type,
      entry.entity_id || 'N/A',
      entry.user_id || 'N/A',
      entry.affected_user_id || 'N/A',
      `"${details.replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `audit-trail-rgpd-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  logger.info(`Exported ${entries.length} audit trail entries to CSV`, undefined, 'GDPR');
};
