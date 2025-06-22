
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityMetrics {
  securityScore: number;
  lastLogin: string;
  eventsCount: number;
  complianceLevel: 'high' | 'medium' | 'low';
}

interface AccessAttempt {
  page: string;
  timestamp: string;
  success: boolean;
  userRole: string;
  reason?: string;
}

export const useSecurity = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    securityScore: 95,
    lastLogin: new Date().toISOString(),
    eventsCount: 12,
    complianceLevel: 'high'
  });
  const [accessHistory, setAccessHistory] = useState<AccessAttempt[]>([]);
  const [loading, setLoading] = useState(false);

  const logAccess = (page: string, success: boolean, reason?: string) => {
    if (!user) return;

    const attempt: AccessAttempt = {
      page,
      timestamp: new Date().toISOString(),
      success,
      userRole: user.role,
      reason
    };

    setAccessHistory(prev => [attempt, ...prev.slice(0, 49)]); // Garder les 50 derniers
    
    // Simuler l'envoi au backend
    console.log('Access logged:', attempt);
  };

  const exportSecurityData = async () => {
    setLoading(true);
    try {
      // Simuler l'export des données de sécurité
      const data = {
        user: user?.id,
        accessHistory,
        metrics,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('Security data exported');
    } catch (error) {
      console.error('Error exporting security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestDataDeletion = async () => {
    setLoading(true);
    try {
      // Simuler la demande de suppression
      console.log('Data deletion requested for user:', user?.id);
      // Ici on ferait un appel API réel
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error requesting data deletion:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSecurityPreferences = async (preferences: Record<string, boolean>) => {
    setLoading(true);
    try {
      // Simuler la mise à jour des préférences
      console.log('Security preferences updated:', preferences);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating security preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    accessHistory,
    loading,
    logAccess,
    exportSecurityData,
    requestDataDeletion,
    updateSecurityPreferences
  };
};

export default useSecurity;
