
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

interface MusicRecommendationCardProps {
  emotion?: string;
  intensity?: number;
  standalone?: boolean;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion = 'calm',
  intensity = 50,
  standalone = false
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();

  const handlePlayMusic = async () => {
    try {
      await loadPlaylistForEmotion(emotion.toLowerCase());
      setOpenDrawer(true); // using the function directly, not returning a value
    } catch (error) {
      console.error('Error loading music:', error);
    }
  };

  return (
    <Card className={standalone ? '' : 'mt-4'}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Music className="mr-2 h-5 w-5" />
          Musique recommandée
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {intensity > 75
            ? `Votre état émotionnel "${emotion}" est intense. Une musique adaptée pourrait vous aider à vous équilibrer.`
            : `Basée sur votre état émotionnel "${emotion}", voici une suggestion musicale pour accompagner votre moment.`}
        </p>
        <Button onClick={handlePlayMusic} className="w-full">
          <Play className="mr-2 h-4 w-4" />
          Écouter la playlist adaptée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
