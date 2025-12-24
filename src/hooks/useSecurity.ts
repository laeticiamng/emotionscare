// @ts-nocheck

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

interface SecurityMetrics {
  securityScore: number;
  lastLogin: string;
  eventsCount: number;
  complianceLevel: 'high' | 'medium' | 'low';
}

interface AccessRecord {
  page: string;
  timestamp: string;
  success: boolean;
  userRole: string;
  reason?: string;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    securityScore: 85,
    lastLogin: new Date().toISOString(),
    eventsCount: 0,
    complianceLevel: 'high'
  });
  const [accessHistory, setAccessHistory] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Load security data from Supabase
  useEffect(() => {
    const loadSecurityData = async () => {
      if (!user?.id) return;

      try {
        const { supabase } = await import('@/integrations/supabase/client');

        // Load access logs
        const { data: logsData } = await supabase
          .from('access_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (logsData && logsData.length > 0) {
          const formattedLogs: AccessRecord[] = logsData.map(l => ({
            page: l.page || l.resource_path || '/',
            timestamp: l.created_at,
            success: l.success ?? l.authorized ?? true,
            userRole: l.user_role || 'user',
            reason: l.reason || l.denial_reason
          }));
          setAccessHistory(formattedLogs);
        }

        // Load user security profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('last_sign_in_at, security_score')
          .eq('id', user.id)
          .single();

        // Calculate security score and compliance level
        const failedAccess = logsData?.filter(l => !l.success).length || 0;
        const totalAccess = logsData?.length || 0;
        const successRate = totalAccess > 0 ? ((totalAccess - failedAccess) / totalAccess) * 100 : 100;

        let complianceLevel: 'high' | 'medium' | 'low' = 'high';
        if (successRate < 70) complianceLevel = 'low';
        else if (successRate < 90) complianceLevel = 'medium';

        setMetrics({
          securityScore: Math.round(profileData?.security_score || successRate),
          lastLogin: profileData?.last_sign_in_at || new Date().toISOString(),
          eventsCount: totalAccess,
          complianceLevel
        });
      } catch (error) {
        console.error('Error loading security data:', error);
      }
    };

    loadSecurityData();
  }, [user?.id]);

  const logAccess = useCallback(async (page: string, success: boolean, reason?: string) => {
    const record: AccessRecord = {
      page,
      timestamp: new Date().toISOString(),
      success,
      userRole: user?.role || 'unknown',
      reason
    };

    setAccessHistory(prev => [record, ...prev.slice(0, 99)]);
    setMetrics(prev => ({
      ...prev,
      eventsCount: prev.eventsCount + 1
    }));

    // Save to Supabase
    if (user?.id) {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('access_logs').insert({
          user_id: user.id,
          page,
          success,
          user_role: user?.role || 'user',
          reason,
          created_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error logging access:', error);
      }
    }
  }, [user?.id, user?.role]);

  const exportSecurityData = async () => {
    setLoading(true);
    try {
      const data = {
        metrics,
        accessHistory,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('access_logs').delete().eq('user_id', user.id);
      }
      setAccessHistory([]);
      setMetrics(prev => ({ ...prev, eventsCount: 0 }));
    } catch (error) {
      console.error('Error deleting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSecurityPreferences = async (preferences: Record<string, boolean>) => {
    setLoading(true);
    try {
      if (user?.id) {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('user_settings').upsert({
          user_id: user.id,
          security_preferences: preferences,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
      }
      logger.info('Security preferences updated', { preferences }, 'SYSTEM');
    } catch (error) {
      console.error('Error updating preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    logAccess,
    exportSecurityData,
    requestDataDeletion,
    updateSecurityPreferences,
    metrics,
    accessHistory,
    loading
  };
};
