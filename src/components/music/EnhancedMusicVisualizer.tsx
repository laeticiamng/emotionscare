
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Card } from '@/components/ui/card';

interface EnhancedMusicVisualizerProps {
  showControls?: boolean;
  height?: number;
  emotion?: string;
  intensity?: number;
  className?: string;
}

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({
  showControls = true,
  height = 120,
  emotion = 'neutral',
  intensity = 50,
  className = ''
}) => {
  const { isPlaying, currentTrack } = useMusic();
  
  // Generate a random number of bars for the visualizer
  const generateBars = () => {
    const numberOfBars = 32;
    const bars = [];
    
    for (let i = 0; i < numberOfBars; i++) {
      const heightPercent = isPlaying 
        ? Math.random() * 100 
        : 10 + Math.sin(i * 0.5) * 10;
        
      bars.push(
        <div 
          key={`bar-${i}`}
          className="w-1 bg-primary rounded-full transform transition-all duration-75 ease-in-out" 
          style={{ 
            height: `${heightPercent}%`,
            opacity: isPlaying ? 0.7 + Math.random() * 0.3 : 0.5
          }}
        />
      );
    }
    
    return bars;
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div 
        className="w-full bg-muted/30 flex items-end justify-center gap-1 px-2"
        style={{ height: `${height}px` }}
      >
        {currentTrack ? (
          generateBars()
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground">
            {isPlaying 
              ? "Visualisation audio" 
              : "Lecture en pause"}
          </div>
        )}
      </div>
      
      {showControls && currentTrack && (
        <div className="p-2 text-xs text-center text-muted-foreground">
          {currentTrack.title} • {currentTrack.artist}
        </div>
      )}
    </Card>
  );
};

export default EnhancedMusicVisualizer;
