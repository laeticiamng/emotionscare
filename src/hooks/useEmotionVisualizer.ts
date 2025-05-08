
import { useState, useEffect } from 'react';
import { Emotion } from '@/types';
import { getEmotionColor, getEmotionEmoji } from '@/lib/scan/emotionUtilService';

export interface EmotionVisualizationData {
  emotion: string;
  color: string;
  emoji: string;
  score: number;
  isPositive: boolean;
  isNegative: boolean;
  isNeutral: boolean;
}

export function useEmotionVisualizer(emotion: Emotion | null) {
  const [visualData, setVisualData] = useState<EmotionVisualizationData | null>(null);
  
  useEffect(() => {
    if (!emotion) {
      setVisualData(null);
      return;
    }
    
    const emotionName = emotion.emotion || 'neutral';
    const score = emotion.score || 50;
    
    setVisualData({
      emotion: emotionName,
      color: getEmotionColor(emotionName),
      emoji: getEmotionEmoji(emotionName),
      score,
      isPositive: score >= 65,
      isNegative: score <= 35,
      isNeutral: score > 35 && score < 65
    });
  }, [emotion]);
  
  return visualData;
}

export default useEmotionVisualizer;
