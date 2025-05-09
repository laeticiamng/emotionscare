
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '@/contexts/MusicContext';

interface EnhancedMusicVisualizerProps {
  emotion?: string;
  intensity?: number;
  volume?: number;
  showControls?: boolean;
  height?: number;
  className?: string;
}

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({ 
  emotion = 'neutral',
  intensity = 50,
  volume = 0.5,
  showControls = true,
  height = 120,
  className = ''
}) => {
  const { isPlaying, currentTrack } = useMusic();
  const [bars, setBars] = useState<number[]>([]);
  
  // Generate color based on emotion
  const getEmotionColor = () => {
    const emotionColors: Record<string, string> = {
      happy: 'from-amber-300 to-amber-500',
      calm: 'from-blue-300 to-indigo-500',
      focused: 'from-emerald-300 to-emerald-500',
      energetic: 'from-rose-300 to-rose-500',
      melancholic: 'from-violet-300 to-violet-500',
      neutral: 'from-slate-300 to-slate-500',
    };
    
    return emotionColors[emotion?.toLowerCase() || 'neutral'] || emotionColors.neutral;
  };
  
  // Generate bars
  useEffect(() => {
    const barCount = 18;
    const newBars = Array.from({ length: barCount }, () => Math.random() * 100);
    setBars(newBars);
    
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setBars(prev => prev.map(bar => {
          // Create more variation for different emotions
          let variation = 20;
          if (emotion === 'calm') variation = 10;
          if (emotion === 'energetic') variation = 30;
          
          return Math.min(100, Math.max(10, 
            bar + (Math.random() - 0.5) * variation * (volume || 0.5) * (intensity / 50)
          ));
        }));
      }, 150);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack, emotion, volume, intensity]);
  
  const barColor = getEmotionColor();
  
  return (
    <div 
      className={`w-full bg-muted/30 rounded-lg overflow-hidden ${className}`} 
      style={{ height: `${height}px` }}
    >
      <div className="h-full w-full flex items-end justify-center gap-[2px] px-2">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className={`w-full h-1/2 bg-gradient-to-t ${barColor} rounded-t-sm`}
            animate={{ 
              height: isPlaying 
                ? `${Math.max(5, (height/100) * 80)}%` 
                : '10%' 
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EnhancedMusicVisualizer;
