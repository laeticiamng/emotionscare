
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/music';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import { Volume2 } from 'lucide-react';

interface MusicMoodVisualizationProps {
  mood?: string;
  intensity?: number;
  showControls?: boolean;
}

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({
  mood = 'calm',
  intensity = 0.5,
  showControls = true
}) => {
  const { volume, setVolume, isPlaying, currentEmotion } = useMusic();
  const [visualizerHeight, setVisualizerHeight] = useState(200);
  const [activeMood, setActiveMood] = useState(mood);
  const [activeIntensity, setActiveIntensity] = useState(intensity);
  
  // Use the current emotion from context if available
  useEffect(() => {
    if (currentEmotion) {
      setActiveMood(currentEmotion);
    }
  }, [currentEmotion]);
  
  // Adjust visualizer height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisualizerHeight(140);
      } else {
        setVisualizerHeight(200);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // If there's music playing, visualize it
  const isActive = isPlaying;
  
  // Get mood color based on mood
  const getMoodColor = (mood: string): string => {
    const colors: Record<string, string> = {
      calm: 'bg-blue-500/20',
      happy: 'bg-yellow-500/20',
      sad: 'bg-purple-500/20',
      angry: 'bg-red-500/20',
      focus: 'bg-green-500/20'
    };
    
    return colors[mood.toLowerCase()] || 'bg-blue-500/20';
  };
  
  return (
    <Card className={`w-full overflow-hidden ${getMoodColor(activeMood)}`}>
      <CardContent className="p-0">
        <div className="relative">
          <EnhancedMusicVisualizer 
            mood={activeMood}
            height={visualizerHeight}
            showControls={false}
            intensity={activeIntensity}
            volume={volume}
          />
          
          {showControls && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0] / 100)}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicMoodVisualization;
