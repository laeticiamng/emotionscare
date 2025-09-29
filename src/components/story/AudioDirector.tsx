import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioDirectorProps {
  src?: string;
  className?: string;
  autoPlay?: boolean;
  crossfadeDuration?: number; // ms
}

const AudioDirector: React.FC<AudioDirectorProps> = ({ 
  src, 
  className = '',
  autoPlay = true,
  crossfadeDuration = 400 
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const nextAudioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const crossfadeRef = useRef<NodeJS.Timeout | null>(null);

  // Estimation de l'usage mémoire audio (limite 30MB)
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const info = (performance as any).memory;
      const used = info.usedJSHeapSize / 1024 / 1024; // MB
      setMemoryUsage(used);
      
      // Si on approche la limite, on peut nettoyer les anciens tracks
      if (used > 25 && nextAudioRef.current) {
        nextAudioRef.current.src = '';
      }
    }
  }, []);

  // Précharger le prochain segment
  const preloadNext = useCallback((nextSrc: string) => {
    if (!nextAudioRef.current || memoryUsage > 25) return;
    
    try {
      nextAudioRef.current.src = nextSrc;
      nextAudioRef.current.load();
    } catch (err) {
      console.warn('Failed to preload next audio segment:', err);
    }
  }, [memoryUsage]);

  // Crossfade vers la nouvelle piste
  const crossfadeToNext = useCallback(async () => {
    if (!audioRef.current || !nextAudioRef.current || !nextAudioRef.current.src) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Préparer la nouvelle piste
      nextAudioRef.current.volume = 0;
      await nextAudioRef.current.play();
      
      // Crossfade
      const steps = 20;
      const stepDuration = crossfadeDuration / steps;
      const volumeStep = volume / steps;
      
      for (let i = 0; i < steps; i++) {
        const progress = i / (steps - 1);
        
        // Fade out current, fade in next
        if (audioRef.current) {
          audioRef.current.volume = volume * (1 - progress);
        }
        if (nextAudioRef.current) {
          nextAudioRef.current.volume = volume * progress;
        }
        
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
      
      // Swap des références
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      
      [audioRef.current, nextAudioRef.current] = [nextAudioRef.current, audioRef.current];
      
      setIsPlaying(true);
      setError(null);
      
    } catch (err) {
      console.error('Crossfade failed:', err);
      setError('Transition audio échouée');
    } finally {
      setIsLoading(false);
      updateMemoryUsage();
    }
  }, [volume, crossfadeDuration, updateMemoryUsage]);

  // Chargement initial ou changement de source
  useEffect(() => {
    if (!src || !audioRef.current) return;

    const handleLoad = () => {
      setIsLoading(false);
      setError(null);
      
      if (autoPlay && !isPlaying) {
        audioRef.current?.play().catch(err => {
          console.warn('Auto-play blocked:', err);
          setError('Lecture automatique bloquée');
        });
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio load error:', e);
      setError('Impossible de charger l\'audio');
      setIsLoading(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    // Si on a déjà une piste en cours, faire un crossfade
    if (audioRef.current.src && src !== audioRef.current.src) {
      if (nextAudioRef.current) {
        nextAudioRef.current.src = src;
        crossfadeToNext();
        return;
      }
    }

    // Chargement normal
    setIsLoading(true);
    audioRef.current.src = src;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    audioRef.current.addEventListener('canplaythrough', handleLoad);
    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('ended', handleEnded);
    
    audioRef.current.load();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleLoad);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [src, autoPlay, volume, isMuted, crossfadeToNext]);

  // Contrôle du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Gestion clavier (Espace/K pour play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || 
          (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (crossfadeRef.current) {
        clearTimeout(crossfadeRef.current);
      }
    };
  }, []);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Play/pause failed:', err);
      setError('Contrôle audio impossible');
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleVolumeChange = useCallback((values: number[]) => {
    setVolume(values[0]);
    if (values[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Fallback silencieux si pas d'audio
  if (!src && !error) {
    return (
      <div className={`audio-director ${className}`}>
        <div className="text-xs text-muted-foreground text-center py-2">
          ♪ Ambiance silencieuse
        </div>
      </div>
    );
  }

  return (
    <div className={`audio-director ${className}`}>
      {/* Éléments audio cachés */}
      <audio ref={audioRef} preload="none" />
      <audio ref={nextAudioRef} preload="none" />
      
      {/* Contrôles */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading || !!error}
          aria-label={isPlaying ? 'Mettre en pause' : 'Lecture'}
          className="hover:bg-primary/10"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        {/* Volume */}
        <div className="flex items-center gap-2 flex-1 max-w-32">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            className="w-8 h-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={1}
            step={0.1}
            className="flex-1"
            aria-label="Volume"
          />
        </div>

        {/* Indicateur d'état */}
        <div className="text-xs text-muted-foreground">
          {error ? (
            <span className="text-destructive">Silencieux</span>
          ) : isLoading ? (
            <span>Transition...</span>
          ) : (
            <span>♪ Ambiance</span>
          )}
        </div>
      </div>

      {/* Instructions clavier */}
      <div className="text-xs text-muted-foreground text-center mt-2">
        💡 Espace ou K pour play/pause
      </div>
    </div>
  );
};

export default AudioDirector;