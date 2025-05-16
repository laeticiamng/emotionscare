
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { Music } from 'lucide-react';
import { EmotionMusicParams, MusicPlaylist } from '@/types/music';
import { toast } from '@/hooks/use-toast';

interface MoodBasedRecommendationsProps {
  mood: string;
  intensity?: number;
  standalone?: boolean;
  onSelect?: (playlist: MusicPlaylist | null) => void;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ 
  mood, 
  intensity = 0.5,
  standalone = false,
  onSelect
}) => {
  const { loadPlaylistForEmotion } = useMusic();
  
  const handleSelectPlaylist = async () => {
    try {
      const params: EmotionMusicParams = {
        emotion: mood,
        intensity
      };
      
      const playlist = await loadPlaylistForEmotion(params);
      
      if (playlist && onSelect) {
        onSelect(playlist);
      } else if (!playlist) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la playlist correspondante.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading mood-based playlist:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement de la playlist.",
        variant: "destructive"
      });
    }
  };
  
  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      calm: '😌',
      anxious: '😰',
      focused: '🧐',
      neutral: '😐',
      energetic: '⚡'
    };
    
    return emojiMap[mood.toLowerCase()] || '🎵';
  };
  
  const getMoodDescription = (mood: string): string => {
    const descriptionMap: Record<string, string> = {
      happy: "Musique joyeuse pour amplifier votre bonne humeur",
      sad: "Mélodies apaisantes pour vous accompagner dans ce moment",
      angry: "Sons relaxants pour aider à gérer les émotions fortes",
      calm: "Ambiance sereine pour maintenir votre tranquillité",
      anxious: "Compositions douces pour réduire le stress",
      focused: "Rythmes ambiants pour améliorer votre concentration",
      neutral: "Sélection équilibrée adaptée à votre journée",
      energetic: "Beats dynamiques pour booster votre énergie"
    };
    
    return descriptionMap[mood.toLowerCase()] || "Musique adaptée à votre état d'esprit";
  };
  
  return (
    <Card className={standalone ? "w-full" : "mt-4"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5" />
          Musique recommandée : {mood} {getMoodEmoji(mood)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <p className="text-sm">
            {getMoodDescription(mood)}
          </p>
          <Button onClick={handleSelectPlaylist} className="w-full">
            Écouter cette playlist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
