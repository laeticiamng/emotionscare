
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { MusicRecommendationCardProps } from '@/types/music';

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({ 
  emotion,
  intensity = 50,
  standalone = false,
  className = ''
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();

  const handlePlayMusic = async () => {
    await loadPlaylistForEmotion(emotion);
    setOpenDrawer(true);
  };

  const getEmotionRecommendation = (emotion: string): { title: string; description: string } => {
    // Default recommendation
    let recommendation = {
      title: "Playlist personnalisée",
      description: "Une sélection musicale adaptée à votre humeur du moment."
    };

    // Emotion-based recommendations
    switch(emotion.toLowerCase()) {
      case 'happy':
      case 'joy':
      case 'excited':
        recommendation = {
          title: "Amplificateur de joie",
          description: "Des morceaux entraînants pour maintenir votre bonne humeur."
        };
        break;
      case 'sad':
      case 'depressed':
        recommendation = {
          title: "Réconfort musical",
          description: "Des mélodies apaisantes pour vous accompagner et vous réconforter."
        };
        break;
      case 'angry':
      case 'frustrated':
        recommendation = {
          title: "Canalisateur d'énergie",
          description: "Des morceaux pour transformer cette énergie en quelque chose de positif."
        };
        break;
      case 'anxious':
      case 'stressed':
        recommendation = {
          title: "Détente profonde",
          description: "Des compositions relaxantes pour apaiser votre anxiété."
        };
        break;
      case 'calm':
      case 'relaxed':
        recommendation = {
          title: "Maintien de la sérénité",
          description: "Des morceaux doux pour préserver votre état de calme."
        };
        break;
      case 'focused':
        recommendation = {
          title: "Concentration optimale",
          description: "Des morceaux sans paroles pour améliorer votre concentration."
        };
        break;
    }

    return recommendation;
  };

  const recommendation = getEmotionRecommendation(emotion);

  return (
    <Card className={`${className} ${standalone ? 'border-primary/30' : ''}`}>
      <CardContent className={`${standalone ? 'p-4' : 'p-3'}`}>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Music className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{recommendation.title}</h3>
            <p className="text-xs text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
        <Button 
          onClick={handlePlayMusic}
          className="w-full mt-3"
          size="sm"
        >
          <Play className="h-4 w-4 mr-2" />
          Écouter la playlist
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
