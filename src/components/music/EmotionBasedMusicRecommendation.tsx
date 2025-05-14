
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Loader2, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

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
  
  // Default intensity if not available
  const emotionIntensity = emotionResult.intensity !== undefined ? emotionResult.intensity : 50;
  
  const getEmotionMusicDescription = (emotion: string) => {
    const descriptions: Record<string, string> = {
      happy: "Des mélodies entraînantes et positives pour amplifier votre bonne humeur",
      sad: "Des compositions douces et apaisantes pour vous accompagner dans ce moment",
      angry: "Des sons calmes et apaisants pour réduire le stress et retrouver l'équilibre",
      fear: "Des mélodies rassurantes et structurées pour vous ancrer dans le présent",
      neutral: "Une ambiance musicale équilibrée pour maintenir votre harmonie émotionnelle",
      joy: "Des rythmes entraînants pour célébrer votre joie",
      calm: "Des sons doux qui soutiennent votre sérénité",
      anxiety: "Des compositions structurées pour apaiser l'inquiétude"
    };
    
    return descriptions[emotion?.toLowerCase()] || 
      "Une sélection musicale harmonisée avec votre état émotionnel actuel";
  };
  
  const activateMusicForEmotion = async ({ 
    emotion, 
    intensity = 50 
  }: { 
    emotion: string; 
    intensity: number 
  }) => {
    if (!loadPlaylistForEmotion) {
      console.error("loadPlaylistForEmotion function is not available");
      return false;
    }
    
    try {
      const playlist = await loadPlaylistForEmotion(emotion);
      
      if (playlist?.tracks?.length > 0) {
        playTrack(playlist.tracks[0]);
        toast({
          title: "Musique activée",
          description: `Écoute adaptée à votre état émotionnel: ${emotion}`
        });
        return true;
      } else {
        console.error("No tracks found for emotion", emotion);
        return false;
      }
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      return false;
    }
  };

  const handlePlayMusic = async () => {
    if (!emotionResult.emotion) return;
    
    setIsLoadingMusic(true);
    try {
      const emotion = emotionResult.emotion.toLowerCase();
      
      const success = await activateMusicForEmotion({
        emotion,
        intensity: emotionIntensity
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
