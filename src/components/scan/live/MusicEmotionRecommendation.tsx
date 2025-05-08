
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Loader2, PlayCircle } from 'lucide-react';
import { EmotionResult } from '@/types';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
  isLoading?: boolean;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({
  emotionResult,
  isLoading = false
}) => {
  const { loadPlaylistForEmotion, playTrack } = useMusic();
  const { toast } = useToast();
  
  const handlePlayMusic = () => {
    if (!emotionResult.emotion) return;
    
    const playlist = loadPlaylistForEmotion(emotionResult.emotion.toLowerCase());
    
    if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
      
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recommandation musicale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
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
            variant="outline"
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-1" />
                Écouter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
