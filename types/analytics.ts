export interface AnonymizedEmotion {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  department?: string;
  team?: string;
  anonymizedUserId: string;
}

export interface TeamAnalytics {
  teamId: string;
  teamName: string;
  memberCount: number;
  averageScore: number;
  topEmotions: { emotion: string; count: number }[];
  emotionalTrend: number[];
  engagementRate: number;
}

export interface KpiMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  target?: number;
  color?: string;
}
