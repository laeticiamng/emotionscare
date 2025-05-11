
import React from 'react';

export interface EmotionScanSectionProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const EmotionScanSection: React.FC<EmotionScanSectionProps> = ({ 
  collapsed, 
  onToggle, 
  userId,
  latestEmotion 
}) => {
  return (
    <div>
      <p>Emotion Scan Section</p>
      {latestEmotion && (
        <div>
          <p>Latest emotion: {latestEmotion.emotion}</p>
          <p>Score: {latestEmotion.score}</p>
        </div>
      )}
    </div>
  );
};

export default EmotionScanSection;
