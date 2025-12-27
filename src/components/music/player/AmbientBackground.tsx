import React, { useEffect, useState } from 'react';
import type { MusicTrack } from '@/types/music';
import { cn } from '@/lib/utils';

interface AmbientBackgroundProps {
  track?: MusicTrack | null;
  isPlaying: boolean;
  fullscreen?: boolean;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ 
  track, 
  isPlaying, 
  fullscreen = false 
}) => {
  const [currentTheme, setCurrentTheme] = useState<string>('default');

  // Adapter le thème selon l'émotion/genre de la piste
  useEffect(() => {
    if (track?.emotion) {
      switch (track.emotion.toLowerCase()) {
        case 'calm':
        case 'relaxed':
          setCurrentTheme('ocean');
          break;
        case 'energetic':
        case 'happy':
          setCurrentTheme('sunrise');
          break;
        case 'sad':
        case 'melancholic':
          setCurrentTheme('rain');
          break;
        case 'romantic':
          setCurrentTheme('sunset');
          break;
        default:
          setCurrentTheme('cosmic');
      }
    }
  }, [track]);

  const themes = {
    ocean: {
      bg: 'from-blue-900 via-cyan-800 to-teal-700',
      accent: 'from-cyan-400/20 to-blue-500/20',
      particles: 'bg-cyan-300'
    },
    sunrise: {
      bg: 'from-orange-400 via-pink-500 to-purple-600',
      accent: 'from-yellow-400/20 to-orange-500/20',
      particles: 'bg-yellow-300'
    },
    rain: {
      bg: 'from-gray-700 via-slate-600 to-gray-800',
      accent: 'from-blue-400/20 to-gray-500/20',
      particles: 'bg-blue-300'
    },
    sunset: {
      bg: 'from-pink-400 via-rose-500 to-orange-500',
      accent: 'from-pink-300/20 to-orange-400/20',
      particles: 'bg-pink-300'
    },
    cosmic: {
      bg: 'from-purple-900 via-blue-900 to-indigo-900',
      accent: 'from-purple-400/20 to-blue-500/20',
      particles: 'bg-purple-300'
    },
    default: {
      bg: 'from-indigo-900 via-purple-900 to-pink-900',
      accent: 'from-indigo-400/20 to-pink-500/20',
      particles: 'bg-indigo-300'
    }
  };

  const theme = themes[currentTheme as keyof typeof themes] || themes.default;

  return (
    <div className={cn(
      'relative w-full h-full overflow-hidden',
      `bg-gradient-to-br ${theme.bg}`
    )}>
      {/* Couches d'animation de fond */}
      <div className={cn(
        'absolute inset-0 opacity-60',
        `bg-gradient-radial ${theme.accent}`
      )}>
        {/* Particules flottantes */}
        {isPlaying && (
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-2 h-2 rounded-full opacity-40',
                  theme.particles,
                  'animate-float-gentle'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Ondulations */}
        {isPlaying && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-white/10 rounded-full"
                style={{
                  animation: `ripple ${3 + i}s infinite`,
                  animationDelay: `${i}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Effets de lumière dynamiques */}
      {isPlaying && (
        <div className="absolute inset-0">
          <div 
            className="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl"
            style={{
              left: '20%',
              top: '30%',
              animation: 'pulse-glow 4s ease-in-out infinite'
            }}
          />
          <div 
            className="absolute w-48 h-48 bg-white/3 rounded-full blur-2xl"
            style={{
              right: '25%',
              bottom: '25%',
              animation: 'pulse-glow 6s ease-in-out infinite reverse'
            }}
          />
        </div>
      )}

      {/* Informations de thème */}
      <div className="absolute bottom-4 right-4 text-white/60 text-right">
        <p className="text-sm capitalize">{currentTheme} Ambiance</p>
        {track?.emotion && (
          <p className="text-xs opacity-60">
            Adapté pour: {track.emotion}
          </p>
        )}
      </div>

      {/* CSS animations are handled by Tailwind animate-float-gentle class in index.css */}
    </div>
  );
};

export default AmbientBackground;
