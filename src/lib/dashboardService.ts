
import { DashboardStats } from '@/components/dashboard/admin/tabs/overview/types';

interface ChartData {
  date: string;
  value: number;
}

interface ReportsResponse {
  [key: string]: ChartData[];
}

export async function fetchReports(reportTypes: string[], period: number): Promise<ReportsResponse> {
  // Mock implementation that returns fake data
  const mockData: ReportsResponse = {};
  
  // Generate random data points for each report type
  reportTypes.forEach(type => {
    const data: ChartData[] = [];
    
    for (let i = 0; i < period; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (period - i - 1));
      
      data.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        value: Math.floor(Math.random() * 100)
      });
    }
    
    mockData[type] = data;
  });
  
  return Promise.resolve(mockData);
}

export async function fetchUsersAvgScore(): Promise<number> {
  return Promise.resolve(78);
}

export async function fetchUsersWithStatus(status: string = "active", days: number = 1): Promise<number> {
  return Promise.resolve(42);
}

export async function fetchBadgesCount(): Promise<number> {
  return Promise.resolve(15);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return Promise.resolve({
    totalUsers: 215,
    activeToday: 178,
    averageScore: 76,
    criticalAlerts: 3,
    completion: 82,
    productivity: {
      current: 84,
      trend: 2.3
    },
    emotionalScore: {
      current: 76,
      trend: 1.5
    }
  });
}
