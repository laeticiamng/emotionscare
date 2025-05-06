import { MoodData } from '@/types';
import { format, subDays, differenceInDays } from 'date-fns';

/**
 * Generates mock mood data for a specified number of days
 * @param days Number of days to generate data for
 * @returns Array of MoodData objects
 */
export const generateMockMoodData = (days: number): MoodData[] => {
  const result: MoodData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    // Generate a somewhat realistic pattern with some randomness
    // Base value is between 60-85 with small variations
    const baseValue = 60 + Math.floor(Math.random() * 25);
    // Add some fluctuation but keep it within 0-100
    const value = Math.min(100, Math.max(0, baseValue + (Math.random() * 10 - 5)));
    
    result.push({
      date: format(date, 'MM/dd'),
      value: Math.round(value),
      originalDate: date,
      sentiment: Math.round(Math.random() * 100) / 100,
      anxiety: Math.round(Math.random() * 100) / 100,
      energy: Math.round(Math.random() * 100) / 100
    });
  }
  
  return result;
};

/**
 * Generate mock trend data for dashboard charts
 * @param metric Name of the metric to generate data for
 * @param days Number of days to generate data for
 * @param trend Direction of the trend (positive, negative, or stable)
 * @returns Array of chart data objects
 */
export const generateMockTrendData = (
  metric: string,
  days: number,
  trend: 'positive' | 'negative' | 'stable' = 'positive'
) => {
  const result = [];
  const today = new Date();
  const startValue = metric === 'absenteeism' ? 5 : 75; // Different starting points for different metrics
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'MM/dd');
    
    // Calculate a value based on the trend
    let trendFactor = 0;
    if (trend === 'positive') {
      trendFactor = (days - i) * 0.5;
    } else if (trend === 'negative') {
      trendFactor = -(days - i) * 0.5;
    }
    
    // Add some randomness to make it look realistic
    const randomFactor = Math.random() * 4 - 2; // Random value between -2 and 2
    
    let value = 0;
    if (metric === 'absenteeism') {
      // For absenteeism, lower is better (positive trend = decreasing value)
      value = Math.max(0, Math.min(15, startValue - trendFactor + randomFactor));
    } else {
      // For productivity or other metrics, higher is better
      value = Math.max(0, Math.min(100, startValue + trendFactor + randomFactor));
    }
    
    result.push({
      date: dateStr,
      value: Math.round(value * 10) / 10 // Round to 1 decimal place
    });
  }
  
  return result;
};
