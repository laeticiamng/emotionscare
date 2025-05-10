
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Music } from 'lucide-react';
import { useMusicRecommendation } from './useMusicRecommendation';
import { Card, CardContent } from '@/components/ui/card';
import { EmotionResult } from '@/types';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotionResult }) => {
  const {
    recommendedTracks,
    isLoading,
    playRecommendedTrack,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  } = useMusicRecommendation(emotionResult);

  const primaryEmotion = emotionResult.primaryEmotion?.name || emotionResult.emotion;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-sm">Recommandation musicale</h3>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 
                "Chargement des recommandations..." : 
                `Musique ${EMOTION_TO_MUSIC[primaryEmotion.toLowerCase()] || 'apaisante'} recommandée pour vous`
              }
            </p>
          </div>
          <Button 
            variant="default" 
            size="sm"
            disabled={isLoading || recommendedTracks.length === 0}
            onClick={() => handlePlayMusic(primaryEmotion)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            Écouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
