
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play } from "lucide-react";
import { EmotionResult } from '@/types';
import { useMusicRecommendation } from './useMusicRecommendation';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotionResult }) => {
  const { recommendedTracks, isLoading, playRecommendedTrack, handlePlayMusic, EMOTION_TO_MUSIC } = useMusicRecommendation(emotionResult);
  
  if (!emotionResult || !emotionResult.emotion) return null;
  
  const emotionName = emotionResult.emotion.toLowerCase();
  const musicType = EMOTION_TO_MUSIC[emotionName] || 'focus';

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Musique recommandée
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">
            Votre état émotionnel : <span className="text-primary">{emotionName}</span>
          </h4>
          <p className="text-sm text-muted-foreground">
            Nous recommandons une ambiance musicale <b>{musicType}</b> pour accompagner votre humeur actuelle
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="text-center py-2">Chargement des recommandations...</div>
          ) : recommendedTracks.length > 0 ? (
            <>
              <Button
                variant="default"
                className="gap-2"
                onClick={() => handlePlayMusic(emotionName)}
              >
                <Play className="h-4 w-4" />
                Écouter la playlist recommandée
              </Button>
              
              {recommendedTracks.slice(0, 3).map(track => (
                <div 
                  key={track.id} 
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <div className="truncate">
                    <div className="font-medium truncate">{track.title}</div>
                    <div className="text-xs text-muted-foreground">{track.artist}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => playRecommendedTrack(track)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucune recommandation musicale disponible pour le moment.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
