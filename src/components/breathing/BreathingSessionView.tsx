/**
 * BreathingSessionView - Interface de la session de respiration active
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Pause, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { BreathingCircleAnimation } from './BreathingCircleAnimation';
import { useBreathingSession } from '@/hooks/useBreathingSession';
import { BreathingProtocol } from './BreathingProtocols';
import { cn } from '@/lib/utils';

interface BreathingSessionViewProps {
  protocol: BreathingProtocol;
  onComplete: (durationSeconds: number) => void;
  onCancel: () => void;
}

export const BreathingSessionView: React.FC<BreathingSessionViewProps> = ({
  protocol,
  onComplete,
  onCancel,
}) => {
  const session = useBreathingSession(protocol);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Démarrer automatiquement
  useEffect(() => {
    session.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gérer le son ambiant
  useEffect(() => {
    if (soundEnabled && session.isActive && !session.isPaused) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/ambient-calm.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [soundEnabled, session.isActive, session.isPaused]);

  // Gérer la fin de session
  useEffect(() => {
    if (session.isCompleted) {
      audioRef.current?.pause();
      onComplete(session.totalElapsed);
    }
  }, [session.isCompleted, session.totalElapsed, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    session.stop();
    audioRef.current?.pause();
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header avec protocole */}
      <div className="text-center">
        <span className="text-3xl mb-2 block">{protocol.icon}</span>
        <h2 className="text-xl font-bold">{protocol.name}</h2>
        <p className="text-muted-foreground text-sm">{protocol.description}</p>
      </div>

      {/* Animation cercle */}
      <BreathingCircleAnimation
        phase={session.currentPhase?.name || 'idle'}
        phaseDuration={session.currentPhase?.duration || 0}
        instruction={session.currentPhase?.instruction || 'Préparez-vous...'}
        timer={session.phaseTimer}
        gradientClass={protocol.color}
        isActive={session.isActive && !session.isPaused}
      />

      {/* Timer et progression */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Timer */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Temps écoulé</span>
            <span className="font-mono font-bold text-lg">
              {formatTime(session.totalElapsed)}
            </span>
            <span className="text-muted-foreground">
              / {formatTime(protocol.totalDuration)}
            </span>
          </div>

          {/* Barre de progression */}
          <Progress value={session.progress} className="h-2" />

          {/* Stats */}
          <div className="flex justify-around text-center text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">{session.cyclesCompleted}</p>
              <p>Cycles</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {formatTime(session.remainingTime)}
              </p>
              <p>Restant</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrôles */}
      <div className="flex flex-col gap-4">
        {/* Toggle son */}
        <div className="flex items-center justify-center gap-3">
          <Switch
            id="sound"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
          <Label htmlFor="sound" className="flex items-center gap-2 cursor-pointer">
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            Son ambiant
          </Label>
        </div>

        {/* Boutons */}
        <div className="flex justify-center gap-3">
          {session.isPaused ? (
            <Button onClick={session.resume} size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              Reprendre
            </Button>
          ) : (
            <Button onClick={session.pause} variant="outline" size="lg" className="gap-2">
              <Pause className="h-5 w-5" />
              Pause
            </Button>
          )}
          <Button onClick={handleStop} variant="destructive" size="lg" className="gap-2">
            <Square className="h-5 w-5" />
            Arrêter
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BreathingSessionView;
