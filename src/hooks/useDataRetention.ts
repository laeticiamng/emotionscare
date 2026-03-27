// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/use-toast';

export interface RetentionRule {
  id: string;
  entity_type: string;
  retention_days: number;
  archive_enabled: boolean;
  auto_delete_enabled: boolean;
  notification_days_before: number;
  created_at: string;
  updated_at: string;
}

export interface DataArchive {
  id: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  original_data: any;
  archived_at: string;
  expires_at: string;
  deleted_at?: string;
  reason?: string;
}

export interface RetentionNotification {
  id: string;
  user_id: string;
  entity_type: string;
  entities_count: number;
  expiration_date: string;
  notification_type: 'warning' | 'final_warning' | 'expired';
  sent_at: string;
  acknowledged: boolean;
  acknowledged_at?: string;
}

export interface RetentionStats {
  totalRules: number;
  activeArchives: number;
  pendingNotifications: number;
  totalArchived: number;
  deletedLastMonth: number;
  upcomingExpirations: number;
}

export const useDataRetention = () => {
  const [rules, setRules] = useState<RetentionRule[]>([]);
  const [archives, setArchives] = useState<DataArchive[]>([]);
  const [notifications, setNotifications] = useState<RetentionNotification[]>([]);
  const [stats, setStats] = useState<RetentionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch retention rules
  const fetchRules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('data_retention_rules')
        .select('*')
        .order('entity_type', { ascending: true });

      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      logger.error('Error fetching retention rules', error as Error, 'RETENTION');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les règles de rétention',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Fetch archives with filters
  const fetchArchives = useCallback(async (filters?: {
    entity_type?: string;
    user_id?: string;
    include_deleted?: boolean;
  }) => {
    try {
      let query = supabase
        .from('data_archives')
        .select('*')
        .order('archived_at', { ascending: false })
        .limit(100);

      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (!filters?.include_deleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArchives(data || []);
    } catch (error) {
      logger.error('Error fetching archives', error as Error, 'RETENTION');
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (userId?: string) => {
    try {
      let query = supabase
        .from('retention_notifications')
        .select('*')
        .order('sent_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      logger.error('Error fetching notifications', error as Error, 'RETENTION');
    }
  }, []);

  // Calculate stats
  const calculateStats = useCallback(async () => {
    try {
      const [rulesCount, archivesCount, notificationsCount, archivedCount, deletedCount, upcomingCount] = await Promise.all([
        supabase.from('data_retention_rules').select('id', { count: 'exact', head: true }),
        supabase.from('data_archives').select('id', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('retention_notifications').select('id', { count: 'exact', head: true }).eq('acknowledged', false),
        supabase.from('data_archives').select('id', { count: 'exact', head: true }),
        supabase.from('data_archives').select('id', { count: 'exact', head: true }).not('deleted_at', 'is', null).gte('deleted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('data_archives').select('id', { count: 'exact', head: true }).is('deleted_at', null).lte('expires_at', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      setStats({
        totalRules: rulesCount.count || 0,
        activeArchives: archivesCount.count || 0,
        pendingNotifications: notificationsCount.count || 0,
        totalArchived: archivedCount.count || 0,
        deletedLastMonth: deletedCount.count || 0,
        upcomingExpirations: upcomingCount.count || 0,
      });
    } catch (error) {
      logger.error('Error calculating stats', error as Error, 'RETENTION');
    }
  }, []);

  // Update retention rule
  const updateRule = useCallback(async (
    ruleId: string,
    updates: Partial<RetentionRule>
  ) => {
    try {
      const { error } = await supabase
        .from('data_retention_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) throw error;

      toast({
        title: 'Règle mise à jour',
        description: 'La règle de rétention a été modifiée avec succès',
      });

      await fetchRules();
      await calculateStats();
    } catch (error) {
      logger.error('Error updating rule', error as Error, 'RETENTION');
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la règle',
        variant: 'destructive',
      });
    }
  }, [fetchRules, calculateStats, toast]);

  // Restore archived data
  const restoreArchive = useCallback(async (archiveId: string) => {
    try {
      // This would need custom logic per entity type
      toast({
        title: 'Restauration',
        description: 'Fonctionnalité de restauration en cours de développement',
      });
    } catch (error) {
      logger.error('Error restoring archive', error as Error, 'RETENTION');
    }
  }, [toast]);

  // Acknowledge notification
  const acknowledgeNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('retention_notifications')
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) throw error;

      await fetchNotifications();
      await calculateStats();

      toast({
        title: 'Notification acquittée',
        description: 'La notification a été marquée comme lue',
      });
    } catch (error) {
      logger.error('Error acknowledging notification', error as Error, 'RETENTION');
    }
  }, [fetchNotifications, calculateStats, toast]);

  // Run retention process manually
  const runRetentionProcess = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('data-retention-processor', {
        body: { manual: true },
      });

      if (error) throw error;

      toast({
        title: 'Processus lancé',
        description: `${data?.archived || 0} éléments archivés, ${data?.deleted || 0} supprimés`,
      });

      await fetchArchives();
      await calculateStats();
    } catch (error) {
      logger.error('Error running retention process', error as Error, 'RETENTION');
      toast({
        title: 'Erreur',
        description: 'Impossible de lancer le processus de rétention',
        variant: 'destructive',
      });
    }
  }, [fetchArchives, calculateStats, toast]);

  // Initial load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchRules(),
        fetchArchives(),
        fetchNotifications(),
        calculateStats(),
      ]);
      setLoading(false);
    };

    loadAll();
  }, [fetchRules, fetchArchives, fetchNotifications, calculateStats]);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('retention-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_retention_rules' }, fetchRules)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'data_archives' }, () => {
        fetchArchives();
        calculateStats();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'retention_notifications' }, () => {
        fetchNotifications();
        calculateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRules, fetchArchives, fetchNotifications, calculateStats]);

  return {
    rules,
    archives,
    notifications,
    stats,
    loading,
    updateRule,
    restoreArchive,
    acknowledgeNotification,
    runRetentionProcess,
    fetchArchives,
    fetchNotifications,
  };
};
