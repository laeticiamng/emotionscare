
import { useState, useEffect, useCallback } from 'react';
import { fullApiService } from '@/services/api/fullApiService';
import { useAuth } from '@/contexts/auth';

export interface DashboardStats {
  emotional_score: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    change_percent: number;
  };
  journal_entries: {
    this_week: number;
    total: number;
    streak_days: number;
  };
  achievements: {
    unlocked_count: number;
    total_points: number;
    recent: Array<{
      id: string;
      name: string;
      unlocked_at: string;
    }>;
  };
  social: {
    cocon_members: number;
    shared_moments: number;
  };
  quick_actions: Array<{
    type: string;
    label: string;
    urgent: boolean;
  }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (user.role === 'b2b_admin' || user.role === 'admin') {
        response = await fullApiService.getAdminDashboardStats();
      } else {
        response = await fullApiService.getDashboardStats();
      }

      if (response.success && response.data) {
        setDashboardStats(response.data);
      } else {
        // Données de fallback si l'API ne retourne pas de données
        setDashboardStats({
          emotional_score: {
            current: 7.2,
            trend: 'stable',
            change_percent: 0
          },
          journal_entries: {
            this_week: 3,
            total: 45,
            streak_days: 5
          },
          achievements: {
            unlocked_count: 12,
            total_points: 850,
            recent: []
          },
          social: {
            cocon_members: 8,
            shared_moments: 15
          },
          quick_actions: [
            {
              type: 'emotion_scan',
              label: 'Scanner votre humeur',
              urgent: false
            },
            {
              type: 'journal_entry',
              label: 'Écrire dans le journal',
              urgent: false
            }
          ]
        });
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données dashboard:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
      
      // Données minimales en cas d'erreur
      setDashboardStats({
        emotional_score: { current: 0, trend: 'stable', change_percent: 0 },
        journal_entries: { this_week: 0, total: 0, streak_days: 0 },
        achievements: { unlocked_count: 0, total_points: 0, recent: [] },
        social: { cocon_members: 0, shared_moments: 0 },
        quick_actions: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardStats,
    isLoading,
    error,
    refreshData
  };
};
