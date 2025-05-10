
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { MusicRecommendationCardProps } from '@/types/music';

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion,
  intensity = 50,
  standalone = false,
  className = ''
}) => {
  const { toast } = useToast();
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  
  const handlePlayMusic = async () => {
    if (!emotion) return;
    
    try {
      await loadPlaylistForEmotion?.(emotion.toLowerCase());
      setOpenDrawer?.(true);
      
      toast({
        title: "Musique activée",
        description: `Playlist adaptée à votre humeur ${emotion} chargée.`,
      });
    } catch (error) {
      console.error("Error loading playlist:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className={`${standalone ? '' : 'mt-4'} ${className}`}>
      <CardContent className={`${standalone ? 'p-4' : 'p-3'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-medium">Recommandation musicale</h3>
        </div>
        
        <p className="text-sm mb-3">
          La musique adaptée à votre état émotionnel <span className="font-medium">{emotion}</span> peut 
          {intensity > 70 
            ? " vous aider à réguler vos émotions et retrouver l'équilibre." 
            : " renforcer votre bien-être actuel."}
        </p>
        
        <Button 
          onClick={handlePlayMusic} 
          size="sm" 
          className="w-full"
        >
          <Music className="h-4 w-4 mr-2" />
          Écouter la playlist adaptée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
