
import React from 'react';

export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  averageScore: number;
  criticalAlerts: number;
  completion: number;
  productivity: {
    current: number;
    trend: number;
  };
  emotionalScore: {
    current: number;
    trend: number;
  };
}

export interface OverviewTabProps {
  timePeriod: string;
  onRefresh?: () => Promise<void>;
}
