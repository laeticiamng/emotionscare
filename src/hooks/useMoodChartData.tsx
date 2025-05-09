
import { useMemo } from 'react';
import { JournalEntry, MoodData } from '@/types';
import { format, subDays } from 'date-fns';

interface UseMoodChartDataResult {
  moodData: MoodData[];
}

export const useMoodChartData = (
  entries: JournalEntry[],
  timeRange: '7' | '30' | '90'
): UseMoodChartDataResult => {
  const moodData = useMemo(() => {
    // Convert time range to number of days
    const days = parseInt(timeRange, 10);
    const today = new Date();
    const startDate = subDays(today, days);
    
    // Filter entries by date range
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    });
    
    // Initialize an array for all days in the range
    const allDays: MoodData[] = [];
    for (let i = days; i >= 0; i--) {
      const date = subDays(today, i);
      allDays.push({
        date: format(date, 'dd/MM'),
        originalDate: date.toISOString(),
        value: 0,
        sentiment: Math.random() * 100, // Mock data
        anxiety: Math.random() * 100, // Mock data
        energy: Math.random() * 100 // Mock data
      });
    }
    
    // Merge entry data with the days array
    filteredEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const formattedDate = format(entryDate, 'dd/MM');
      
      const dayIndex = allDays.findIndex(day => day.date === formattedDate);
      if (dayIndex !== -1) {
        allDays[dayIndex].value = entry.mood_score;
      }
    });
    
    return allDays;
  }, [entries, timeRange]);
  
  return {
    moodData
  };
};

export default useMoodChartData;
