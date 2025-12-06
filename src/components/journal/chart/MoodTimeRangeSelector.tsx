// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';

interface MoodTimeRangeSelectorProps {
  timeRange: '7' | '30' | '90';
  setTimeRange: (range: '7' | '30' | '90') => void;
}

const MoodTimeRangeSelector: React.FC<MoodTimeRangeSelectorProps> = ({ timeRange, setTimeRange }) => {
  return (
    <div className="mb-4 flex justify-end gap-2">
      <Button 
        variant={timeRange === '7' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setTimeRange('7')}
      >
        7 jours
      </Button>
      <Button 
        variant={timeRange === '30' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setTimeRange('30')}
      >
        30 jours
      </Button>
      <Button 
        variant={timeRange === '90' ? 'default' : 'outline'} 
        size="sm" 
        onClick={() => setTimeRange('90')}
      >
        90 jours
      </Button>
    </div>
  );
};

export default MoodTimeRangeSelector;
