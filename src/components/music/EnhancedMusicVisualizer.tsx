
import React, { useEffect, useState } from 'react';
import AudioVisualizer from './AudioVisualizer';
import { useMusic } from '@/contexts/MusicContext';

interface EnhancedMusicVisualizerProps {
  emotion?: string;
  mood?: string; // Added mood prop to match usage in MusicCreator
  showControls?: boolean;
  height?: number;
  className?: string;
  intensity?: number;
  volume?: number;
}

// Mapping des émotions vers les visualisations
const EMOTION_VISUALIZER_MAP: Record<string, {
  variant: 'bars' | 'wave' | 'circle',
  color: string,
  background: string
}> = {
  happy: {
    variant: 'bars',
    color: '#F59E0B',
    background: 'rgba(245, 158, 11, 0.1)'
  },
  energetic: {
    variant: 'bars',
    color: '#EF4444',
    background: 'rgba(239, 68, 68, 0.1)'
  },
  calm: {
    variant: 'wave',
    color: '#3B82F6',
    background: 'rgba(59, 130, 246, 0.1)'
  },
  focused: {
    variant: 'circle',
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.1)'
  },
  neutral: {
    variant: 'wave',
    color: '#6366F1',
    background: 'rgba(99, 102, 241, 0.1)'
  },
  melancholic: {
    variant: 'wave',
    color: '#8B5CF6',
    background: 'rgba(139, 92, 246, 0.1)'
  }
};

// Configuration par défaut
const DEFAULT_VISUALIZER = {
  variant: 'bars' as 'bars' | 'wave' | 'circle',
  color: '#7C3AED',
  background: 'rgba(124, 58, 237, 0.1)'
};

const EnhancedMusicVisualizer: React.FC<EnhancedMusicVisualizerProps> = ({
  emotion,
  mood,
  showControls = true,
  height = 150,
  className = '',
  intensity = 50,
  volume = 1
}) => {
  const { currentTrack, isPlaying } = useMusic();
  const [config, setConfig] = useState(DEFAULT_VISUALIZER);
  
  // Mettre à jour la configuration en fonction de l'émotion ou mood
  useEffect(() => {
    const emotionToUse = emotion || mood;
    if (emotionToUse) {
      const emotionKey = emotionToUse.toLowerCase();
      const visualizerConfig = EMOTION_VISUALIZER_MAP[emotionKey] || DEFAULT_VISUALIZER;
      setConfig(visualizerConfig);
    }
  }, [emotion, mood]);

  // Adjust visualizer height based on intensity
  const adjustedHeight = intensity ? Math.max(height * 0.7, Math.min(height * 1.3, height * (intensity / 50))) : height;

  return (
    <div className={`enhanced-music-visualizer ${className}`}>
      <AudioVisualizer
        audioUrl={currentTrack?.url}
        isPlaying={isPlaying}
        variant={config.variant}
        primaryColor={config.color}
        backgroundColor={config.background}
        height={adjustedHeight}
        showControls={showControls}
        volume={volume}
      />
    </div>
  );
};

export default EnhancedMusicVisualizer;
export type { EnhancedMusicVisualizerProps };
