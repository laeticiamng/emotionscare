// @ts-nocheck
import { useState, useEffect } from 'react';
import { ChartData, DashboardStats } from '../tabs/overview/types';
import { useSegment } from '@/contexts/SegmentContext';
import { logger } from '@/lib/logger';

// Mock function implementations to replace imported functions
const fetchReports = async (reportTypes: string[], timePeriod: number): Promise<{[key: string]: ChartData[]}> => {
  // Mock implementation that returns fake data
  const mockData: {[key: string]: ChartData[]} = {};
  
  // Generate random data points for each report type
  reportTypes.forEach(type => {
    const data: ChartData[] = [];
    
    for (let i = 0; i < timePeriod; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (timePeriod - i - 1));
      
      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        value: Math.floor(Math.random() * 100)
      });
    }
    
    mockData[type] = data;
  });
  
  return Promise.resolve(mockData);
};

const fetchUsersAvgScore = async (days?: number): Promise<number> => {
  return Promise.resolve(78);
};

const fetchUsersWithStatus = async (status?: string, days?: number): Promise<number> => {
  return Promise.resolve(42);
};

export const useDashboardData = (timePeriod: string) => {
  const [absenteeismData, setAbsenteeismData] = useState<ChartData[]>([]);
  const [productivityData, setProductivityData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const reportsData = await fetchReports(
        ['absenteeism', 'productivity'], 
        parseInt(timePeriod)
      );
      
      setAbsenteeismData(reportsData.absenteeism || []);
      setProductivityData(reportsData.productivity || []);
    } catch (error) {
      logger.error("Error fetching dashboard data:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timePeriod, segment]);

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
  const { segment } = useSegment();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data generation
      const mockData: ChartData[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (7 - i - 1));
        mockData.push({
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          value: Math.floor(Math.random() * 20) + 70 // Generate random values between 70-90
        });
      }
      
      setData(mockData);
    } catch (error) {
      logger.error("Error fetching emotional score trend:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [segment]);

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
    completion: 0,
    productivity: { current: 0, trend: 0 },
    emotionalScore: { current: 0, trend: 0 }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { segment } = useSegment();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Generate mock data
      const totalUsers = 256;
      const activeUsers = 178; // Mock active users
      const avgScore = 78;
      const criticalUsers = 5;
      
      setData({
        totalUsers,
        activeToday: activeUsers,
        averageScore: avgScore,
        criticalAlerts: criticalUsers,
        completion: 92,
        productivity: { current: 85, trend: 3 },
        emotionalScore: { current: avgScore, trend: 2 }
      });
    } catch (error) {
      logger.error("Error fetching dashboard stats:", error as Error, 'UI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [segment]);

  return {
    data,
    isLoading,
    refetch: fetchData
  };
};
