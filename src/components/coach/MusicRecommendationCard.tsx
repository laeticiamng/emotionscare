// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';

interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  className?: string;
}

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({ 
  emotion,
  intensity = 0.7,
  className = ''
}) => {
  const { activateMusicForEmotion, getEmotionMusicDescription } = useMusicEmotionIntegration();
  
  const handleActivateMusic = () => {
    activateMusicForEmotion({ 
      emotion, 
      intensity 
    });
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-medium">Musique adaptée</h3>
            <p className="text-sm text-muted-foreground">
              {getEmotionMusicDescription(emotion)}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleActivateMusic}
          className="w-full mt-4"
          variant="outline"
        >
          Activer la musique
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
