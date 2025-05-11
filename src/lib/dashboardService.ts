
import { MoodData } from '@/types';

export const fetchReports = async (reportTypes: string[], days: number, segment?: any) => {
  // Mock implementation that returns sample data
  const mockData = {
    absenteeism: Array.from({ length: days }, (_, i) => ({
      date: `${i + 1}/${days}`,
      value: Math.random() * 5
    })),
    productivity: Array.from({ length: days }, (_, i) => ({
      date: `${i + 1}/${days}`,
      value: 70 + Math.random() * 20
    }))
  };

  return mockData;
};

export const fetchUsersAvgScore = async () => {
  // Mock implementation
  return {
    average: 75,
    trend: 3.2
  };
};

export const fetchUsersWithStatus = async (status: string) => {
  // Mock implementation
  return {
    active: 42,
    total: 50
  };
};

export const fetchBadgesCount = async () => {
  // Mock implementation
  return 5;
};
