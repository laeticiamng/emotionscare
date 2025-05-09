
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Loader2, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { safeOpen } from '@/lib/utils';

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
  
  const handlePlayMusic = () => {
    if (!emotionResult.emotion) return;
    
    const emotion = emotionResult.emotion.toLowerCase();
    const playlist = loadPlaylistForEmotion(emotion);
    
    if (playlist && playlist.tracks && playlist.tracks.length > 0) {
      // Ensure the track has the required duration and url fields
      const track = {
        ...playlist.tracks[0],
        duration: playlist.tracks[0].duration || 0,
        url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || ''
      };
      playTrack(track);
      safeOpen(setOpenDrawer);
      
      toast({
        title: "Musique lancée",
        description: `Lecture de '${playlist.tracks[0].title}' démarrée`,
      });
    } else {
      toast({
        title: "Aucune musique disponible",
        description: `Aucune playlist n'a été trouvée pour l'émotion ${emotionResult.emotion}`,
        variant: "destructive"
      });
    }
  };

  const isStandalone = variant === 'standalone';

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
              Musique adaptée à votre état : {emotionResult.emotion}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Écoutez une sélection musicale conçue pour accompagner et améliorer votre état émotionnel actuel.
            </p>
          </div>
          <Button 
            onClick={handlePlayMusic} 
            disabled={isLoading}
            variant={isStandalone ? "default" : "outline"}
            className="flex-shrink-0 flex items-center gap-2"
          >
            {isLoading ? (
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
