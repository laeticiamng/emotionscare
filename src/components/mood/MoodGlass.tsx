// @ts-nocheck
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BlendState } from '@/store/mood.store';

interface MoodGlassProps {
  blend: BlendState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ColorLayer {
  color: string;
  opacity: number;
  height: number;
}

export const MoodGlass: React.FC<MoodGlassProps> = ({
  blend,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-40 h-48',
    lg: 'w-48 h-60'
  };

  // Calculate color layers based on blend values
  const colorLayers = useMemo((): ColorLayer[] => {
    const layers: ColorLayer[] = [];
    
    // Joy - Yellow/Orange tones
    if (blend.joy > 0.1) {
      layers.push({
        color: 'linear-gradient(180deg, #FCD34D, #F59E0B)',
        opacity: blend.joy * 0.8,
        height: blend.joy * 100
      });
    }
    
    // Calm - Blue/Green tones
    if (blend.calm > 0.1) {
      layers.push({
        color: 'linear-gradient(180deg, #34D399, #06B6D4)',
        opacity: blend.calm * 0.7,
        height: blend.calm * 100
      });
    }
    
    // Energy - Red/Pink tones
    if (blend.energy > 0.1) {
      layers.push({
        color: 'linear-gradient(180deg, #F87171, #EC4899)',
        opacity: blend.energy * 0.8,
        height: blend.energy * 100
      });
    }
    
    // Focus - Purple tones
    if (blend.focus > 0.1) {
      layers.push({
        color: 'linear-gradient(180deg, #A78BFA, #7C3AED)',
        opacity: blend.focus * 0.7,
        height: blend.focus * 100
      });
    }
    
    // Sort layers by height for better visual mixing
    return layers.sort((a, b) => b.height - a.height);
  }, [blend]);

  // Calculate overall intensity for particle effects
  const intensity = useMemo(() => {
    return (blend.joy + blend.calm + blend.energy + blend.focus) / 4;
  }, [blend]);

  // Generate bubble positions for animation
  const bubbles = useMemo(() => {
    const count = Math.floor(intensity * 12) + 3;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10-90%
      delay: Math.random() * 2,
      size: Math.random() * 8 + 4, // 4-12px
      duration: Math.random() * 3 + 2 // 2-5s
    }));
  }, [intensity]);

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Glass container */}
      <div className="relative w-full h-full">
        {/* Glass outline */}
        <div className="absolute inset-0 rounded-b-full border-4 border-muted bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm overflow-hidden">
          
          {/* Liquid layers */}
          <div className="absolute bottom-0 left-0 right-0 rounded-b-full overflow-hidden">
            {colorLayers.map((layer, index) => (
              <motion.div
                key={index}
                className="absolute bottom-0 left-0 right-0 rounded-b-full mix-blend-multiply"
                style={{
                  background: layer.color,
                  opacity: layer.opacity,
                }}
                initial={{ height: '0%' }}
                animate={{ height: `${Math.min(layer.height, 85)}%` }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Animated bubbles */}
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full bg-white/30"
              style={{
                left: `${bubble.x}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              initial={{
                bottom: '5%',
                opacity: 0.6
              }}
              animate={{
                bottom: '90%',
                opacity: 0
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Liquid surface animation */}
          {colorLayers.length > 0 && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                y: [0, -4, 0],
                scaleY: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                top: `${15}%` // Position near the liquid surface
              }}
            />
          )}

          {/* Glass shine effect */}
          <div className="absolute top-2 left-2 w-3 h-8 bg-gradient-to-b from-white/40 to-transparent rounded-full transform -skew-x-12" />
        </div>

        {/* Glass base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-muted rounded-full" />
      </div>

      {/* Cocktail name label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="text-center">
          <div className="text-sm font-medium text-foreground">
            {getCocktailName(blend)}
          </div>
          <div className="text-xs text-muted-foreground">
            Intensité: {Math.round(intensity * 100)}%
          </div>
        </div>
      </div>

      {/* Particle effects around the glass */}
      {intensity > 0.7 && (
        <div className="absolute -inset-4 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to generate cocktail names based on blend
function getCocktailName(blend: BlendState): string {
  const { joy, calm, energy, focus } = blend;
  
  // Find dominant emotion
  const emotions = { joy, calm, energy, focus };
  const dominant = Object.entries(emotions).sort(([,a], [,b]) => b - a)[0];
  
  // Check for combinations
  if (joy > 0.6 && energy > 0.6) return 'Explosion Solaire';
  if (calm > 0.6 && focus > 0.6) return 'Sérénité Zen';
  if (energy > 0.7 && focus > 0.5) return 'Turbo Focus';
  if (joy > 0.5 && calm > 0.5) return 'Bonheur Paisible';
  
  // Single dominant emotion
  switch (dominant[0]) {
    case 'joy': return 'Rayon de Soleil';
    case 'calm': return 'Oasis Tranquille';
    case 'energy': return 'Élixir Dynamique';
    case 'focus': return 'Potion Mentale';
    default: return 'Mix Équilibré';
  }
}

export default MoodGlass;