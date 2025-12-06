// @ts-nocheck

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, Settings, Palette, Sparkles, Waves } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import ThreeDVisualizer from './ThreeDVisualizer';
import AmbientBackground from './AmbientBackground';
import PremiumMusicPlayer from './PremiumMusicPlayer';
import { logger } from '@/lib/logger';

interface ImmersiveFullscreenPlayerProps {
  className?: string;
}

const ImmersiveFullscreenPlayer: React.FC<ImmersiveFullscreenPlayerProps> = ({ className }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visualMode, setVisualMode] = useState<'3d' | 'ambient' | 'particles' | 'wave'>('3d');
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { currentTrack, isPlaying } = useMusic();

  // Gestion du mode plein écran
  const enterFullscreen = async () => {
    if (containerRef.current) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        logger.info('Fullscreen not supported');
      }
    }
  };

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      logger.info('Exit fullscreen error');
    }
  };

  // Auto-masquage des contrôles en mode plein écran
  const resetHideControlsTimer = () => {
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    
    if (isFullscreen) {
      setShowControls(true);
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleMouseMove = resetHideControlsTimer;
    const handleKeyPress = resetHideControlsTimer;

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keypress', handleKeyPress);
      resetHideControlsTimer();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keypress', handleKeyPress);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const visualModes = [
    { id: '3d', icon: Sparkles, label: '3D Visualizer' },
    { id: 'ambient', icon: Palette, label: 'Ambient' },
    { id: 'particles', icon: Settings, label: 'Particles' },
    { id: 'wave', icon: Waves, label: 'Wave Form' }
  ];

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden transition-all duration-500',
        isFullscreen 
          ? 'fixed inset-0 z-[9999] bg-black' 
          : 'rounded-xl aspect-video',
        className
      )}
    >
      {/* Background Visuel */}
      <div className="absolute inset-0">
        {visualMode === '3d' && (
          <ThreeDVisualizer 
            isPlaying={isPlaying} 
            track={currentTrack}
            fullscreen={isFullscreen}
          />
        )}
        {visualMode === 'ambient' && (
          <AmbientBackground 
            track={currentTrack}
            isPlaying={isPlaying}
            fullscreen={isFullscreen}
          />
        )}
        {visualMode === 'particles' && (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
            <div className="absolute inset-0 opacity-30">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay de contrôles */}
      <div 
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          isFullscreen && !showControls ? 'opacity-0' : 'opacity-100'
        )}
      >
        {/* Header avec contrôles de mode */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            {visualModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={visualMode === mode.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setVisualMode(mode.id as any)}
                  className="bg-black/20 backdrop-blur-sm border-white/10"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className="bg-black/20 backdrop-blur-sm border-white/10"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Lecteur intégré */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <PremiumMusicPlayer 
              className="bg-transparent border-0 shadow-none"
              compact={isFullscreen}
            />
          </div>
        </div>
      </div>

      {/* Indication de mode immersif */}
      {isFullscreen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/60 text-center pointer-events-none">
          <p className="text-sm">Mode Immersif Activé</p>
          <p className="text-xs mt-1">Bougez la souris pour afficher les contrôles</p>
        </div>
      )}
    </div>
  );
};

export default ImmersiveFullscreenPlayer;
