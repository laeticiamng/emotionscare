
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types/emotion';

interface MusicEmotionRecommendationProps {
  emotionResult: EmotionResult;
}

const MusicEmotionRecommendation: React.FC<MusicEmotionRecommendationProps> = ({ emotionResult }) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();
  
  const handleActivateMusic = async () => {
    try {
      await loadPlaylistForEmotion({
        emotion: emotionResult.emotion.toLowerCase(),
        intensity: emotionResult.confidence
      });
      
      // Since loadPlaylistForEmotion returns void, we can continue execution
      setOpenDrawer(true);
      toast({
        title: 'Musique activée',
        description: `Une playlist adaptée à votre humeur ${emotionResult.emotion} est maintenant active.`,
      });
    } catch (error) {
      console.error('Error activating music for emotion:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'activer la musique adaptée à votre humeur.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          Recommandation musicale
        </CardTitle>
        <CardDescription>
          Musique adaptée à votre état émotionnel actuel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Nous avons sélectionné une playlist qui correspond à votre émotion dominante :
          <span className="font-semibold text-primary ml-1">
            {emotionResult.emotion}
          </span>
        </p>
        <Button onClick={handleActivateMusic} className="w-full">
          <Play className="mr-2 h-4 w-4" /> Écouter la playlist recommandée
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicEmotionRecommendation;
