/**
 * VRSessionControls - Contrôles de session VR immersive
 */

import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Maximize, 
  Settings,
  Music,
  Wind,
  Timer,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VRSessionControlsProps {
  isPlaying: boolean;
  elapsedTime: number;
  totalTime: number;
  volume: number;
  breathingEnabled: boolean;
  musicEnabled: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onBreathingToggle: (enabled: boolean) => void;
  onMusicToggle: (enabled: boolean) => void;
  onFullscreen: () => void;
  className?: string;
}

export const VRSessionControls = memo<VRSessionControlsProps>(({
  isPlaying,
  elapsedTime,
  totalTime,
  volume,
  breathingEnabled,
  musicEnabled,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onBreathingToggle,
  onMusicToggle,
  onFullscreen,
  className,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const progress = totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("bg-background/95 backdrop-blur-sm", className)}>
      <CardContent className="p-4 space-y-4">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(elapsedTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Contrôles principaux */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onStop}
            className="h-10 w-10"
            aria-label="Arrêter"
          >
            <Square className="h-5 w-5" />
          </Button>
          
          <Button
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            className="h-14 w-14 rounded-full"
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="h-7 w-7 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onFullscreen}
            className="h-10 w-10"
            aria-label="Plein écran"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>

        {/* Contrôles secondaires */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={([v]) => onVolumeChange(v)}
              max={100}
              step={5}
              className="w-24"
              aria-label="Volume"
            />
            <span className="text-xs text-muted-foreground w-8">
              {volume}%
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Paramètres"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Paramètres avancés */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Guide respiratoire</span>
              </div>
              <Switch
                checked={breathingEnabled}
                onCheckedChange={onBreathingToggle}
                aria-label="Guide respiratoire"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Musique ambiante</span>
              </div>
              <Switch
                checked={musicEnabled}
                onCheckedChange={onMusicToggle}
                aria-label="Musique ambiante"
              />
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
});

VRSessionControls.displayName = 'VRSessionControls';

export default VRSessionControls;
