
import React from 'react';
import EmotionBasedMusicRecommendation from '@/components/music/EmotionBasedMusicRecommendation';
import type { EmotionResult } from '@/lib/scanService';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult | null;
  isLoading?: boolean;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ 
  emotionResult,
  isLoading = false
}) => {
  if (!emotionResult) return null;
  
  return (
    <EmotionBasedMusicRecommendation 
      emotionResult={emotionResult}
      isLoading={isLoading}
      className="mt-4 animate-fade-in"
      variant="default"
    />
  );
};

export default MusicEmotionRecommendation;
