// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ApiService } from '@/services/api';
import { logger } from '@/lib/logger';

interface BreathMetrics {
  weekly_avg: number;
  sessions_count: number;
  improvement: number;
}

export const useBreathMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<BreathMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getBreathWeekly(user.id);
      setMetrics(data);
    } catch (err) {
      setError('Erreur lors du chargement des métriques');
      logger.error('Breath metrics error', err as Error, 'UI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [user?.id]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
};
