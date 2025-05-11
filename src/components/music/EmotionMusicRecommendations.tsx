
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Loader2 } from 'lucide-react';
import { EmotionResult, MusicPlaylist } from '@/types';
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
  const [recommendedPlaylist, setRecommendedPlaylist] = useState<MusicPlaylist | null>(null);
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  
  useEffect(() => {
    if (emotionResult && emotionResult.emotion) {
      const emotion = emotionResult.emotion.toLowerCase();
      const genre = EMOTION_TO_GENRE[emotion] || EMOTION_TO_GENRE.neutral;
      setRecommendedGenre(genre);
      
      // Charger la playlist selon l'émotion
      const loadPlaylist = async () => {
        if (loadPlaylistForEmotion) {
          setIsLoading(true);
          try {
            const playlist = await loadPlaylistForEmotion(emotion);
            setRecommendedPlaylist(playlist);
          } catch (err) {
            console.error('Erreur lors du chargement de la playlist:', err);
          } finally {
            setIsLoading(false);
          }
        }
      };
      
      loadPlaylist();
    }
  }, [emotionResult, loadPlaylistForEmotion]);
  
  const handlePlay = () => {
    if (recommendedPlaylist && recommendedPlaylist.tracks.length > 0) {
      // Ensure track has url
      const trackWithUrl = {
        ...recommendedPlaylist.tracks[0],
        url: recommendedPlaylist.tracks[0].url || recommendedPlaylist.tracks[0].audioUrl || recommendedPlaylist.tracks[0].audio_url || ''
      };
      playTrack(trackWithUrl);
      setOpenDrawer(true);
      
      toast({
        title: "Lecture en cours",
        description: `Playlist "${recommendedPlaylist.name}" basée sur votre humeur`,
      });
    }
  };
  
  if (!emotionResult) {
    return null;
  }
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Music className="mr-2 h-5 w-5 text-primary" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p>Selon votre humeur actuelle, nous vous proposons :</p>
          
          <div className="mt-3 p-3 bg-muted/30 rounded-md">
            <div className="font-medium">{recommendedGenre}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Musique adaptée pour {emotionResult.emotion === "joy" ? "amplifier" : "équilibrer"} votre état émotionnel
            </p>
          </div>
          
          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-xs">Chargement de la playlist...</span>
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={handlePlay}
                disabled={!recommendedPlaylist}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Écouter la playlist recommandée
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
