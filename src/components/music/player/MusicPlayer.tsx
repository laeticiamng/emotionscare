
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack, 
    volume,
    setVolume,
    isMuted,
    toggleMute
  } = useMusic();
  
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();
  
  // Simuler la progression de la piste pour la démonstration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            return 0;
          }
          return newValue;
        });
      }, currentTrack.duration * 10); // Durée simulée plus courte pour la démonstration
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
    // If user increases volume while muted, unmute
    if (isMuted && values[0] > 0) {
      toggleMute();
    }
  };
  
  const handleProgressChange = (values: number[]) => {
    setProgress(values[0]);
  };
  
  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculer le temps actuel en fonction du pourcentage de progression
  const currentTime = currentTrack ? (progress / 100) * currentTrack.duration : 0;
  const totalTime = currentTrack?.duration || 0;
  
  return (
    <div className={`space-y-6`}>
      {/* Cover et informations de la piste */}
      <AnimatePresence mode="wait">
        {currentTrack ? (
          <motion.div
            key="track-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Album cover/artwork */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg bg-muted/40 overflow-hidden mb-4 shadow-md">
              {currentTrack.coverUrl || currentTrack.cover ? (
                <img 
                  src={currentTrack.coverUrl || currentTrack.cover} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <Music className="h-16 w-16 text-primary/50" />
                </div>
              )}
            </div>
            
            <div className="text-center mb-2">
              <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="no-track"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="w-32 h-32 rounded-lg bg-muted/30 flex items-center justify-center mb-4">
              <Music className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-center">
              Aucune piste en cours de lecture
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Sélectionnez une playlist ou créez une musique personnalisée
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Playback controls */}
      <div className="flex flex-col gap-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <Slider 
            value={[progress]} 
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            disabled={!currentTrack}
            className={`${currentTrack ? "" : "opacity-50"}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center gap-2 sm:gap-4">
          <Button 
            variant="ghost" 
            size={isMobile ? "icon" : "default"}
            onClick={() => previousTrack()}
            disabled={!currentTrack}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full opacity-90 hover:opacity-100 transition-opacity"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button 
              variant={isPlaying ? "secondary" : "default"}
              size="icon"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm"
              onClick={handleTogglePlay}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>
            
            {isPlaying && currentTrack && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-primary opacity-30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut" 
                }}
              />
            )}
          </motion.div>
          
          <Button 
            variant="ghost" 
            size={isMobile ? "icon" : "default"} 
            onClick={() => nextTrack()}
            disabled={!currentTrack}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full opacity-90 hover:opacity-100 transition-opacity"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Extra controls (Shuffle, Repeat) */}
        <div className="flex justify-center gap-4 pt-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
            disabled={!currentTrack}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
            disabled={!currentTrack}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
