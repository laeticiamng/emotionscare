/**
 * Visualiseur audio animé pour le Mood Mixer
 */
import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isPlaying: boolean;
  moodComponents: {
    id: string;
    name: string;
    color: string;
    value: number;
  }[];
  className?: string;
}

const BAR_COUNT = 32;

export const AudioVisualizer: React.FC<AudioVisualizerProps> = memo(({ 
  isPlaying, 
  moodComponents,
  className 
}) => {
  const bars = useMemo(() => {
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const componentIndex = i % moodComponents.length;
      const component = moodComponents[componentIndex];
      const baseHeight = (component?.value || 50) / 100;
      const randomOffset = Math.random() * 0.3;
      
      return {
        id: i,
        height: Math.max(0.1, Math.min(1, baseHeight + randomOffset - 0.15)),
        color: component?.color || 'from-primary to-primary/60',
        delay: i * 0.02,
      };
    });
  }, [moodComponents]);

  const avgIntensity = useMemo(() => {
    return moodComponents.reduce((sum, c) => sum + c.value, 0) / moodComponents.length / 100;
  }, [moodComponents]);

  return (
    <div 
      className={cn(
        "flex items-end justify-center gap-0.5 h-16 px-2",
        className
      )}
      role="img"
      aria-label={isPlaying ? "Visualisation audio en cours" : "Visualisation audio en pause"}
    >
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          className={cn(
            "w-1.5 rounded-full bg-gradient-to-t",
            bar.color
          )}
          initial={{ height: '10%' }}
          animate={{
            height: isPlaying 
              ? [`${bar.height * 30}%`, `${bar.height * 100}%`, `${bar.height * 50}%`]
              : '10%',
            opacity: isPlaying ? [0.6, 1, 0.8] : 0.3,
          }}
          transition={{
            height: {
              duration: 0.5 + Math.random() * 0.3,
              repeat: isPlaying ? Infinity : 0,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: bar.delay,
            },
            opacity: {
              duration: 0.3,
            },
          }}
        />
      ))}
      
      {/* Indicateur de pulsation central */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2 / avgIntensity,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
});

AudioVisualizer.displayName = 'AudioVisualizer';

export default AudioVisualizer;
