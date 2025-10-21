// @ts-nocheck

import { useState, useEffect } from 'react';
import { MoodData } from '@/types/other';
import { format, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

export function useMoodChartData(period: 'day' | 'week' | 'month' = 'week') {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Dans un vrai cas, nous récupérerions des données depuis une API
        // Pour l'instant, nous générons des données de test
        
        let numberOfDays = 7; // Par défaut pour 'week'
        
        if (period === 'day') {
          numberOfDays = 1;
        } else if (period === 'month') {
          numberOfDays = 30;
        }
        
        // Générer des données factices pour chaque jour
        const mockData: MoodData[] = [];
        
        for (let i = 0; i < numberOfDays; i++) {
          const date = subDays(new Date(), i);
          const formattedDate = format(date, 'yyyy-MM-dd');
          const originalDate = format(date, 'dd MMMM', { locale: fr });
          
          mockData.push({
            id: `mood-${i}`,
            mood: ['happy', 'calm', 'sad', 'anxious', 'motivated'][Math.floor(Math.random() * 5)],
            intensity: Math.floor(Math.random() * 10) + 1,
            date: formattedDate,
            value: Math.floor(Math.random() * 10) + 1,
            sentiment: (Math.random() * 2) - 1, // Entre -1 et 1
            anxiety: Math.random() * 10, // Entre 0 et 10
            energy: Math.random() * 10, // Entre 0 et 10
            originalDate
          });
        }
        
        setMoodData(mockData.sort((a, b) => a.date && b.date ? a.date.localeCompare(b.date) : 0));
      } catch (error) {
        logger.error('Erreur lors du chargement des données', error as Error, 'UI');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]);

  // Transforme les données pour un format compatible avec les graphiques
  const chartData = moodData.map(item => ({
    date: item.date,
    value: item.intensity,
    mood: item.mood
  }));
  
  return {
    moodData,
    chartData,
    loading
  };
}

export default useMoodChartData;
