
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useMusic } from '@/contexts/MusicContext';
import AudioVisualizer from './AudioVisualizer';
import { useTheme } from '@/contexts/ThemeContext';

interface EmotionMusicVisualizerProps {
  emotion?: string;
  intensity?: number;
  className?: string;
}

const EmotionMusicVisualizer: React.FC<EmotionMusicVisualizerProps> = ({ 
  emotion = 'neutral',
  intensity = 50,
  className
}) => {
  const { currentTrack, isPlaying } = useMusic();
  const { theme } = useTheme();
  const [visualizerType, setVisualizerType] = useState<'bars' | 'circle' | 'wave'>('bars');
  const [primaryColor, setPrimaryColor] = useState<string>('#6366F1');
  const [secondaryColor, setSecondaryColor] = useState<string>('#818CF8');
  
  // Map emotions to visualizer types and colors
  useEffect(() => {
    // Determine visualization based on emotion
    switch(emotion.toLowerCase()) {
      case 'happy':
      case 'energetic':
        setVisualizerType('bars');
        setPrimaryColor(theme === 'dark' ? '#FBBF24' : '#F59E0B');
        setSecondaryColor(theme === 'dark' ? '#FCD34D' : '#FBBF24');
        break;
      case 'calm':
      case 'relaxed':
        setVisualizerType('wave');
        setPrimaryColor(theme === 'dark' ? '#3B82F6' : '#2563EB');
        setSecondaryColor(theme === 'dark' ? '#60A5FA' : '#3B82F6');
        break;
      case 'focused':
      case 'concentrated':
        setVisualizerType('circle');
        setPrimaryColor(theme === 'dark' ? '#8B5CF6' : '#7C3AED');
        setSecondaryColor(theme === 'dark' ? '#A78BFA' : '#8B5CF6');
        break;
      case 'melancholic':
      case 'sad':
        setVisualizerType('wave');
        setPrimaryColor(theme === 'dark' ? '#6B7280' : '#4B5563');
        setSecondaryColor(theme === 'dark' ? '#9CA3AF' : '#6B7280');
        break;
      default:
        setVisualizerType('bars');
        setPrimaryColor(theme === 'dark' ? '#6366F1' : '#4F46E5');
        setSecondaryColor(theme === 'dark' ? '#A5B4FC' : '#818CF8');
    }
  }, [emotion, theme]);

  // Adjust intensity
  const visualizerHeight = Math.max(80, Math.min(140, 80 + intensity / 2));

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {currentTrack ? (
          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              {emotion === 'neutral' 
                ? "Visualisation musicale" 
                : `Visualisation adaptée à votre humeur: ${emotion}`}
            </div>
            
            <AudioVisualizer 
              audioUrl={currentTrack.url}
              isPlaying={isPlaying}
              variant={visualizerType}
              height={visualizerHeight}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
            
            <div className="text-xs text-center text-muted-foreground">
              {currentTrack.title} • {currentTrack.artist}
            </div>
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
            Lancez une piste audio pour voir la visualisation
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionMusicVisualizer;
