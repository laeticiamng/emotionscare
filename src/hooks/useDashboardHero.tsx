
import { useState, useEffect } from 'react';
import { Activity, BarChart3, Heart, Calendar, Users } from 'lucide-react';
import type { DashboardKpi, DashboardShortcut } from '@/components/dashboard/DashboardHero';

export function useDashboardHero(userId?: string) {
  const [kpis, setKpis] = useState<DashboardKpi[]>([]);
  const [shortcuts, setShortcuts] = useState<DashboardShortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les données du tableau de bord
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Données simulées pour la démonstration
      setKpis([
        {
          key: 'emotional_score',
          value: 84,
          label: 'Score émotionnel',
          trend: '+5%',
          icon: Heart
        },
        {
          key: 'activities',
          value: 12,
          label: 'Activités',
          trend: '+2',
          icon: Activity
        },
        {
          key: 'community',
          value: 4,
          label: 'Communauté',
          trend: 'stable',
          icon: Users
        },
        {
          key: 'streak',
          value: 7,
          label: 'Jours consécutifs',
          trend: '+3',
          icon: Calendar
        }
      ]);
      
      setShortcuts([
        {
          name: 'journal',
          label: 'Journal émotionnel',
          description: 'Noter mes émotions et réflexions',
          icon: BarChart3,
          to: '/journal'
        },
        {
          name: 'scan',
          label: 'Scan émotionnel',
          description: 'Analyser mon état actuel',
          icon: Heart,
          to: '/scan'
        },
        {
          name: 'coach',
          label: 'Coach émotionnel',
          description: 'Discuter avec mon coach IA',
          icon: Users,
          to: '/coach'
        }
      ]);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    kpis,
    shortcuts,
    isLoading,
    refetch: fetchDashboardData
  };
}
