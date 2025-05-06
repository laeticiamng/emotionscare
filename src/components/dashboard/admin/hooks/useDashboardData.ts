
import { useState, useEffect } from 'react';
import { fetchReports } from '@/lib/dashboardService';

export interface DashboardData {
  absenteeismData: Array<{ date: string; value: number }>;
  productivityData: Array<{ date: string; value: number }>;
  isLoading: boolean;
}

export const useDashboardData = (timePeriod: string): DashboardData => {
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);

  return { absenteeismData, productivityData, isLoading };
};

export const useEmotionalScoreTrend = () => {
  // Mock data for emotional climate
  return [
    { date: '1/5', value: 72 },
    { date: '2/5', value: 75 },
    { date: '3/5', value: 78 },
    { date: '4/5', value: 80 }
  ];
};

export const useDashboardStats = () => {
  return {
    productivity: {
      current: 87,
      trend: 2.5
    },
    emotionalScore: {
      current: 78,
      trend: 3.8
    }
  };
};
