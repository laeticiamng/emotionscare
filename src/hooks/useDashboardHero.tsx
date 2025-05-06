
import { useState, useEffect } from 'react';
import { 
  Activity, Calendar, Heart, UserGroup, 
  Zap, Users, TrendingUp, Clock
} from 'lucide-react';
import { DashboardKpi, DashboardShortcut } from '@/components/dashboard/DashboardHero';

export const useDashboardHero = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  
  useEffect(() => {
    // In a real application, this would fetch from an API
    // For now, we'll simulate a network request with setTimeout
    const fetchDashboardData = async () => {
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
            icon: UserGroup,
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
        
        setKpis(mockKpis);
        setShortcuts(mockShortcuts);
      } catch (error) {
        console.error('Error fetching dashboard hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [userId]);
  
  return { kpis, shortcuts, isLoading };
};
