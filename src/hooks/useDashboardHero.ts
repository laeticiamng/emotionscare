
import { useState, useEffect, useMemo } from 'react';
import { Activity, ArrowTrendingUp, Battery, Brain, Calendar, HeartPulse } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface DashboardKpi {
  id: string;
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  change?: number;
}

interface DashboardShortcut {
  id: string;
  name: string;
  icon: LucideIcon;
  to: string;
  description?: string;
}

interface DashboardHeroData {
  kpis: DashboardKpi[];
  shortcuts: DashboardShortcut[];
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export const useDashboardHero = (userId?: string): DashboardHeroData => {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [userId]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      setKpis([
        {
          id: 'emotional-score',
          label: 'Score émotionnel',
          value: '85%',
          icon: HeartPulse,
          trend: 'up',
          change: 3
        },
        {
          id: 'streak',
          label: 'Jours consécutifs',
          value: '7',
          icon: Activity,
          trend: 'up',
          change: 2
        },
        {
          id: 'energy',
          label: 'Niveau d\'énergie',
          value: '70%',
          icon: Battery,
          trend: 'neutral',
          change: 0
        },
        {
          id: 'mental-clarity',
          label: 'Clarté mentale',
          value: '65%',
          icon: Brain,
          trend: 'up',
          change: 5
        }
      ]);
      
      setShortcuts([
        {
          id: 'scan',
          name: 'Scanner mon humeur',
          icon: Activity,
          to: '/scan',
          description: 'Analyser votre état émotionnel'
        },
        {
          id: 'vr',
          name: 'Session VR',
          icon: ArrowTrendingUp,
          to: '/vr',
          description: 'Expérience immersive'
        },
        {
          id: 'journal',
          name: 'Journal',
          icon: Calendar,
          to: '/journal',
          description: 'Notez vos pensées'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refetch = async () => {
    await loadDashboardData();
  };
  
  return {
    kpis,
    shortcuts,
    isLoading,
    refetch
  };
};

export default useDashboardHero;
