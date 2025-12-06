// @ts-nocheck
import { useEffect, useState } from 'react';
import { RetentionStats, retentionService } from '@/services/retentionService';
import { useAuth } from '@/contexts/AuthContext';

export const useRetentionStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<RetentionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    retentionService
      .fetchStats(user.id)
      .then(data => setStats(data))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return { stats, loading };
};

export default useRetentionStats;
