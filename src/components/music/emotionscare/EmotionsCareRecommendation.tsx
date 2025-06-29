
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import EmotionsCareMusicPlayer from './EmotionsCareMusicPlayer';
import { EmotionsCareMusicProvider, useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';

interface EmotionsCareRecommendationProps {
  emotionResult: EmotionResult;
}

const EmotionsCareRecommendationContent: React.FC<EmotionsCareRecommendationProps> = ({ emotionResult }) => {
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  const { 
    currentPlaylist, 
    isLoading: musicLoading, 
    loadPlaylist, 
    isPlaying 
  } = useEmotionsCareMusicContext();
  
  const handleActivateMusic = async () => {
    try {
      console.log('🎵 EmotionsCare - Activation de la musique pour:', emotionResult);
      
      const playlist = await activateMusicForEmotion({
        emotion: emotionResult.emotion.toLowerCase(),
        intensity: emotionResult.confidence
      });
      
      if (playlist) {
        console.log('✅ EmotionsCare - Playlist reçue:', playlist);
        loadPlaylist(playlist);
      }
    } catch (error) {
      console.error('❌ EmotionsCare - Erreur:', error);
    }
  };
  
  return (
    <>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            EmotionsCare Music
          </CardTitle>
          <CardDescription>
            Musique thérapeutique adaptée à votre état émotionnel
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
            className="w-full bg-primary hover:bg-primary/90"
            disabled={musicLoading}
          >
            <Play className="mr-2 h-4 w-4" /> 
            {musicLoading ? 'Génération EmotionsCare...' : 'Activer la thérapie musicale'}
          </Button>
        </CardContent>
      </Card>

      {/* Lecteur EmotionsCare */}
      {currentPlaylist && (
        <EmotionsCareMusicPlayer />
      )}
    </>
  );
};

const EmotionsCareRecommendation: React.FC<EmotionsCareRecommendationProps> = (props) => {
  return (
    <EmotionsCareMusicProvider>
      <EmotionsCareRecommendationContent {...props} />
    </EmotionsCareMusicProvider>
  );
};

export default EmotionsCareRecommendation;
