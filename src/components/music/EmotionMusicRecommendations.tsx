
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Loader2 } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface EmotionMusicRecommendationsProps {
  emotionResult?: EmotionResult;
}

const EMOTION_TO_GENRE: Record<string, string> = {
  'happy': 'Positive et énergisante',
  'calm': 'Relaxante et apaisante',
  'focused': 'Concentrée et productive',
  'energetic': 'Dynamique et motivante',
  'creative': 'Inspirante et imaginative',
  'sad': 'Mélancolique et réconfortante',
  'anxious': 'Apaisante et rassurante',
  'angry': 'Calmante et stabilisante',
  'neutral': 'Équilibrée et harmonieuse'
};

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({ 
  emotionResult 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedGenre, setRecommendedGenre] = useState<string>('');
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  
  useEffect(() => {
    if (emotionResult && emotionResult.emotion) {
      const emotion = emotionResult.emotion.toLowerCase();
      const genre = EMOTION_TO_GENRE[emotion] || EMOTION_TO_GENRE.neutral;
      setRecommendedGenre(genre);
    }
  }, [emotionResult]);
  
  const handlePlayMusic = async () => {
    if (!emotionResult || !emotionResult.emotion) {
      toast({
        title: "Information manquante",
        description: "Impossible de déterminer votre état émotionnel",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const emotion = emotionResult.emotion.toLowerCase();
      const playlist = await loadPlaylistForEmotion(emotion);
      
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        // Play first track
        playTrack(playlist.tracks[0]);
        // Open drawer
        setOpenDrawer(true);
        
        toast({
          title: "Musique thérapeutique",
          description: `Playlist "${emotion}" chargée pour accompagner votre humeur`
        });
      } else {
        toast({
          title: "Playlist non disponible",
          description: "Aucune musique disponible pour cette émotion",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Handle error safely with type checking
      let errorMessage = "Une erreur est survenue";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as Error).message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!emotionResult) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Music className="h-5 w-5 mr-2" />
          Musique thérapeutique recommandée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium">Basé sur votre humeur: {emotionResult.emotion}</p>
            <p className="text-sm text-muted-foreground">
              Nous vous recommandons d'écouter une musique {recommendedGenre.toLowerCase()} 
              pour optimiser votre bien-être émotionnel.
            </p>
          </div>
          
          <Button 
            onClick={handlePlayMusic} 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            <span>{isLoading ? "Chargement..." : "Écouter la musique recommandée"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
