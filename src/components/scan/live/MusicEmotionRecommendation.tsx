
import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types';
import useMusicEmotionIntegration from '@/hooks/useMusicEmotionIntegration';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
  isLoading?: boolean;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({
  emotionResult,
  isLoading = false
}) => {
  const { playMusicForEmotionResult, getMusicTypeForEmotion } = useMusicEmotionIntegration();
  
  if (!emotionResult?.emotion) {
    return null;
  }
  
  const musicType = getMusicTypeForEmotion(emotionResult.emotion);
  
  const handlePlayMusic = () => {
    playMusicForEmotionResult(emotionResult);
  };
  
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Music className="h-5 w-5 text-primary" />
        <h4 className="font-medium">Recommandation musicale</h4>
      </div>
      
      <p className="text-sm mb-4">
        Basé sur votre état émotionnel <strong>{emotionResult.emotion}</strong>, nous 
        vous recommandons une playlist <strong>{musicType}</strong> pour améliorer votre bien-être.
      </p>
      
      <Button 
        onClick={handlePlayMusic}
        disabled={isLoading}
        className="w-full"
      >
        <PlayCircle className="mr-2 h-4 w-4" />
        Jouer la musique recommandée
      </Button>
    </div>
  );
};

export default MusicEmotionRecommendation;
