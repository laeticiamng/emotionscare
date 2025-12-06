
import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  className?: string;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({
  emotion = "calm",
  className = ""
}) => {
  const music = useMusic();
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  const [recommendedEmotion, setRecommendedEmotion] = useState(emotion);
  
  // Textes par émotion
  const emotionTexts: Record<string, { title: string; description: string }> = {
    calm: {
      title: "Musique apaisante",
      description: "Des sons pour vous aider à vous détendre et à vous recentrer."
    },
    focused: {
      title: "Concentration optimale",
      description: "Mélodies idéales pour améliorer votre concentration et productivité."
    },
    energetic: {
      title: "Boost d'énergie",
      description: "Rythmes dynamiques pour vous motiver et stimuler votre énergie."
    },
    sad: {
      title: "Réconfort émotionnel",
      description: "Des mélodies douces pour accompagner vos moments de mélancolie."
    },
    stressed: {
      title: "Anti-stress",
      description: "Sons relaxants pour diminuer votre anxiété et retrouver la sérénité."
    }
  };
  
  const currentEmotionData = emotionTexts[recommendedEmotion] || emotionTexts.calm;
  
  useEffect(() => {
    // Mettre à jour la recommandation si l'émotion change
    if (emotion) {
      setRecommendedEmotion(emotion);
    }
  }, [emotion]);

  const handlePlayMusic = async () => {
    try {
      await activateMusicForEmotion({ emotion: recommendedEmotion });
    } catch (error) {
      logger.error('Error activating music', error, 'MUSIC');
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="mr-2 h-5 w-5 text-primary" />
          {currentEmotionData.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {currentEmotionData.description}
        </p>
        <Button 
          onClick={handlePlayMusic}
          className="w-full"
          variant="default"
        >
          <Play className="mr-2 h-4 w-4" />
          Écouter la musique recommandée
        </Button>
      </CardContent>
    </Card>
  );
}

export default EmotionMusicRecommendations;
