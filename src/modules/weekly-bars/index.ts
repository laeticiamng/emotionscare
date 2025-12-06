/**
 * Point d'entrée du module weekly-bars
 */

export { WeeklyBarsMain } from './components/WeeklyBarsMain';
export { useWeeklyBars } from './useWeeklyBars';
export { WeeklyBarsService } from './weeklyBarsService';
export { WeeklyBarChart } from './ui/WeeklyBarChart';
export { TrendIndicator } from './ui/TrendIndicator';

export type {
  MetricType,
  WeeklyDataPoint,
  WeeklyMetric,
  WeeklyBarsConfig,
  WeeklyBarsState
} from './types';
