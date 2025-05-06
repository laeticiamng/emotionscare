
import { useState, useEffect, useCallback } from 'react';
import { fetchReports, fetchGamificationStats, fetchUsersAvgScore } from '@/lib/dashboardService';
import { useSegment } from '@/contexts/SegmentContext';
import { toast } from "sonner";

export function useDashboardData(timePeriod: string) {
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data with segment filter
        const reportsData = await fetchReports(
          ['absenteeism', 'productivity'], 
          parseInt(timePeriod),
          segment
        );
        
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur de chargement", {
          description: "Impossible de charger les données pour ce segment."
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod, segment]);

  return {
    absenteeismData,
    productivityData,
    isLoading
  };
}

export function useEmotionalScoreTrend() {
  const [emotionalScoreTrend, setEmotionalScoreTrend] = useState<Array<{ date: string; value: number }>>([]);
  const { segment } = useSegment();

  useEffect(() => {
    async function loadEmotionalScoreTrend() {
      try {
        // Fetch emotional score trend with segment filter
        const data = await fetchUsersAvgScore(30, segment);
        setEmotionalScoreTrend(data);
      } catch (error) {
        console.error("Erreur lors du chargement des tendances émotionnelles:", error);
      }
    }
    
    loadEmotionalScoreTrend();
  }, [segment]);

  return emotionalScoreTrend;
}

export function useDashboardStats() {
  const [dashboardStats, setDashboardStats] = useState({
    productivity: {
      current: 82,
      trend: 5
    },
    emotionalScore: {
      current: 76,
      trend: 2
    }
  });
  const { segment } = useSegment();

  useEffect(() => {
    // This would be replaced with API calls in a real implementation
    async function loadDashboardStats() {
      try {
        // Mock implementation with segment filter
        if (segment.dimensionKey && segment.optionKey) {
          let productivityCurrent = 82;
          let productivityTrend = 5;
          let emotionalScoreCurrent = 76;
          let emotionalScoreTrend = 2;
          
          switch (segment.dimensionKey) {
            case 'role':
              if (segment.optionKey === 'hr') {
                productivityCurrent = 87;
                emotionalScoreCurrent = 82;
              } else if (segment.optionKey === 'manager') {
                productivityCurrent = 85;
                productivityTrend = 7;
              } else if (segment.optionKey === 'employee') {
                productivityCurrent = 78;
                productivityTrend = 3;
              }
              break;
              
            case 'wellbeingScore':
              if (segment.optionKey === 'high') {
                productivityCurrent = 92;
                productivityTrend = 8;
                emotionalScoreCurrent = 88;
                emotionalScoreTrend = 4;
              } else if (segment.optionKey === 'medium') {
                productivityCurrent = 80;
                emotionalScoreCurrent = 70;
              } else if (segment.optionKey === 'low') {
                productivityCurrent = 65;
                productivityTrend = -2;
                emotionalScoreCurrent = 52;
                emotionalScoreTrend = -3;
              }
              break;
              
            case 'engagement':
              if (segment.optionKey === 'high') {
                productivityCurrent = 90;
                productivityTrend = 7;
                emotionalScoreCurrent = 85;
                emotionalScoreTrend = 5;
              } else if (segment.optionKey === 'low') {
                productivityCurrent = 68;
                productivityTrend = -1;
                emotionalScoreCurrent = 60;
                emotionalScoreTrend = -2;
              }
              break;
          }
          
          setDashboardStats({
            productivity: {
              current: productivityCurrent,
              trend: productivityTrend
            },
            emotionalScore: {
              current: emotionalScoreCurrent,
              trend: emotionalScoreTrend
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      }
    }
    
    loadDashboardStats();
  }, [segment]);

  return dashboardStats;
}
