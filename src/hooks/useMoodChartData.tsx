
import { useState } from 'react';
import { subDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { JournalEntry, MoodData } from '@/types';

export function useMoodChartData(entries: JournalEntry[], timeRange: '7' | '30' | '90' = '30') {
  // Generate mood data for the chart based on journal entries and time range
  const generateMoodData = (): MoodData[] => {
    const now = new Date();
    const days = parseInt(timeRange);
    const data: MoodData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, 'dd/MM', { locale: fr });
      
      // Find if an entry exists for this date
      const entry = entries.find(e => {
        const entryDate = new Date(e.date);
        return entryDate.getDate() === date.getDate() && 
               entryDate.getMonth() === date.getMonth() && 
               entryDate.getFullYear() === date.getFullYear();
      });
      
      // If an entry exists, generate values based on the entry ID
      if (entry) {
        const entryId = parseInt(entry.id.replace(/[^0-9]/g, '1'));
        data.push({
          date: dateStr,
          value: 40 + (entryId * 11) % 60,  // Use value for the base interface
          sentiment: 40 + (entryId * 11) % 60,  // Between 40 and 100
          anxiety: 10 + (entryId * 7) % 60,    // Between 10 and 70
          energy: 30 + (entryId * 13) % 60     // Between 30 and 90
        });
      } else if (Math.random() > 0.7) {  // Add values for some dates without entries
        data.push({
          date: dateStr,
          value: Math.floor(50 + Math.random() * 50), // Use value for the base interface
          sentiment: Math.floor(50 + Math.random() * 50),  // Between 50 and 100
          anxiety: Math.floor(10 + Math.random() * 60),    // Between 10 and 70
          energy: Math.floor(30 + Math.random() * 60)      // Between 30 and 90
        });
      }
    }
    
    return data;
  };

  const moodData = generateMoodData();
  
  return { moodData };
}
