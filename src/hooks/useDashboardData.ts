import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  averageScore: number;
  criticalAlerts: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    activeUsers: 0,
    averageScore: 0,
    criticalAlerts: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now - replace with actual API calls
        const mockData: DashboardData = {
          totalUsers: 256,
          activeUsers: 178,
          averageScore: 78,
          criticalAlerts: 5
        };
        
        setData(mockData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        logger.error('Dashboard data fetch error', err as Error, 'UI');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return { data, isLoading, error };
};
