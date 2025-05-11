
import { useState, useEffect } from 'react';
import { Activity, Brain, Heart, Star, Calendar, Users } from 'lucide-react';

interface DashboardKpi {
  key: string;
  label: string;
  value: number | string;
  icon: any;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  } | number;
}

interface DashboardShortcut {
  label: string;
  name?: string;
  icon: any;
  to: string;
  description?: string;
}

export function useDashboardHero(userId?: string) {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Mock data fetch delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock KPIs
        const mockKpis: DashboardKpi[] = [
          {
            key: 'emotional_score',
            label: 'Score émotionnel',
            value: 84,
            icon: Heart,
            trend: {
              value: 3,
              direction: 'up'
            }
          },
          {
            key: 'activities',
            label: 'Activités terminées',
            value: 7,
            icon: Activity,
            trend: 2
          },
          {
            key: 'streak',
            label: 'Série actuelle',
            value: '5 jours',
            icon: Calendar
          },
          {
            key: 'points',
            label: 'Points',
            value: 423,
            icon: Star,
            trend: {
              value: 12,
              direction: 'up'
            }
          }
        ];
        
        // Mock shortcuts
        const mockShortcuts: DashboardShortcut[] = [
          {
            label: 'Scanner',
            name: 'scan',
            icon: Brain,
            to: '/scan',
            description: 'Faire un scan émotionnel'
          },
          {
            label: 'Coach IA',
            name: 'coach',
            icon: Users,
            to: '/coach',
            description: 'Discuter avec le coach IA'
          }
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
  
  const refetch = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Re-fetch logic would go here in a real implementation
  };
  
  return {
    kpis,
    shortcuts,
    isLoading,
    refetch
  };
}
