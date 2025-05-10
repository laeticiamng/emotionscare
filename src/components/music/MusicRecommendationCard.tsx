
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, PlayCircle, Loader2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicRecommendationCardProps } from '@/types';
import { useToast } from '@/hooks/use-toast';

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion = 'neutral',
  intensity = 50,
  standalone = false
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const handlePlayMusic = async () => {
    setIsLoading(true);
    try {
      // Format emotion to lowercase for consistency
      const formattedEmotion = emotion?.toLowerCase() || 'neutral';
      
      // Load the playlist
      await loadPlaylistForEmotion(formattedEmotion);
      
      // Open the music drawer
      setOpenDrawer(true);
      
      toast({
        title: "Musique thérapeutique",
        description: `Playlist adaptée à votre humeur "${emotion}" activée.`,
      });
    } catch (error) {
      console.error("Error loading music:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique recommandée",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={standalone ? "border-t-4 border-t-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-base flex items-center">
              <Music className="h-4 w-4 mr-2 text-primary" />
              Musique recommandée
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {intensity > 70 
                ? `Musique apaisante pour équilibrer votre état émotionnel`
                : `Musique pour accompagner votre état émotionnel actuel`}
            </p>
          </div>
          <Button
            onClick={handlePlayMusic}
            disabled={isLoading}
            variant={standalone ? "default" : "outline"}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <PlayCircle className="h-4 w-4 mr-2" />
                Écouter
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
