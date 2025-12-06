import { useState, useEffect } from 'react';

interface DayData {
  label: string;
  value: number;
}

interface UseWeeklyBarsReturn {
  weekData: DayData[];
  currentWeek: number;
}

/**
 * Hook pour gérer les données hebdomadaires
 */
export const useWeeklyBars = (): UseWeeklyBarsReturn => {
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  useEffect(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const data = days.map(label => ({
      label,
      value: Math.floor(Math.random() * 100),
    }));
    
    setWeekData(data);
    
    const weekNumber = Math.ceil(new Date().getDate() / 7);
    setCurrentWeek(weekNumber);
  }, []);

  return {
    weekData,
    currentWeek,
  };
};
