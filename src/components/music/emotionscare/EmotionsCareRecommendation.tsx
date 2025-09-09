
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
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
  
  const { playTrack, isLoading: musicLoading } = useMusic();
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommandation Musicale
        </CardTitle>
        <CardDescription>
          Musique adaptée à votre état émotionnel: {emotionResult.dominantEmotion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Intensité</label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={1}
              min={0}
              step={0.1}
              className="mt-2"
            />
          </div>
          
          <Button 
            onClick={handleGenerateMusic} 
            className="w-full"
            disabled={isGenerating || musicLoading}
          >
            {isGenerating ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4 animate-spin" /> 
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> 
                Générer la musique
              </>
            )}
          </Button>

          {currentTrack && (
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium">{currentTrack.title}</h4>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
              </div>
              
              <Button
                onClick={handlePlayTrack}
                variant="outline"
                className="w-full"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Écouter
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EmotionsCareRecommendation: React.FC<EmotionsCareRecommendationProps> = (props) => {
  return <EmotionsCareRecommendationContent {...props} />;
};

export default EmotionsCareRecommendation;
