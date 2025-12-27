import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';

interface PreviewPlayerProps {
  src: string;
}

export function PreviewPlayer({ src }: PreviewPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) {
      return;
    }

    const handleTimeUpdate = () => {
      const duration = element.duration || 30;
      setProgress(duration > 0 ? element.currentTime / duration : 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    element.addEventListener('timeupdate', handleTimeUpdate);
    element.addEventListener('ended', handleEnded);
    element.addEventListener('pause', handlePause);

    return () => {
      element.removeEventListener('timeupdate', handleTimeUpdate);
      element.removeEventListener('ended', handleEnded);
      element.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const element = audioRef.current;
    if (!element) {
      return;
    }

    element.pause();
    element.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
  }, [src]);

  const togglePlayback = async () => {
    const element = audioRef.current;
    if (!element) {
      return;
    }

    if (isPlaying) {
      element.pause();
      return;
    }

    try {
      await element.play();
      setIsPlaying(true);
    } catch (error) {
      logger.warn('Unable to start preview playback', error);
      setIsPlaying(false);
    }
  };

  const progressValue = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <div className="flex w-full items-center gap-3" aria-live="polite">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={togglePlayback}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Mettre la pré-écoute en pause' : 'Lancer la pré-écoute'}
      >
        {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        <span className="sr-only">{isPlaying ? 'Pause' : 'Lecture'}</span>
      </Button>
      <div
        className="relative flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Progression de la pré-écoute"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressValue}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width]"
          style={{ width: `${progressValue}%` }}
          aria-hidden="true"
        />
      </div>
      <audio ref={audioRef} src={src} preload="none" aria-hidden />
    </div>
  );
}
