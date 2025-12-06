/**
 * Types pour le module weekly-bars
 */

export type MetricType = 'mood' | 'stress' | 'energy' | 'sleep' | 'activity';

export interface WeeklyDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface WeeklyMetric {
  type: MetricType;
  data: WeeklyDataPoint[];
  average: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface WeeklyBarsConfig {
  startDate: Date;
  endDate: Date;
  metrics: MetricType[];
  showAverage?: boolean;
  showTrend?: boolean;
}

export interface WeeklyBarsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: WeeklyMetric[];
  config: WeeklyBarsConfig | null;
  error: string | null;
}
