
import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, Calendar, Heart, Users, 
  Zap, Clock, TrendingUp
} from 'lucide-react';
import { DashboardKpi, DashboardShortcut } from '@/components/dashboard/DashboardHero';

export const useDashboardHero = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  
  // Function to fetch dashboard data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock KPI data
      const mockKpis: DashboardKpi[] = [
        { 
          key: 'sessions_today', 
          label: 'Sessions aujourd\'hui', 
          value: 8, 
          icon: Calendar,
          trend: { value: 12, direction: 'up' }
        },
        { 
          key: 'active_users', 
          label: 'Utilisateurs actifs', 
          value: '85%', 
          icon: Users,
          trend: { value: 5, direction: 'up' }
        },
        { 
          key: 'avg_wellbeing', 
          label: 'Score bien-être', 
          value: '78/100', 
          icon: Heart,
          trend: { value: 3, direction: 'down' }
        },
        { 
          key: 'productivity', 
          label: 'Productivité', 
          value: '92%', 
          icon: TrendingUp,
          trend: { value: 2, direction: 'up' }
        },
      ];
      
      // Mock shortcuts data
      const mockShortcuts: DashboardShortcut[] = [
        { label: 'Scan émotionnel', icon: Activity, to: '/scan' },
        { label: 'Micro-pause VR', icon: Zap, to: '/vr' },
        { label: 'Communauté', icon: Users, to: '/community' },
        { label: 'Journal', icon: Clock, to: '/journal' },
      ];
      
      // Add some randomness to the values to simulate real-time changes
      mockKpis[0].value = Math.floor(Math.random() * 5) + 6; // 6-10
      mockKpis[2].value = `${Math.floor(Math.random() * 10) + 75}/100`; // 75-85/100
      
      setKpis(mockKpis);
      setShortcuts(mockShortcuts);
    } catch (error) {
      console.error('Error fetching dashboard hero data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { 
    kpis, 
    shortcuts, 
    isLoading,
    refetch: fetchData
  };
};
