import React from 'react';
import { Progress } from '@/components/ui/progress';
import { getEmotionIcon, getEmotionColor } from '@/lib/emotionUtils';

interface LiveEmotionResultProps {
  emotion: string;
  confidence: number;
  transcript?: string;
  className?: string;
}

const LiveEmotionResult: React.FC<LiveEmotionResultProps> = ({ 
  emotion, 
  confidence, 
  transcript,
  className = ''
}) => {
  const EmotionIcon = getEmotionIcon(emotion);
  const emotionColor = getEmotionColor(emotion);
  const confidencePercentage = Math.round(confidence * 100);
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`mr-2 ${emotionColor}`}>
            <EmotionIcon />
          </div>
          <h3 className="font-semibold capitalize">{emotion}</h3>
        </div>
        <div className="text-sm font-medium">
          {confidencePercentage}% de confiance
        </div>
      </div>
      
      <Progress value={confidencePercentage} className="h-2" />
      
      {transcript && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
          <p className="italic text-muted-foreground">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default LiveEmotionResult;
