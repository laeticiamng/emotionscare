import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { SilkOverlay } from './SilkOverlay';
import { BreathTimeline } from './BreathTimeline';
import { BreathCoach } from './BreathCoach';
import { HRVStatusBadge } from './HRVStatusBadge';

import { useScreenSilk } from '@/hooks/useScreenSilk';
import { useARAnalytics } from '@/hooks/useARAnalytics';
import { type SilkPattern } from '@/store/screenSilk.store';

interface ScreenSilkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 90, label: '1.5 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
];

const PATTERN_OPTIONS = [
  { value: '4-2-4', label: '4-2-4 (Équilibré)' },
  { value: '4-6-8', label: '4-6-8 (Relaxant)' },
  { value: '5-5', label: '5-5 (Simple)' },
] as const;

export const ScreenSilkModal: React.FC<ScreenSilkModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    running,
    paused,
    pattern,
    duration,
    elapsedTime,
    phase,
    phaseProgress,
    reduceMotion,
    audioEnabled,
    hrvEnabled,
    hrvActive,
    hrvConnected,
    start,
    pause,
    resume,
    stop,
    reset,
    setPattern,
    setDuration,
    setAudioEnabled,
    connectHRV,
  } = useScreenSilk();

  const { track } = useARAnalytics();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus management for modal
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements?.length) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isOpen]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        if (running) {
          stop();
        }
        reset();
        onClose();
        track('silk.finish', { reason: 'escape' });
        break;
        
      case ' ':
        event.preventDefault();
        if (running) {
          if (paused) {
            resume();
            track('silk.resume', {});
          } else {
            pause();
            track('silk.pause', {});
          }
        }
        break;
    }
  }, [isOpen, running, paused, stop, reset, onClose, pause, resume, track]);

  // Add keyboard event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  // Handle session completion
  useEffect(() => {
    if (running && elapsedTime >= duration) {
      track('silk.finish', { completed: true });
      
      // Show completion feedback briefly before closing
      setTimeout(() => {
        reset();
        onClose();
      }, 2000);
    }
  }, [running, elapsedTime, duration, track, reset, onClose]);

  const handleStart = () => {
    start();
    track('silk.start', { pattern, duration });
  };

  const handleStop = () => {
    stop();
    track('silk.finish', { completed: false });
    setTimeout(() => {
      reset();
      onClose();
    }, 1000);
  };

  const handlePatternChange = (value: string) => {
    setPattern(value as SilkPattern);
  };

  const handleDurationChange = (value: string) => {
    setDuration(parseInt(value));
  };

  const handleHRVConnect = async () => {
    const connected = await connectHRV();
    if (connected) {
      track('silk.hrv.enabled', {});
    }
  };

  if (!isOpen) return null;

  const isSessionComplete = running && elapsedTime >= duration;
  const progress = duration > 0 ? elapsedTime / duration : 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="silk-modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
      >
        {/* Silk Overlay - Full screen when running */}
        {running && (
          <SilkOverlay 
            phase={phase}
            progress={phaseProgress}
            reduceMotion={reduceMotion}
            isComplete={isSessionComplete}
          />
        )}

        {/* Main Modal Content */}
        <Card className={`${running ? 'absolute inset-0 z-10' : ''} bg-background/95 backdrop-blur-sm border-border/50`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle id="silk-modal-title" className="text-xl font-semibold">
                {isSessionComplete ? (
                  <span className="text-primary">Beau reset ✨</span>
                ) : (
                  'Screen-Silk Break'
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {/* HRV Status Badge */}
                {hrvEnabled && (
                  <HRVStatusBadge 
                    connected={hrvConnected}
                    active={hrvActive}
                    onConnect={handleHRVConnect}
                  />
                )}
                
                <Button
                  ref={firstFocusableRef}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (running) {
                      stop();
                    }
                    reset();
                    onClose();
                  }}
                  aria-label="Fermer la modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Session Complete State */}
            {isSessionComplete && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Micro-pause terminée !
                </h3>
                <p className="text-muted-foreground">
                  Vous avez pris {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')} pour vous recentrer
                </p>
                <Badge variant="secondary" className="mt-4">
                  Silk Break
                </Badge>
              </div>
            )}

            {/* Active Session State */}
            {running && !isSessionComplete && (
              <div className="space-y-6">
                {/* Breath Timeline */}
                <BreathTimeline 
                  phase={phase}
                  progress={phaseProgress}
                  overallProgress={progress}
                  reduceMotion={reduceMotion}
                />

                {/* Breath Coach */}
                <BreathCoach 
                  phase={phase}
                  pattern={pattern}
                  progress={phaseProgress}
                />

                {/* Session Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={paused ? resume : pause}
                    className="min-w-24"
                  >
                    {paused ? 'Reprendre' : 'Pause'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    onClick={handleStop}
                  >
                    Terminer
                  </Button>
                </div>

                {/* Session Info */}
                <div className="text-center text-sm text-muted-foreground">
                  <div>Temps écoulé: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</div>
                  <div>Motif: {pattern} • Durée: {Math.floor(duration / 60)}min</div>
                </div>
              </div>
            )}

            {/* Setup State */}
            {!running && !isSessionComplete && (
              <div className="space-y-6">
                {/* Pattern Selection */}
                <div className="space-y-2">
                  <label htmlFor="pattern-select" className="text-sm font-medium">
                    Motif respiratoire
                  </label>
                  <Select value={pattern} onValueChange={handlePatternChange}>
                    <SelectTrigger id="pattern-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PATTERN_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <label htmlFor="duration-select" className="text-sm font-medium">
                    Durée
                  </label>
                  <Select value={duration.toString()} onValueChange={handleDurationChange}>
                    <SelectTrigger id="duration-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio Toggle */}
                <div className="flex items-center justify-between">
                  <label htmlFor="audio-toggle" className="text-sm font-medium">
                    Son d'accompagnement
                  </label>
                  <Button
                    id="audio-toggle"
                    variant="outline"
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={audioEnabled ? 'bg-primary/10' : ''}
                  >
                    {audioEnabled ? 'Activé' : 'Désactivé'}
                  </Button>
                </div>

                {/* Start Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg"
                    onClick={handleStart}
                    className="min-w-32"
                  >
                    Commencer
                  </Button>
                </div>

                {/* Info Text */}
                <div className="text-center text-xs text-muted-foreground">
                  <p>Espace = Pause/Reprendre • Échap = Fermer</p>
                  {reduceMotion && <p>Mode animations réduites activé</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};