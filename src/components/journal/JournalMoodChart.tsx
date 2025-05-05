
import React, { useState } from 'react';
import type { JournalEntry } from '@/types';
import MoodTimeRangeSelector from './chart/MoodTimeRangeSelector';
import MoodLineChart from './chart/MoodLineChart';
import MoodChartFooter from './chart/MoodChartFooter';
import { useMoodChartData } from '@/hooks/useMoodChartData';

interface JournalMoodChartProps {
  entries: JournalEntry[];
}

const JournalMoodChart: React.FC<JournalMoodChartProps> = ({ entries }) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const { moodData } = useMoodChartData(entries, timeRange);
  
  return (
    <div>
      <MoodTimeRangeSelector 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
      />
      
      <MoodLineChart data={moodData} />
      
      <MoodChartFooter />
    </div>
  );
};

export default JournalMoodChart;
