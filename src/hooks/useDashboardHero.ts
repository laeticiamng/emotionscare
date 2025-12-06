
import { useState, useEffect, useCallback } from 'react';
import { LucideIcon, Home, Clock, Calendar, User, TrendingUp, Activity, BarChart } from 'lucide-react';

// Define the return type for clarity
export interface DashboardKpi {
  key: string;
  value: string | number;
  label: string;
  trend?: number;
  icon: LucideIcon;
}

export interface DashboardShortcut {
  name: string;
  label: string;
  icon: LucideIcon;
  to: string;
  description?: string;
}

export interface DashboardHeroData {
  kpis: DashboardKpi[];
  shortcuts: DashboardShortcut[];
  isLoading: boolean;
}

export const useDashboardHero = (userId?: string) => {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // await api.getDashboardData(userId)
      
      // For now, use mock data
      setTimeout(() => {
        setKpis([
          {
            key: 'emotion-score',
            value: 85,
            label: 'Score émotionnel',
            trend: 5,
            icon: Activity
          },
          {
            key: 'journal-entries',
            value: 12,
            label: 'Entrées journal',
            trend: 2,
            icon: BarChart
          },
          {
            key: 'sessions',
            value: 8,
            label: 'Sessions VR',
            trend: -1,
            icon: Calendar
          },
          {
            key: 'streak',
            value: '5 jours',
            label: 'Série',
            trend: 0,
            icon: TrendingUp
          }
        ]);

        setShortcuts([
          {
            name: 'scan',
            label: 'Nouveau scan',
            icon: Activity,
            to: '/scan',
            description: 'Analyser votre état émotionnel'
          },
          {
            name: 'journal',
            label: 'Journal',
            icon: Calendar,
            to: '/journal',
            description: 'Accéder à votre journal'
          },
          {
            name: 'vr',
            label: 'Session VR',
            icon: Clock,
            to: '/vr',
            description: 'Démarrer une session de réalité virtuelle'
          },
          {
            name: 'profile',
            label: 'Profil',
            icon: User,
            to: '/profile',
            description: 'Voir votre profil'
          }
        ]);
        
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    return fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    kpis,
    shortcuts,
    isLoading,
    refetch
  };
};

export default useDashboardHero;
