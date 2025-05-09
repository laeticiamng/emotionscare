
import { MoodData } from '@/types';
import { subDays, format } from 'date-fns';

/**
 * Generates mock mood data for charts and visualizations
 */
export function generateMockMoodData(days = 30): MoodData[] {
  const today = new Date();
  const data: MoodData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'dd/MM');
    const originalDate = date.toISOString();
    
    // Generate some realistic looking data
    const baseValue = Math.floor(Math.random() * 30) + 40; // Base between 40-70
    const dayVariation = Math.floor(Math.random() * 40) - 20; // -20 to +20 variation
    
    data.push({
      date: formattedDate,
      originalDate,
      value: Math.max(0, Math.min(100, baseValue + dayVariation)),
      sentiment: Math.max(0, Math.min(100, baseValue + Math.floor(Math.random() * 30) - 15)),
      anxiety: Math.max(0, Math.min(100, 100 - baseValue + Math.floor(Math.random() * 20) - 10)),
      energy: Math.max(0, Math.min(100, baseValue - 10 + Math.floor(Math.random() * 40) - 20)),
    });
  }

  return data;
}
