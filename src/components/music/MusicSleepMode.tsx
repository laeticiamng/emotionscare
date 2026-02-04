/**
 * Mode sommeil avec fade-out
 * Timer de sommeil avec transition progressive
 */

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { 
  Moon, 
  Clock, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CloudMoon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SleepModeSettings {
  duration: number; // minutes
  fadeOutDuration: number; // minutes
  autoStop: boolean;
  dimScreen: boolean;
  blockNotifications: boolean;
}

interface MusicSleepModeProps {
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

export const MusicSleepMode = memo(function MusicSleepMode({
  isPlaying = false,
  onPlayPause,
  onVolumeChange,
  className
}: MusicSleepModeProps) {
  const [settings, setSettings] = useState<SleepModeSettings>({
    duration: 30,
    fadeOutDuration: 5,
    autoStop: true,
    dimScreen: true,
    blockNotifications: false,
  });
  
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(80);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start sleep timer
  const startTimer = useCallback(() => {
    setIsActive(true);
    setRemainingTime(settings.duration * 60);
    setIsFadingOut(false);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        
        // Start fade out
        const fadeOutSeconds = settings.fadeOutDuration * 60;
        if (prev <= fadeOutSeconds && !isFadingOut) {
          setIsFadingOut(true);
          startFadeOut(fadeOutSeconds);
        }
        
        return prev - 1;
      });
    }, 1000);
  }, [settings.duration, settings.fadeOutDuration, isFadingOut]);

  // Start fade out
  const startFadeOut = useCallback((fadeSeconds: number) => {
    const volumeStep = currentVolume / fadeSeconds;
    let currentVol = currentVolume;
    
    fadeIntervalRef.current = setInterval(() => {
      currentVol = Math.max(0, currentVol - volumeStep);
      setCurrentVolume(currentVol);
      onVolumeChange?.(currentVol);
      
      if (currentVol <= 0) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }
      }
    }, 1000);
  }, [currentVolume, onVolumeChange]);

  // Stop timer
  const stopTimer = useCallback(() => {
    setIsActive(false);
    setIsFadingOut(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    if (settings.autoStop) {
      onPlayPause?.();
    }
    
    // Reset volume
    setCurrentVolume(80);
    onVolumeChange?.(80);
  }, [settings.autoStop, onPlayPause, onVolumeChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  const progress = isActive 
    ? ((settings.duration * 60 - remainingTime) / (settings.duration * 60)) * 100 
    : 0;

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          <CardTitle>Mode Sommeil</CardTitle>
        </div>
        <CardDescription>
          Transition douce vers le silence pour un endormissement paisible
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className={cn(
          "relative rounded-2xl p-8 text-center overflow-hidden transition-colors",
          isActive 
            ? "bg-gradient-to-b from-indigo-950 to-purple-950" 
            : "bg-muted/50"
        )}>
          {/* Stars animation when active */}
          {isActive && (
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    opacity: Math.random() * 0.5 + 0.2,
                  }}
                />
              ))}
            </div>
          )}
          
          <div className="relative z-10">
            {isActive ? (
              <>
                <CloudMoon className={cn(
                  "h-12 w-12 mx-auto mb-4",
                  isFadingOut ? "text-purple-300 animate-pulse" : "text-indigo-300"
                )} />
                <div className={cn(
                  "text-5xl font-bold font-mono mb-2",
                  isActive ? "text-white" : "text-foreground"
                )}>
                  {formatTime(remainingTime)}
                </div>
                {isFadingOut && (
                  <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Fade out en cours...
                  </Badge>
                )}
                <Progress value={progress} className="mt-4 h-1 bg-white/10" />
              </>
            ) : (
              <>
                <Moon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="text-4xl font-bold text-muted-foreground mb-2">
                  {settings.duration} min
                </div>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez la durée et démarrez
                </p>
              </>
            )}
          </div>
        </div>

        {/* Duration Presets */}
        {!isActive && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Durée</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_DURATIONS.map((duration) => (
                <Button
                  key={duration}
                  variant={settings.duration === duration ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSettings(prev => ({ ...prev, duration }))}
                  className="text-xs"
                >
                  {duration}m
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Fade Out Duration */}
        {!isActive && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Durée du fade-out</Label>
              <span className="text-sm text-muted-foreground">{settings.fadeOutDuration} min</span>
            </div>
            <Slider
              value={[settings.fadeOutDuration]}
              onValueChange={([value]) => setSettings(prev => ({ ...prev, fadeOutDuration: value }))}
              min={1}
              max={15}
              step={1}
            />
          </div>
        )}

        {/* Volume Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Volume
            </Label>
            <span className="text-sm text-muted-foreground">{Math.round(currentVolume)}%</span>
          </div>
          <Slider
            value={[currentVolume]}
            onValueChange={([value]) => {
              setCurrentVolume(value);
              onVolumeChange?.(value);
            }}
            max={100}
            step={1}
            disabled={isFadingOut}
          />
        </div>

        {/* Settings */}
        {!isActive && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoStop" className="text-sm">Arrêter la musique à la fin</Label>
              <Switch
                id="autoStop"
                checked={settings.autoStop}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoStop: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dimScreen" className="text-sm">Assombrir l'écran</Label>
              <Switch
                id="dimScreen"
                checked={settings.dimScreen}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dimScreen: checked }))}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isActive ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={stopTimer}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                className="flex-1"
                onClick={onPlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Reprendre'}
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={startTimer}
            >
              <Moon className="h-4 w-4 mr-2" />
              Démarrer le mode sommeil
            </Button>
          )}
        </div>

        {/* Tips */}
        {!isActive && (
          <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <p>💡 <strong>Conseil :</strong> Pour un endormissement optimal, commencez avec un volume doux 
            et laissez le fade-out faire une transition naturelle vers le silence.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
