
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Loader2, PlayCircle } from 'lucide-react';
import { EmotionResult, MusicPlaylist, MusicTrack } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

interface EmotionBasedMusicRecommendationProps {
  emotionResult: EmotionResult;
  variant?: 'compact' | 'standalone';
  isLoading?: boolean;
}

const EmotionBasedMusicRecommendation: React.FC<EmotionBasedMusicRecommendationProps> = ({
  emotionResult,
  variant = 'compact',
  isLoading = false
}) => {
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  const handlePlayMusic = async () => {
    if (!emotionResult.emotion) return;
    
    setIsLoadingMusic(true);
    try {
      const emotion = emotionResult.emotion.toLowerCase();
      const intensity = emotionResult.intensity || 0.5;
      
      // Use our integrated function that now properly uses the TopMedia API
      const success = await activateMusicForEmotion({
        emotion,
        intensity: intensity * 100
      });
      
      if (!success) {
        toast({
          title: "Problème d'activation",
          description: "Impossible d'activer la musique pour votre émotion",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la musique:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMusic(false);
    }
  };

  const isStandalone = variant === 'standalone';
  const emotionName = emotionResult.emotion || 'neutral';
  const musicDescription = getEmotionMusicDescription(emotionName);

  return (
    <Card className={isStandalone ? "border-t-4 border-t-primary" : ""}>
      <CardHeader className={isStandalone ? "pb-2" : "pb-1 pt-3"}>
        <CardTitle className="text-lg flex items-center">
          <Music className="h-5 w-5 mr-2" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent className={isStandalone ? "" : "pt-0"}>
        <div className="flex items-center gap-4">
          <div className={isStandalone ? "flex-1" : ""}>
            <h4 className="font-medium text-base">
              Musique adaptée à votre état : {emotionName}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {musicDescription}
            </p>
          </div>
          <Button 
            onClick={handlePlayMusic} 
            disabled={isLoading || isLoadingMusic}
            variant={isStandalone ? "default" : "outline"}
            className="flex-shrink-0 flex items-center gap-2"
          >
            {isLoading || isLoadingMusic ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Écouter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionBasedMusicRecommendation;
