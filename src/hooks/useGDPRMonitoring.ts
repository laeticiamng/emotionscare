import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { useAuth } from '@/contexts/AuthContext';

export interface ConsentStats {
  totalConsents: number;
  analyticsConsents: number;
  functionalConsents: number;
  consentRate: number;
  timeline: Array<{ date: string; analytics: number; functional: number }>;
}

export interface ExportStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  timeline: Array<{ date: string; count: number }>;
  recentRequests: any[];
}

export interface DeletionStats {
  total: number;
  pending: number;
  completed: number;
  timeline: Array<{ date: string; count: number }>;
}

export interface AuditLog {
  id: string;
  event: string;
  actor_id: string;
  target: string;
  occurred_at: string;
  details: any;
}

export const useGDPRMonitoring = () => {
  const { user } = useAuth();
  const [consentStats, setConsentStats] = useState<ConsentStats | null>(null);
  const [exportStats, setExportStats] = useState<ExportStats | null>(null);
  const [deletionStats, setDeletionStats] = useState<DeletionStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConsentStats = async () => {
    try {
      const { data: consents, error } = await supabase
        .from('user_consents')
        .select('consent_type, granted, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalConsents = consents?.length || 0;
      const analyticsConsents = consents?.filter(
        (c) => c.consent_type === 'analytics' && c.granted
      ).length || 0;
      const functionalConsents = consents?.filter(
        (c) => c.consent_type === 'functional' && c.granted
      ).length || 0;

      // Timeline for last 7 days
      const timeline = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayConsents = consents?.filter(
          (c) => c.created_at?.startsWith(dateStr)
        ) || [];

        timeline.push({
          date: dateStr,
          analytics: dayConsents.filter((c) => c.consent_type === 'analytics' && c.granted).length,
          functional: dayConsents.filter((c) => c.consent_type === 'functional' && c.granted).length,
        });
      }

      setConsentStats({
        totalConsents,
        analyticsConsents,
        functionalConsents,
        consentRate: totalConsents > 0 ? (analyticsConsents / totalConsents) * 100 : 0,
        timeline,
      });
    } catch (error) {
      logger.error('Error fetching consent stats', error as Error, 'GDPR');
    }
  };

  const fetchExportStats = async () => {
    try {
      const { data: exports, error } = await supabase
        .from('data_export_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const total = exports?.length || 0;
      const pending = exports?.filter((e) => e.status === 'pending').length || 0;
      const completed = exports?.filter((e) => e.status === 'completed').length || 0;
      const failed = exports?.filter((e) => e.status === 'failed').length || 0;

      // Timeline for last 7 days
      const timeline = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayExports = exports?.filter(
          (e) => e.created_at?.startsWith(dateStr)
        ).length || 0;

        timeline.push({
          date: dateStr,
          count: dayExports,
        });
      }

      setExportStats({
        total,
        pending,
        completed,
        failed,
        timeline,
        recentRequests: exports?.slice(0, 10) || [],
      });
    } catch (error) {
      logger.error('Error fetching export stats', error as Error, 'GDPR');
    }
  };

  const fetchDeletionStats = async () => {
    try {
      const { data: deletions, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('event', 'data_deletion_requested')
        .order('occurred_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const total = deletions?.length || 0;
      const completed = deletions?.filter(
        (d) => d.details?.status === 'completed'
      ).length || 0;
      const pending = total - completed;

      // Timeline for last 7 days
      const timeline = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayDeletions = deletions?.filter(
          (d) => d.occurred_at?.startsWith(dateStr)
        ).length || 0;

        timeline.push({
          date: dateStr,
          count: dayDeletions,
        });
      }

      setDeletionStats({
        total,
        pending,
        completed,
        timeline,
      });
    } catch (error) {
      logger.error('Error fetching deletion stats', error as Error, 'GDPR');
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: logs, error } = await supabase
        .from('audit_logs')
        .select('*')
        .gte('occurred_at', yesterday.toISOString())
        .order('occurred_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setAuditLogs(logs || []);
    } catch (error) {
      logger.error('Error fetching audit logs', error as Error, 'GDPR');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchConsentStats(),
        fetchExportStats(),
        fetchDeletionStats(),
        fetchAuditLogs(),
      ]);
      setIsLoading(false);
    };

    if (user) {
      fetchData();

      // Refresh every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return {
    consentStats,
    exportStats,
    deletionStats,
    auditLogs,
    isLoading,
  };
};
