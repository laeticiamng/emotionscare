
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusicRecommendation } from './useMusicRecommendation';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({
  emotionResult
}) => {
  const { handlePlayMusic, EMOTION_TO_MUSIC } = useMusicRecommendation(emotionResult);
  
  // Déterminer le type de musique pour cette émotion
  const musicType = emotionResult?.emotion 
    ? (EMOTION_TO_MUSIC[emotionResult.emotion.toLowerCase()] || EMOTION_TO_MUSIC.default)
    : EMOTION_TO_MUSIC.default;
  
  return (
    <Card className="mt-4 border-none bg-accent/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <span className="font-medium">Musique thérapeutique recommandée</span>
          </div>
          
          <Button
            size="sm"
            variant="default"
            className="gap-1"
            onClick={() => handlePlayMusic(emotionResult)}
          >
            <PlayCircle className="h-4 w-4" />
            <span>Écouter</span>
          </Button>
        </div>
        
        <div className="mt-2 text-sm">
          <p className="text-muted-foreground">
            Type: <span className="font-medium text-foreground">{musicType}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
