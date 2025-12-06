import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Headphones } from '@/components/music/icons';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { EmotionMusicParams } from '@/types/music';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';

interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  title?: string;
  description?: string;
}

export const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion,
  intensity = 0.5,
  title = "Musique recommandée",
  description
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const params: EmotionMusicParams = { emotion, intensity };
      const result = await activateMusicForEmotion(params);
      // Success is already handled in the hook with notifications
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LazyMotionWrapper>
      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="h-full bg-card overflow-hidden relative group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Headphones className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <p className="text-sm mb-4 text-muted-foreground">
            {description || getEmotionMusicDescription(emotion)}
          </p>
          
          <div className="mt-2">
            <Button 
              onClick={handlePlay} 
              disabled={isLoading}
              className="w-full transition-all duration-200"
              size="sm"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </span>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Écouter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </m.div>
    </LazyMotionWrapper>
  );
};

export default MusicRecommendationCard;
