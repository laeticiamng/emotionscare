
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface SecurityMetrics {
  securityScore: number;
  lastLogin: string;
  eventsCount: number;
  complianceLevel: 'high' | 'medium' | 'low';
}

interface AccessEvent {
  page: string;
  timestamp: string;
  success: boolean;
  userRole: string;
  reason?: string;
}

export const useSecurity = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [accessHistory, setAccessHistory] = useState<AccessEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    securityScore: 85,
    lastLogin: new Date().toISOString(),
    eventsCount: 0,
    complianceLevel: 'high'
  });
  const [loading, setLoading] = useState(false);

  const logAccess = useCallback((page: string, success: boolean, reason?: string) => {
    const event: AccessEvent = {
      page,
      timestamp: new Date().toISOString(),
      success,
      userRole: user?.role || user?.user_metadata?.role || 'anonymous',
      reason
    };

    setAccessHistory(prev => [event, ...prev.slice(0, 49)]); // Garder 50 derniers événements
    setMetrics(prev => ({
      ...prev,
      eventsCount: prev.eventsCount + 1
    }));

    // Log pour développement
    if (import.meta.env.DEV) {
      console.log(`[SECURITY] ${success ? 'Access granted' : 'Access denied'} for ${page}`, event);
    }
  }, [user]);

  const exportSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      const data = {
        user: user?.id || 'anonymous',
        accessHistory,
        metrics,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export des données de sécurité:', error);
    } finally {
      setLoading(false);
    }
  }, [user, accessHistory, metrics]);

  const requestDataDeletion = useCallback(async () => {
    setLoading(true);
    try {
      // Simuler une requête de suppression
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccessHistory([]);
      setMetrics(prev => ({ ...prev, eventsCount: 0 }));
      console.log('Données de sécurité supprimées');
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSecurityPreferences = useCallback(async (preferences: Record<string, boolean>) => {
    setLoading(true);
    try {
      // Simuler une mise à jour des préférences
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Préférences de sécurité mises à jour:', preferences);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enregistrer automatiquement les accès aux pages
  useEffect(() => {
    if (isAuthenticated) {
      logAccess(location.pathname, true);
    }
  }, [location.pathname, isAuthenticated, logAccess]);

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
