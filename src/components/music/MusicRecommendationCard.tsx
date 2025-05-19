
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Music } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { EmotionMusicParams } from '@/types/music';
import { ensurePlaylist } from '@/utils/musicCompatibility';
import { useToast } from '@/hooks/use-toast';

interface MusicRecommendationCardProps {
  title: string;
  emotion: string;
  icon?: React.ReactNode;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({ title, emotion, icon }) => {
  const [intensity, setIntensity] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const music = useMusic();
  const { toast } = useToast();

  const handleGenerateMusic = async () => {
    setIsLoading(true);
    try {
      // Utiliser loadPlaylistForEmotion s'il existe, sinon simuler
      const params: EmotionMusicParams = {
        emotion: emotion,
        intensity: intensity / 100
      };
      
      let playlist;
      if (music.loadPlaylistForEmotion) {
        playlist = await music.loadPlaylistForEmotion(params);
      } else if (music.getRecommendationByEmotion) {
        playlist = await music.getRecommendationByEmotion(params); // Fixed: removed the second argument
      } else {
        // Simulation si aucune méthode n'est disponible
        toast({
          title: "Fonctionnalité limitée",
          description: "La génération de musique par émotion n'est pas disponible actuellement."
        });
        setIsLoading(false);
        return;
      }
      
      if (playlist) {
        const formattedPlaylist = ensurePlaylist(playlist);
        
        if (formattedPlaylist.tracks.length > 0) {
          if (music.setPlaylist) music.setPlaylist(formattedPlaylist);
          if (music.setCurrentTrack) music.setCurrentTrack(formattedPlaylist.tracks[0]);
          if (music.setOpenDrawer) music.setOpenDrawer(true);
          
          toast({
            title: "Playlist générée",
            description: `${formattedPlaylist.tracks.length} morceaux basés sur l'émotion "${emotion}"`
          });
        } else {
          toast({
            title: "Aucun morceau trouvé",
            description: "Essayez avec une autre émotion ou un autre niveau d'intensité",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error generating music:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la musique. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon || <Music className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Intensité</span>
            <span className="font-medium">{intensity}%</span>
          </div>
          <Slider
            value={[intensity]}
            min={0}
            max={100}
            step={5}
            onValueChange={(vals) => setIntensity(vals[0])}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="default"
          onClick={handleGenerateMusic}
          disabled={isLoading}
        >
          <Play className="h-4 w-4 mr-2" />
          {isLoading ? 'Génération...' : 'Générer'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicRecommendationCard;
