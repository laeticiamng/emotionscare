
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { useToast } from '@/hooks/use-toast';
import type { EmotionResult } from '@/types';

interface EmotionsCareRecommendationProps {
  emotionResult: EmotionResult;
  autoGenerate?: boolean;
  className?: string;
}

const EmotionsCareRecommendationContent: React.FC<EmotionsCareRecommendationProps> = ({
  emotionResult,
  autoGenerate = false,
  className = ''
}) => {
  const [intensity, setIntensity] = useState([0.5]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  
  const { playTrack, isLoading: musicLoading } = useEmotionsCareMusicContext();
  const { generateMusic, isGenerating, error } = useMusicGeneration();
  const { toast } = useToast();

  useEffect(() => {
    if (autoGenerate && emotionResult) {
      handleGenerateMusic();
    }
  }, [emotionResult, autoGenerate]);

  const handleGenerateMusic = async () => {
    if (!emotionResult?.dominantEmotion) return;

    try {
      const track = await generateMusic(
        emotionResult.dominantEmotion,
        undefined, // customPrompt
        emotionResult.overallMood,
        intensity[0]
      );

      if (track) {
        setCurrentTrack(track);
        toast({
          title: "Musique générée !",
          description: `"${track.title}" est prête à être écoutée`,
          duration: 4000
        });
      }
    } catch (err) {
      console.error('Error generating music:', err);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handlePlayTrack = async () => {
    if (!currentTrack) return;

    try {
      if (isPlaying) {
        // Pause logic would go here
        setIsPlaying(false);
      } else {
        await playTrack(currentTrack);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error playing track:', err);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de lire la musique",
        variant: "destructive"
      });
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
