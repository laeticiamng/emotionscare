
import { useState, useEffect } from 'react';
import { fetchReports, fetchUsersAvgScore, fetchUsersWithStatus } from '@/lib/dashboardService';
import { ChartData, DashboardStats } from '../tabs/overview/types';
import { useSegment } from '@/contexts/SegmentContext';

export const useDashboardData = (timePeriod: string) => {
  const [absenteeismData, setAbsenteeismData] = useState<ChartData[]>([]);
  const [productivityData, setProductivityData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { activeDimension, activeOption } = useSegment();
  
  const segmentFilter = activeDimension && activeOption ? {
    dimensionKey: activeDimension.key,
    optionKey: activeOption.key
  } : undefined;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const reportsData = await fetchReports(
        ['absenteeism', 'productivity'], 
        parseInt(timePeriod),
        segmentFilter
      );
      
      setAbsenteeismData(reportsData.absenteeism || []);
      setProductivityData(reportsData.productivity || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod, activeDimension?.key, activeOption?.key]);

  return {
    absenteeismData,
    productivityData,
    isLoading,
    refetchAll: fetchData
  };
};

export const useEmotionalScoreTrend = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { activeDimension, activeOption } = useSegment();
  
  const segmentFilter = activeDimension && activeOption ? {
    dimensionKey: activeDimension.key,
    optionKey: activeOption.key
  } : undefined;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const emotionalData = await fetchUsersAvgScore(7, segmentFilter);
      setData(emotionalData);
    } catch (error) {
      console.error("Error fetching emotional score trend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeDimension?.key, activeOption?.key]);

  return {
    data,
    isLoading,
    refetch: fetchData
  };
};

export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStats>({
    totalUsers: 0,
    activeToday: 0,
    averageScore: 0,
    criticalAlerts: 0,
    completion: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { activeDimension, activeOption } = useSegment();
  
  const segmentFilter = activeDimension && activeOption ? {
    dimensionKey: activeDimension.key,
    optionKey: activeOption.key
  } : undefined;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const totalUsers = 256;
      const activeUsers = await fetchUsersWithStatus("active", 1, segmentFilter);
      const avgScore = 78;
      const criticalUsers = 5;
      
      setData({
        totalUsers,
        activeToday: activeUsers,
        averageScore: avgScore,
        criticalAlerts: criticalUsers,
        completion: 92
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeDimension?.key, activeOption?.key]);

  return {
    data,
    isLoading,
    refetch: fetchData
  };
};
