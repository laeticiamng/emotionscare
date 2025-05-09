
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useMusicRecommendation from '@/hooks/useMusicRecommendation';
import { EmotionResult } from '@/types';
import { Music, PlayCircle, PauseCircle, Loader2 } from 'lucide-react';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  onPlayMusic?: (emotion: string) => void;
  emotionResult?: EmotionResult;
}

export function EmotionMusicRecommendations({
  emotion,
  onPlayMusic,
  emotionResult
}: EmotionMusicRecommendationsProps) {
  const {
    isLoading,
    loadMusicForMood,
    togglePlayPause,
    currentTrack,
    error,
    handlePlayMusic,
    EMOTION_TO_MUSIC
  } = useMusicRecommendation();

  useEffect(() => {
    if (emotionResult) {
      handlePlayMusic(emotionResult);
    }
  }, [emotionResult, handlePlayMusic]);

  // Déterminer le type de musique à partir de l'émotion
  const getMusicTypeFromEmotion = (emotion: string): string => {
    const normalizedEmotion = emotion.toLowerCase();
    return EMOTION_TO_MUSIC[normalizedEmotion] || EMOTION_TO_MUSIC.default;
  };

  // Determiner si l'UI doit montrer la musique en cours de lecture
  const isPlaying = currentTrack !== null;
  const emotionToUse = emotion || (emotionResult?.emotion || 'neutral');
  const musicType = getMusicTypeFromEmotion(emotionToUse);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>Musique Thérapeutique</CardTitle>
        <CardDescription>
          Musique adaptée à votre état émotionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-destructive text-sm mb-4">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => loadMusicForMood(emotionToUse)}
              className="ml-2"
            >
              Réessayer
            </Button>
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Ambiance: <span className="text-primary">{musicType}</span>
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={isPlaying ? togglePlayPause : () => loadMusicForMood(emotionToUse)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Chargement...</span>
                </>
              ) : isPlaying ? (
                <>
                  <PauseCircle className="h-4 w-4" />
                  <span>En lecture</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  <span>Écouter</span>
                </>
              )}
            </Button>
          </div>

          {currentTrack && (
            <div className="p-3 bg-accent rounded-md text-sm">
              <p className="font-medium">{currentTrack.title}</p>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default EmotionMusicRecommendations;
