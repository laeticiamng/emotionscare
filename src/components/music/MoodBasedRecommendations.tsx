import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Sparkles } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

interface MoodBasedRecommendationsProps {
  mood?: string;
  intensity?: number;
  standalone?: boolean;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({
  mood = 'neutral',
  intensity = 50,
  standalone = false,
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const handlePlayRecommendedMusic = () => {
    // Map mood to music type if needed
    const musicType = mood.toLowerCase();
    
    loadPlaylistForEmotion(musicType);
    setOpenDrawer(true);
    
    toast({
      title: "Musique recommandée activée",
      description: `Playlist "${mood}" chargée pour accompagner votre humeur.`
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
        <div className="mb-3">
          <h4 className="font-medium mb-1">
            {mood === 'neutral' 
              ? "Ambiance musicale équilibrée" 
              : `Ambiance adaptée à votre humeur: ${mood}`}
          </h4>
          <p className="text-sm text-muted-foreground">Des mélodies adaptées à votre état émotionnel</p>
        </div>
        
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

export default MoodBasedRecommendations;
