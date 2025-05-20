
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, Volume2 } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { motion } from 'framer-motion';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);
  
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
    setIsLoadingMusic(true);
    try {
      const result = await activateMusicForEmotion({ emotion: recommendedEmotion });
      if (result) {
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing music:', error);
    } finally {
      setIsLoadingMusic(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <CardTitle className="flex items-center">
            <Music className="mr-2 h-5 w-5 text-primary animate-pulse-subtle" />
            {currentEmotionData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-4">
            {currentEmotionData.description}
          </p>
          <Button 
            onClick={handlePlayMusic}
            className="w-full group hover:shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
            variant="default"
            disabled={isLoadingMusic}
          >
            {isPlaying ? (
              <>
                <Volume2 className="mr-2 h-4 w-4 animate-pulse" />
                <span>En cours de lecture</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Écouter la musique recommandée</span>
              </>
            )}
            
            {isLoadingMusic && (
              <span className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                <span className="loading-dots">
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                  <div className="bg-white"></div>
                </span>
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmotionMusicRecommendations;
