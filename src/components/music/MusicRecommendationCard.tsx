
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';
import { safeOpen } from '@/lib/utils';
import EmotionBasedMusicRecommendation from './EmotionBasedMusicRecommendation';

interface MusicRecommendationCardProps {
  emotion?: string;
  intensity?: number;
  standalone?: boolean;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion = 'neutral',
  intensity = 50,
  standalone = false,
}) => {
  const { loadPlaylistForEmotion, openDrawer, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  // Si nous avons une émotion spécifique, utiliser le composant centralisé
  if (emotion) {
    // Créer un objet EmotionResult simulé pour le composant EmotionBasedMusicRecommendation
    const emotionResult = {
      emotion: emotion,
      confidence: intensity / 100,
      transcript: ""
    };

    return (
      <EmotionBasedMusicRecommendation
        emotionResult={emotionResult}
        variant={standalone ? "standalone" : "compact"}
      />
    );
  }
  
  // Fallback au comportement original (ne devrait plus être utilisé)
  const handlePlayRecommendedMusic = () => {
    const musicType = emotion.toLowerCase();
    
    loadPlaylistForEmotion(musicType);
    safeOpen(setOpenDrawer);
    
    toast({
      title: "Musique recommandée activée",
      description: `Playlist "${emotion}" chargée pour accompagner votre humeur.`
    });
  };

  return (
    <Card className={standalone ? 'border-t-4 border-t-primary' : ''}>
      <CardHeader className={standalone ? "pb-2" : "pb-1 pt-3"}>
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Recommandation musicale
        </CardTitle>
      </CardHeader>
      <CardContent className={standalone ? '' : 'pt-0'}>
        <Button 
          onClick={handlePlayRecommendedMusic}
          className="w-full flex items-center justify-center gap-2"
          variant={standalone ? 'default' : 'outline'}
        >
          <Sparkles className="h-4 w-4" />
          Écouter la playlist recommandée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
