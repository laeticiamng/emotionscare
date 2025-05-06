
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchReports, fetchGamificationStats } from '@/lib/dashboardService';
import { useSegment } from '@/contexts/SegmentContext';

export const useDashboardData = (timePeriod: string) => {
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Add some randomness to simulate data changes during refresh
      const jitter = () => (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
      
      const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod), segment);
      
      // Add jitter to the data to simulate real-time changes
      const absenteeism = reportsData.absenteeism?.map(item => ({
        ...item,
        value: Math.max(0, item.value + jitter())
      })) || [];
      
      const productivity = reportsData.productivity?.map(item => ({
        ...item,
        value: Math.min(100, item.value + jitter())
      })) || [];
      
      setAbsenteeismData(absenteeism);
      setProductivityData(productivity);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [timePeriod, segment]);
  
  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { 
    absenteeismData, 
    productivityData, 
    isLoading,
    refetchAll: fetchData
  };
};

export const useEmotionalScoreTrend = () => {
  const [data, setData] = useState<Array<{ date: string; value: number }>>([]);
  const { segment } = useSegment();
  
  const fetchData = useCallback(async () => {
    // Mock emotional score trend data
    const mockData = [
      { date: '1/5', value: 72 },
      { date: '2/5', value: 75 },
      { date: '3/5', value: 71 },
      { date: '4/5', value: 74 },
      { date: '5/5', value: 77 },
      { date: '6/5', value: 76 },
      { date: '7/5', value: 75.5 },
    ];
    
    // Add jitter to simulate real-time changes
    const jitter = () => (Math.random() * 3) - 1.5; // -1.5 to +1.5
    const updatedData = mockData.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value + jitter()))
    }));
    
    setData(updatedData);
    return updatedData;
  }, [segment]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, refetch: fetchData };
};

export const useDashboardStats = () => {
  const [data, setData] = useState({
    activeUsersCount: 85,
    absentTeamMembers: 3,
    averageEmotionalScore: 76,
    activeGameifications: 12
  });
  const { segment } = useSegment();
  
  const fetchData = useCallback(async () => {
    try {
      // Simulate fetching stats with randomness to show changes on refresh
      const gamificationStats = await fetchGamificationStats(segment);
      
      const updatedData = {
        activeUsersCount: 80 + Math.floor(Math.random() * 10), // 80-89
        absentTeamMembers: 2 + Math.floor(Math.random() * 3), // 2-4
        averageEmotionalScore: 74 + Math.floor(Math.random() * 6), // 74-79
        activeGameifications: gamificationStats.totalBadges || 12
      };
      
      setData(updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      return data;
    }
  }, [segment, data]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, refetch: fetchData };
};
