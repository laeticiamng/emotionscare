
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmotionResult } from '@/types';
import { Music, PlayCircle, PauseCircle, Loader2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  onPlayMusic?: (emotion: string) => void;
  emotionResult?: EmotionResult;
}

// Define emotion to music mapping locally
const EMOTION_TO_MUSIC: Record<string, string> = {
  'happy': 'energetic',
  'sad': 'calm',
  'angry': 'calm',
  'anxious': 'calm',
  'neutral': 'neutral',
  'calm': 'calm',
  'stressed': 'calm',
  'energetic': 'energetic',
  'bored': 'energetic',
  'tired': 'calm',
  'fearful': 'calm',
  'default': 'neutral'
};

export function EmotionMusicRecommendations({
  emotion,
  onPlayMusic,
  emotionResult
}: EmotionMusicRecommendationsProps) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    loadPlaylistForEmotion,
    initializeMusicSystem,
    error
  } = useMusic();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handlePlayMusic = async (emotionToPlay: string) => {
    if (!emotionToPlay) return;
    
    setLocalLoading(true);
    setLocalError('');
    
    try {
      const musicType = EMOTION_TO_MUSIC[emotionToPlay.toLowerCase()] || EMOTION_TO_MUSIC.default;
      const playlist = loadPlaylistForEmotion(musicType);
      if (playlist && playlist.tracks.length > 0) {
        // Ensure the track has the required duration and url fields
        const track = {
          ...playlist.tracks[0],
          duration: playlist.tracks[0].duration || 0,
          url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || ''
        };
        playTrack(track);
      }
      setLocalLoading(false);
    } catch (err) {
      console.error("Error loading music:", err);
      setLocalError("Impossible de charger la musique pour cette émotion");
      setLocalLoading(false);
    }
  };

  // Handle play pause toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      // Pause if playing
      playTrack(currentTrack!);
    } else if (currentTrack) {
      // Resume if paused
      playTrack(currentTrack);
    } else {
      // Play if not playing
      handlePlayMusic(emotion || (emotionResult?.emotion || 'neutral'));
    }
  };

  useEffect(() => {
    initializeMusicSystem();
  }, [initializeMusicSystem]);

  useEffect(() => {
    if (emotionResult) {
      handlePlayMusic(emotionResult.emotion);
    }
  }, [emotionResult]);

  // Déterminer le type de musique à partir de l'émotion
  const getMusicTypeFromEmotion = (emotionName: string): string => {
    const normalizedEmotion = emotionName.toLowerCase();
    return EMOTION_TO_MUSIC[normalizedEmotion] || EMOTION_TO_MUSIC.default;
  };

  // Determiner si l'UI doit montrer la musique en cours de lecture
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
        {error || localError ? (
          <div className="text-destructive text-sm mb-4">
            {error || localError}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePlayMusic(emotionToUse)}
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
              onClick={isPlaying ? togglePlayPause : () => handlePlayMusic(emotionToUse)}
              disabled={localLoading}
              className="flex items-center gap-2"
            >
              {localLoading ? (
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
