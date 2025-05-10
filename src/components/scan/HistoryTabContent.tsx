
import React from 'react';
import EmotionHistory from './EmotionHistory';
import { Emotion } from '@/types';

interface HistoryTabContentProps {
  emotions: Emotion[];
  loading: boolean;
  error: string | null;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ emotions, loading, error }) => {
  return (
    <div className="space-y-4">
      <EmotionHistory 
        emotions={emotions} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};

export default HistoryTabContent;
