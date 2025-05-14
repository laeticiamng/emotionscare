
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { Music2 } from 'lucide-react';

interface MusicEmotionRecommendationProps {
  emotion: any;
  intensity: number;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotion, intensity }) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();

  // Update emotion handling when primaryEmotion is a string, not an object with name
  const getEmotionText = () => {
    if (typeof emotion === 'string') {
      return emotion;
    } else if (emotion?.primaryEmotion) {
      return typeof emotion.primaryEmotion === 'string' 
        ? emotion.primaryEmotion 
        : emotion.primaryEmotion.name;
    } else if (emotion?.emotion) {
      return emotion.emotion;
    }
    return 'neutral';
  };

  const handlePlayMusic = async () => {
    const emotionText = getEmotionText().toLowerCase();
    await loadPlaylistForEmotion(emotionText);
    setOpenDrawer(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music2 className="mr-2 h-4 w-4" />
          Recommandation Musicale
        </CardTitle>
        <CardDescription>
          Musique adaptée à votre état émotionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Nous vous recommandons une playlist basée sur votre émotion actuelle: 
          {getEmotionText()} (intensité: {intensity}%)
        </p>
        <Button onClick={handlePlayMusic} className="mt-4">
          Écouter maintenant
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
