
import { useState, useEffect } from 'react';

interface KPI {
  id: string;
  label: string;
  value: string | number;
  change: number;
  unit?: string;
}

interface Shortcut {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export const useDashboardHero = (userId?: string) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      setIsLoading(true);
      try {
        // Simuler une API pour les données KPI
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setKpis([
          {
            id: 'mood-score',
            label: 'Score d\'humeur',
            value: 7.8,
            change: 0.4,
            unit: '/10'
          },
          {
            id: 'emotions-count',
            label: 'Émotions scannées',
            value: 12,
            change: 4
          },
          {
            id: 'sessions-streak',
            label: 'Jours consécutifs',
            value: 5,
            change: 2
          }
        ]);
        
        setShortcuts([
          {
            id: 'scan',
            label: 'Scanner mon émotion',
            icon: 'heart-pulse',
            href: '/scan'
          },
          {
            id: 'journal',
            label: 'Écrire dans mon journal',
            icon: 'book',
            href: '/journal'
          },
          {
            id: 'meditation',
            label: 'Méditation guidée',
            icon: 'sparkles',
            href: '/meditation'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchHeroData();
    }
  }, [userId]);

  const refetch = async () => {
    // Recharger les données
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Générer des valeurs légèrement différentes pour simuler des données fraîches
      setKpis(prevKpis => 
        prevKpis.map(kpi => ({
          ...kpi,
          value: typeof kpi.value === 'number' 
            ? +(kpi.value + (Math.random() * 0.4 - 0.2)).toFixed(1)
            : kpi.value,
          change: +(kpi.change + (Math.random() * 0.6 - 0.3)).toFixed(1)
        }))
      );
    } catch (error) {
      console.error('Error refetching dashboard hero data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    kpis,
    shortcuts,
    isLoading,
    refetch
  };
};
