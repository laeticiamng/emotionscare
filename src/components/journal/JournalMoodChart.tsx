// @ts-nocheck

import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { JournalEntry } from '@/types/journal';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalMoodChartProps {
  entries: JournalEntry[];
  days?: number;
}

const JournalMoodChart: React.FC<JournalMoodChartProps> = ({ entries, days = 7 }) => {
  const chartData = useMemo(() => {
    // Create an array with the last N days
    const daysArray = Array.from({ length: days }).map((_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'dd MMM', { locale: fr }),
        mood_score: 0,
        hasEntry: false
      };
    });

    // Map of dates for quick lookup
    const datesMap = daysArray.reduce<Record<string, any>>((acc, day) => {
      acc[day.date] = day;
      return acc;
    }, {});

    // Fill in actual entries data
    entries.forEach(entry => {
      const entryDate = format(new Date(entry.date), 'yyyy-MM-dd');
      
      if (datesMap[entryDate]) {
        if (typeof entry.mood_score === 'number') {
          datesMap[entryDate].mood_score = entry.mood_score;
        } else if (typeof entry.mood === 'string') {
          // Conversion du mood textuel en score numérique si nécessaire
          const moodMap: Record<string, number> = {
            happy: 1,
            calm: 0.8,
            neutral: 0.5,
            anxious: 0.3,
            sad: 0.1
          };
          const mood = (typeof entry.mood === 'string') ? entry.mood.toLowerCase() : '';
          datesMap[entryDate].mood_score = moodMap[mood] || 0.5;
        }
        datesMap[entryDate].hasEntry = true;
        datesMap[entryDate].mood = entry.mood;
      }
    });

    return Object.values(datesMap);
  }, [entries, days]);

  // Function to determine color based on mood
  const getMoodColor = (mood: string | number | undefined) => {
    if (typeof mood === 'string') {
      const moodStr = mood.toLowerCase();
      if (moodStr.includes('happy') || moodStr.includes('joy')) return '#4ade80';
      if (moodStr.includes('calm') || moodStr.includes('peaceful')) return '#22d3ee';
      if (moodStr.includes('neutral')) return '#a78bfa';
      if (moodStr.includes('anxious') || moodStr.includes('stress')) return '#fb923c';
      if (moodStr.includes('sad') || moodStr.includes('depress')) return '#f87171';
    }
    return '#94a3b8'; // Default color
  };

  return (
    <div className="h-64 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value}
          />
          <YAxis 
            domain={[0, 1]} 
            tickCount={6}
            tickFormatter={(value) => {
              if (value >= 0.8) return 'Excellent';
              if (value >= 0.6) return 'Bien';
              if (value >= 0.4) return 'Neutre';
              if (value >= 0.2) return 'Bas';
              return 'Très bas';
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`Humeur: ${Math.round(value * 100)}%`]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="mood_score"
            name="Niveau d'humeur"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 6, strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default JournalMoodChart;
