
import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '@/contexts/MusicContext';
import AudioVisualizer from './AudioVisualizer';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Volume2, Music, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedMusicVisualizerProps {
  emotion?: string;
  showControls?: boolean;
  height?: number;
  className?: string;
  intensity?: number;
  volume?: number;
}

/**
 * Composant qui affiche un visualiseur de musique amélioré avec des contrôles
 * et une interface plus attrayante basée sur l'état émotionnel
 */
const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({
  emotion = 'neutral',
  showControls = true,
  height = 120,
  className,
  intensity = 50,
  volume = 1
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack,
    nextTrack,
    previousTrack,
    volume: contextVolume,
    setVolume 
  } = useMusic();
  
  const [visualizerStyle, setVisualizerStyle] = useState<{
    variant: 'bars' | 'wave' | 'circle';
    primaryColor: string;
    secondaryColor: string;
  }>({
    variant: 'bars',
    primaryColor: '#6366F1',
    secondaryColor: '#818CF8'
  });
  
  // Définir le style du visualiseur en fonction de l'émotion
  useEffect(() => {
    const emotionStyles: Record<string, typeof visualizerStyle> = {
      happy: {
        variant: 'bars',
        primaryColor: '#F59E0B',
        secondaryColor: '#FBBF24'
      },
      calm: {
        variant: 'wave',
        primaryColor: '#3B82F6',
        secondaryColor: '#60A5FA'
      },
      focused: {
        variant: 'circle',
        primaryColor: '#7C3AED',
        secondaryColor: '#8B5CF6'
      },
      energetic: {
        variant: 'bars',
        primaryColor: '#F97316',
        secondaryColor: '#FB923C'
      },
      melancholic: {
        variant: 'wave',
        primaryColor: '#6B7280',
        secondaryColor: '#9CA3AF'
      },
      neutral: {
        variant: 'bars',
        primaryColor: '#6366F1',
        secondaryColor: '#818CF8'
      }
    };
    
    const normalizedEmotion = emotion?.toLowerCase() || 'neutral';
    setVisualizerStyle(emotionStyles[normalizedEmotion] || emotionStyles.neutral);
  }, [emotion]);

  // Gérer les changements de volume
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  
  // Gérer la lecture ou la pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  // Use the provided volume to adjust intensity and visualization
  const effectiveVolume = volume !== undefined ? volume : contextVolume;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="rounded-md bg-muted/30 p-2 overflow-hidden">
          <AudioVisualizer
            audioUrl={currentTrack?.url}
            isPlaying={isPlaying && effectiveVolume > 0} // Only show playing visualization if not muted
            variant={visualizerStyle.variant}
            height={height}
            primaryColor={visualizerStyle.primaryColor}
            secondaryColor={visualizerStyle.secondaryColor}
            intensity={intensity} // Use the intensity prop
          />
        </div>
        
        {showControls && (
          <div className="mt-3 space-y-3">
            {currentTrack && (
              <div className="text-sm truncate">
                <div className="font-medium">{currentTrack.title}</div>
                <div className="text-muted-foreground text-xs">{currentTrack.artist}</div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={previousTrack}
                disabled={!currentTrack}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon"
                className="h-10 w-10" 
                onClick={togglePlayPause}
                disabled={!currentTrack}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={nextTrack}
                disabled={!currentTrack}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                defaultValue={[effectiveVolume * 100]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMusicVisualizer;
