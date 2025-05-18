export interface AnonymizedEmotion {
  emotion: string;
  intensity: number;
  timestamp: string;
}

export interface TeamAnalytics {
  teamId: string;
  period: string;
  moodAverage: number;
  alerts: number;
  data: AnonymizedEmotion[];
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}
