/**
 * Hook pour les statistiques de sessions utilisateur
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GroupSessionService } from '../services/groupSessionService';

interface SessionStats {
  totalSessions: number;
  hostedSessions: number;
  totalMinutes: number;
  averageMoodImprovement: number;
  xpEarned: number;
}

export function useSessionStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userStats = await GroupSessionService.getUserStats(user.id);
      setStats(userStats);
    } catch (err) {
      console.error('Error loading session stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
  };
}

export default useSessionStats;
