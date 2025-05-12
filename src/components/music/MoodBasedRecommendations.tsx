
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodBasedRecommendationsProps {
  mood: string;
  intensity?: number;
  standalone?: boolean;
}

const MOOD_LABELS: Record<string, string> = {
  calm: "Calme et relaxation",
  happy: "Énergie et joie",
  focus: "Concentration",
  sad: "Réconfort",
  anxious: "Apaisement",
  neutral: "Équilibre"
};

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ 
  mood, 
  intensity = 50, 
  standalone = false 
}) => {
  const { loadPlaylistForEmotion, playTrack, currentTrack } = useMusic();
  const { toast } = useToast();
  
  const handlePlayRecommended = async () => {
    try {
      const playlist = await loadPlaylistForEmotion(mood);
      
      if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
        toast({
          title: "Musique lancée",
          description: `Lecture de la playlist "${playlist.title}"`
        });
      } else {
        toast({
          title: "Aucune musique disponible",
          description: "Pas de recommandation disponible pour cette émotion.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des recommandations musicales:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les recommandations musicales.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className={standalone ? 'w-full' : 'max-w-md mx-auto'}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Recommandation musicale</h3>
            <p className="text-sm text-muted-foreground">
              Basée sur votre humeur: <span className="font-medium">{MOOD_LABELS[mood] || mood}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-lg">
          <p className="text-sm">
            {intensity > 70 ? (
              "Notre algorithme a détecté une forte intensité émotionnelle. Voici une sélection musicale pour vous accompagner."
            ) : intensity > 40 ? (
              "Voici une sélection musicale adaptée à votre état émotionnel actuel."
            ) : (
              "Voici une douce sélection musicale pour maintenir votre équilibre émotionnel."
            )}
          </p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 px-6 pb-6">
        <Button 
          className="w-full"
          onClick={handlePlayRecommended}
          disabled={currentTrack?.id === `track-${mood}`}
        >
          <Play className="h-4 w-4 mr-2" /> 
          Écouter la recommandation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodBasedRecommendations;
