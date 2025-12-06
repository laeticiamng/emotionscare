// @ts-nocheck

import React from 'react';
import { Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, X, Music, MusicOff } from 'lucide-react';
import { type VRBreathPhase, type VRPattern } from '@/store/vr.store';

interface VRHUDProps {
  running: boolean;
  paused: boolean;
  phase: VRBreathPhase;
  pattern: VRPattern;
  elapsedTime: number;
  duration: number;
  musicEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onExit: () => void;
  onToggleMusic: () => void;
}

// Phase display names in French
const PHASE_NAMES = {
  inhale: 'Inspire',
  hold: 'Tiens', 
  exhale: 'Expire',
  pause: 'Pause',
} as const;

// Phase colors
const PHASE_COLORS = {
  inhale: 'text-blue-400',
  hold: 'text-purple-400',
  exhale: 'text-teal-400', 
  pause: 'text-gray-400',
} as const;

export const VRHUD: React.FC<VRHUDProps> = ({
  running,
  paused,
  phase,
  pattern,
  elapsedTime,
  duration,
  musicEnabled,
  onStart,
  onPause,
  onResume,
  onStop,
  onExit,
  onToggleMusic,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? elapsedTime / duration : 0;

  return (
    <>
      {/* Main HUD Panel - Fixed at bottom of field of view */}
      <Html
        position={[0, -1, -2]}
        transform
        occlude="blending"
        style={{
          pointerEvents: 'auto',
        }}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-80">
          <div className="space-y-4">
            
            {/* Session Info */}
            <div className="text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs border-white/20 text-white">
                  {pattern.replace('-', '–')}
                </Badge>
                <span className="text-xs text-white/60">•</span>
                <span className="text-xs text-white/80">
                  {formatTime(elapsedTime)} / {formatTime(duration)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1 mb-3">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              
              {/* Current Phase */}
              {running && (
                <div className={`text-lg font-medium ${PHASE_COLORS[phase]}`}>
                  {PHASE_NAMES[phase]}...
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {!running ? (
                <Button
                  onClick={onStart}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Démarrer
                </Button>
              ) : (
                <>
                  <Button
                    onClick={paused ? onResume : onPause}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {paused ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Pause className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    onClick={onStop}
                    variant="destructive"
                    size="sm"
                  >
                    Terminer
                  </Button>
                </>
              )}
              
              {/* Music Toggle */}
              <Button
                onClick={onToggleMusic}
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-white/10 ${musicEnabled ? 'bg-white/10' : ''}`}
              >
                {musicEnabled ? (
                  <Music className="h-4 w-4" />
                ) : (
                  <MusicOff className="h-4 w-4" />
                )}
              </Button>
              
              {/* Exit VR */}
              <Button
                onClick={onExit}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 border-white/20 border"
              >
                <X className="h-4 w-4 mr-2" />
                Quitter
              </Button>
            </div>
            
            {/* Instructions */}
            {!running && (
              <div className="text-center text-xs text-white/60">
                Fixez la sphère et suivez son rythme de respiration
              </div>
            )}
            
            {paused && (
              <div className="text-center text-xs text-yellow-400">
                Session en pause
              </div>
            )}
          </div>
        </div>
      </Html>

      {/* Session Complete Overlay */}
      {running && progress >= 1 && (
        <Html
          position={[0, 0, -1.5]}
          transform
          occlude="blending"
        >
          <div className="bg-emerald-900/80 backdrop-blur-sm rounded-lg p-6 text-center text-white">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">Session terminée !</h3>
            <p className="text-emerald-200 text-sm mb-4">
              Excellente séance de cohérence cardiaque
            </p>
            <Button
              onClick={onExit}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Retour
            </Button>
          </div>
        </Html>
      )}
    </>
  );
};