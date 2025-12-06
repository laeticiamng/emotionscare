// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import PremiumMusicPlayer from '@/components/music/player/PremiumMusicPlayer';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotionResult }) => {
  const { activateMusicForEmotion, getEmotionMusicDescription, isLoading } = useMusicEmotionIntegration();
  const [generatedPlaylist, setGeneratedPlaylist] = useState<any>(null);
  
  const handleActivateMusic = async () => {
    try {
      // Activating music for emotion
      
      const playlist = await activateMusicForEmotion({
        emotion: emotionResult.emotion.toLowerCase(),
        intensity: emotionResult.confidence
      });
      
      if (playlist) {
        // Playlist received, opening player
        setGeneratedPlaylist(playlist);
      }
    } catch (error) {
      // Music activation error - silent
    }
  };
  
  const handleClosePlayer = () => {
    setGeneratedPlaylist(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Recommandation musicale
          </CardTitle>
          <CardDescription>
            Musique adaptée à votre état émotionnel actuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            {getEmotionMusicDescription(emotionResult.emotion.toLowerCase())}
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Émotion détectée : 
            <span className="font-semibold text-primary ml-1 capitalize">
              {emotionResult.emotion}
            </span>
            {emotionResult.confidence && (
              <span className="ml-2">
                ({Math.round(emotionResult.confidence * 100)}% de confiance)
              </span>
            )}
          </p>
          <Button 
            onClick={handleActivateMusic} 
            className="w-full"
            disabled={isLoading}
          >
            <Play className="mr-2 h-4 w-4" /> 
            {isLoading ? 'Génération en cours...' : 'Écouter la playlist recommandée'}
          </Button>
        </CardContent>
      </Card>

      {/* Lecteur automatique */}
      {generatedPlaylist && (
        <PremiumMusicPlayer 
          className="mt-4"
        />
      )}
    </>
  );
};

export default MusicEmotionRecommendation;
