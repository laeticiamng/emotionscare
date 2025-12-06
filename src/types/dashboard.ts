
import { ReactNode } from 'react';

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  emotionalScore: number;
  completionRate: number;
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface AdminDashboardData {
  metrics: DashboardMetrics;
  recentActivity: ActivityLog[];
  userStats: UserStats[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface UserStats {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  emotionalScore: number;
  status: 'active' | 'inactive' | 'pending';
}
