import { useState, useEffect } from 'react';
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

  const logAccess = (page: string, success: boolean, reason?: string) => {
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
  };

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
      // Simulation de suppression
      setAccessHistory([]);
      setMetrics(prev => ({ ...prev, eventsCount: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const updateSecurityPreferences = async (preferences: Record<string, boolean>) => {
    setLoading(true);
    try {
      // Simulation de mise à jour
      logger.info('Security preferences updated', { preferences }, 'SYSTEM');
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
