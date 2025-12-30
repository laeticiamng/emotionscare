import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlobalAudioPlayerProps {
  className?: string;
}

const GlobalAudioPlayer: React.FC<GlobalAudioPlayerProps> = ({ className }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Ambient track URL - can be replaced with actual tracks
  const ambientTrackUrl = '/sounds/ambient-calm.mp3';

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, user needs to interact first
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 240);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        onClick={() => setIsVisible(true)}
        aria-label="Afficher le lecteur audio"
      >
        <Music className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-4 right-4 z-50",
            "bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl",
            isExpanded ? "w-80" : "w-auto",
            className
          )}
        >
          {/* Collapsed/Mini View */}
          {!isExpanded ? (
            <div className="flex items-center gap-2 p-2">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </button>
              
              <div className="flex items-center gap-1.5 px-2">
                <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-mono w-8">
                  {formatTime(currentTime)}
                </span>
              </div>

              <button
                onClick={() => setIsExpanded(true)}
                className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                aria-label="Étendre le lecteur"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Expanded View */
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Music className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Ambiance sonore</h4>
                    <p className="text-xs text-muted-foreground">Relaxation • Focus</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                    aria-label="Réduire le lecteur"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                    aria-label="Masquer le lecteur"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer 
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                    [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-md"
                  aria-label="Progression"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
                    aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 
                      [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={ambientTrackUrl}
        loop
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </>
  );
};

export default GlobalAudioPlayer;
