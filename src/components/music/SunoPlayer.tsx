// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Square, Heart, Volume2, Loader2 } from '@/components/music/icons';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { logger } from '@/lib/logger';

interface SunoPlayerProps {
  src: string | null;
  loading: boolean;
  playing: boolean;
  onStart: () => void;
  onNext: () => void;
  onStop: () => void;
  onSave: () => void;
  canSave: boolean;
}

export const SunoPlayer: React.FC<SunoPlayerProps> = ({
  src,
  loading,
  playing,
  onStart,
  onNext,
  onStop,
  onSave,
  canSave
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Gestion des événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setCurrentTime(0);
      // Auto next track could be implemented here
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  // Synchronisation lecture/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (playing) {
      audio.play().catch(error => logger.error('Audio play error:', error));
    } else {
      audio.pause();
    }
  }, [playing, src]);

  // Gestion du volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Éviter les conflits avec les champs de saisie
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (src) {
            playing ? onStop() : onStart();
          } else {
            onStart();
          }
          break;
        case 'KeyJ':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
          }
          break;
        case 'KeyL':
          e.preventDefault();
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
          }
          break;
        case 'KeyN':
          e.preventDefault();
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playing, src, duration, onStart, onStop, onNext]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    if (!duration || !isFinite(duration)) return 0;
    return (currentTime / duration) * 100;
  };

  return (
    <LazyMotionWrapper>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
        {src && (
          <audio
            ref={audioRef}
            src={src}
            preload="auto"
          />
        )}

        <div className="space-y-4">
          {/* État de lecture */}
          <div className="text-center">
            <Badge 
              variant={loading ? "default" : playing ? "default" : "secondary"}
              className="mb-2"
            >
              {loading ? "Génération..." : playing ? "En lecture" : "Prêt"}
            </Badge>
          </div>

          {/* Barre de progression */}
          {src && (
            <div className="space-y-2">
              <Progress 
                value={getProgressValue()} 
                className="h-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Contrôles principaux */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={loading || !canSave}
              aria-label="Piste suivante (N)"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              onClick={src ? (playing ? onStop : onStart) : onStart}
              disabled={loading}
              className="w-16 h-16 rounded-full"
              aria-label={
                src 
                  ? (playing ? "Arrêter (Espace)" : "Reprendre (Espace)")
                  : "Commencer (Espace)"
              }
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : src && playing ? (
                <Pause className="w-6 h-6" />
              ) : src ? (
                <Play className="w-6 h-6 ml-0.5" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              disabled={!playing}
              aria-label="Arrêter"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>

          {/* Contrôles secondaires */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20"
                aria-label="Volume"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              disabled={!canSave}
              aria-label="Sauvegarder dans ma playlist"
            >
              <Heart className="w-4 h-4 mr-2" />
              Sauver
            </Button>
          </div>

          {/* Visualisation audio simple */}
          {playing && (
            <m.div
              className="flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <m.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </m.div>
          )}

          {/* Raccourcis */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground">
              Raccourcis: Espace/K = Play/Pause • J/L = -/+ 10s • N = Suivante
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </LazyMotionWrapper>
  );
};