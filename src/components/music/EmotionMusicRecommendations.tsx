
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Loader2, RefreshCw } from 'lucide-react';
import { useMusicRecommendation } from '@/hooks/useMusicRecommendation';
import { Badge } from '@/components/ui/badge';
import MusicMoodVisualization from './page/MusicMoodVisualization';

interface EmotionMusicRecommendationsProps {
  emotion?: string;
  intensity?: number;
}

const EmotionMusicRecommendations: React.FC<EmotionMusicRecommendationsProps> = ({ 
  emotion = 'calm',
  intensity = 60 
}) => {
  const { 
    isLoading, 
    loadMusicForMood, 
    togglePlayPause, 
    currentTrack,
    error 
  } = useMusicRecommendation();
  
  // Charger la musique correspondante à l'émotion au montage
  useEffect(() => {
    if (emotion) {
      loadMusicForMood(emotion);
    }
  }, [emotion, loadMusicForMood]);
  
  const handleRetry = () => {
    loadMusicForMood(emotion);
  };
  
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Musique adaptée à votre état</h3>
          </div>
          <Badge variant="outline" className="capitalize">
            {emotion}
          </Badge>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            <div className="h-28 md:h-40">
              <MusicMoodVisualization 
                mood={emotion} 
                intensity={intensity} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {currentTrack?.title || "Titre inconnu"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTrack?.artist || "Artiste inconnu"}
                </p>
              </div>
              
              <Button 
                onClick={togglePlayPause}
                size="icon"
                className="rounded-full h-10 w-10"
              >
                {currentTrack?.isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionMusicRecommendations;
