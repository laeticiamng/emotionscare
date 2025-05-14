import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { Music2 } from 'lucide-react';

interface MusicEmotionRecommendationProps {
  emotion: any;
  intensity: number;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotion, intensity }) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();

  // Update emotion handling when primaryEmotion is a string, not an object with name
  const emotionText = typeof emotion === 'string' 
    ? emotion 
    : (emotion?.primaryEmotion || emotion?.emotion);

  const handlePlayMusic = async () => {
    if (typeof emotionText === 'string') {
      await loadPlaylistForEmotion(emotionText.toLowerCase());
      setOpenDrawer(true);
    } else if (emotionText && typeof emotionText.name === 'string') {
      await loadPlaylistForEmotion(emotionText.name.toLowerCase());
      setOpenDrawer(true);
    }
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
          {typeof emotionText === 'string' ? emotionText : emotionText?.name} (intensité: {intensity}%)
        </p>
        <Button onClick={handlePlayMusic} className="mt-4">
          Écouter maintenant
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
