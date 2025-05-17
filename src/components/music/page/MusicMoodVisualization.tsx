
import React, { useEffect, useState } from 'react';
import { useMusic } from '@/contexts';
import { Card, CardContent } from '@/components/ui/card';

interface MusicMoodVisualizationProps {
  mood?: string;
}

interface MoodColor {
  light: string;
  medium: string;
  dark: string;
}

const moodColors: Record<string, MoodColor> = {
  happy: { light: '#FFE9A8', medium: '#FFC837', dark: '#FF8008' },
  calm: { light: '#C9F5F5', medium: '#81D8D0', dark: '#46B3B3' },
  sad: { light: '#BBDEFB', medium: '#64B5F6', dark: '#1976D2' },
  energetic: { light: '#FFCDD2', medium: '#EF5350', dark: '#B71C1C' },
  focused: { light: '#D1C4E9', medium: '#9575CD', dark: '#512DA8' },
  neutral: { light: '#E0E0E0', medium: '#9E9E9E', dark: '#616161' }
};

const MusicMoodVisualization: React.FC<MusicMoodVisualizationProps> = ({ mood }) => {
  const { emotion, currentTrack } = useMusic();
  const [points, setPoints] = useState<string>('');
  
  const currentMood = mood || emotion || 'neutral';
  const colors = moodColors[currentMood] || moodColors.neutral;
  
  const randomness = 0.2; // For how "chaotic" the visualization is
  
  // Generate visualization points
  useEffect(() => {
    const generatePoints = () => {
      const pointsArray = [];
      const numberOfPoints = 8;
      
      for (let i = 0; i < numberOfPoints; i++) {
        // Base position around a circle
        const angle = (i / numberOfPoints) * Math.PI * 2;
        const radius = 50 + Math.sin(Date.now() / 1000 + i) * randomness * 20;
        
        const x = 50 + Math.cos(angle) * radius * 0.35;
        const y = 50 + Math.sin(angle) * radius * 0.35;
        
        pointsArray.push(`${x},${y}`);
      }
      
      return pointsArray.join(' ');
    };
    
    const intervalId = setInterval(() => {
      setPoints(generatePoints());
    }, 1000);
    
    // Initial points
    setPoints(generatePoints());
    
    return () => clearInterval(intervalId);
  }, [randomness]);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Ambiance Musicale: {currentMood}</h3>
          {currentTrack && (
            <p className="text-sm text-muted-foreground">
              En cours: {currentTrack.title} - {currentTrack.artist}
            </p>
          )}
        </div>
        
        <div className="aspect-square w-full max-w-xs mx-auto relative">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.light} 0%, ${colors.medium} 50%, ${colors.dark} 100%)`,
              opacity: 0.7
            }}
          />
          
          {/* SVG visualization */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full"
          >
            {/* Animated polygon shape */}
            <polygon 
              points={points}
              fill={colors.medium}
              opacity="0.5"
              style={{
                animation: 'pulse 3s infinite alternate'
              }}
            />
            
            {/* Center circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="15" 
              fill={colors.dark}
              opacity="0.8"
              style={{
                animation: 'pulse 2s infinite'
              }}
            />
          </svg>
        </div>
      </CardContent>
      
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </Card>
  );
};

export default MusicMoodVisualization;
