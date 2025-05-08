
import { MoodData } from '@/types';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Generates mock mood data for charts
 */
export const generateMockMoodData = (days: number): MoodData[] => {
  const now = new Date();
  const data: MoodData[] = [];

  for (let i = days; i >= 0; i--) {
    const currentDate = subDays(now, i);
    const formattedDate = format(currentDate, 'dd/MM', { locale: fr });
    
    // Only generate data for some days (randomized)
    if (Math.random() > 0.3) {
      data.push({
        date: formattedDate,
        value: Math.floor(50 + Math.random() * 40),  // Between 50-90
        sentiment: Math.floor(50 + Math.random() * 40),
        anxiety: Math.floor(10 + Math.random() * 50),
        energy: Math.floor(30 + Math.random() * 60),
        originalDate: formattedDate  // Use string format instead of Date object
      });
    }
  }

  return data;
};
