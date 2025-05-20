
import React, { useEffect, useState } from 'react';
import { VRSessionTemplate } from '@/types/vr';
import { useMusicEmotionIntegration } from '@/hooks/useMusicEmotionIntegration';
import { Button } from '@/components/ui/button';
import { Music, Pause } from 'lucide-react';

interface VRMusicIntegrationProps {
  template: VRSessionTemplate;
  emotionTarget: string;
  onMusicReady?: () => void;
}

const VRMusicIntegration: React.FC<VRMusicIntegrationProps> = ({
  template,
  emotionTarget,
  onMusicReady
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicLoaded, setIsMusicLoaded] = useState(false);
  const { getMusicRecommendationForEmotion, playEmotion, getEmotionMusicDescription, isLoading } = useMusicEmotionIntegration();
  
  const recommendedMood = template.recommendedMood || emotionTarget || 'calm';
  
  useEffect(() => {
    // Auto-play background music if available
    if (recommendedMood && !isMusicLoaded) {
      loadMusicForEmotion();
    }
  }, [recommendedMood]);
  
  const loadMusicForEmotion = async () => {
    try {
      if (playEmotion) {
        const result = await playEmotion(recommendedMood);
        if (result !== null) {
          setIsPlaying(true);
          setIsMusicLoaded(true);
          
          if (onMusicReady) {
            onMusicReady();
          }
        }
      }
    } catch (error) {
      console.error('Error loading VR music:', error);
    }
  };
  
  const toggleMusic = () => {
    if (isPlaying) {
      // Logic to pause music would go here
      setIsPlaying(false);
    } else {
      loadMusicForEmotion();
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Ambiance sonore</h3>
      <p className="text-sm text-muted-foreground">{getEmotionMusicDescription(recommendedMood)}</p>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMusic}
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Music className="h-4 w-4" />
              <span>Écouter</span>
            </>
          )}
        </Button>
        
        {isPlaying && (
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-primary animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VRMusicIntegration;
