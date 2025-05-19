
import React, { useState, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrackTitle, getTrackArtist, getTrackCover } from '@/utils/musicCompatibility';

const AnimatedMusicPlayer: React.FC = () => {
  const music = useMusic();
  const { 
    currentTrack,
    isPlaying,
    togglePlay,
    previous,
    next,
    volume,
    currentTime,
    duration,
    muted,
    seekTo,
    toggleMute,
    setVolume
  } = music;

  const [showVolume, setShowVolume] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime || 0) / (duration || 1) * 100);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration]);

  const formatTime = (seconds: number = 0) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (value: number[]) => {
    if (seekTo) {
      const newPosition = (value[0] / 100) * (duration || 0);
      seekTo(newPosition);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (setVolume) {
      setVolume(value[0] / 100);
    }
  };

  if (!currentTrack) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/30 border-0 shadow-md overflow-hidden">
        <CardContent className="p-6">
          <motion.div 
            className="flex flex-col items-center justify-center text-center py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Disc className="h-16 w-16 text-primary/50 mb-4 animate-spin-slow" />
            <h3 className="text-xl font-medium mb-2">Pas de musique en cours</h3>
            <p className="text-muted-foreground">Sélectionnez une piste pour commencer la lecture</p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const coverUrl = getTrackCover(currentTrack);
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/30 border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Cover image with blur overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {coverUrl && (
                <img 
                  src={coverUrl} 
                  alt={title}
                  className="w-full h-full object-cover blur-xl opacity-30 scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 dark:from-black/20 dark:to-black/60" />
            </div>
            
            <div className="relative p-6 z-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Album cover */}
                <motion.div 
                  className="w-48 h-48 rounded-lg shadow-lg overflow-hidden flex-shrink-0"
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  {coverUrl ? (
                    <img 
                      src={coverUrl} 
                      alt={title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900">
                      <Music className="h-16 w-16 text-white/50" />
                    </div>
                  )}
                </motion.div>
                
                {/* Controls and info */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="text-center md:text-left">
                    <AnimatePresence mode="wait">
                      <motion.h2 
                        key={title}
                        className="text-2xl font-bold text-foreground mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {title}
                      </motion.h2>
                    </AnimatePresence>
                    
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={artist}
                        className="text-md text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {artist}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="relative h-1.5 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "tween" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Control buttons */}
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-primary/10"
                      onClick={() => previous && previous()}
                    >
                      <SkipBack size={20} />
                    </Button>
                    
                    <Button
                      variant="default"
                      size="icon"
                      className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
                      onClick={() => togglePlay && togglePlay()}
                    >
                      <AnimatePresence mode="wait">
                        {isPlaying ? (
                          <motion.div
                            key="pause"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Pause size={24} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="play"
                            initial={{ scale: 0, x: 2 }}
                            animate={{ scale: 1, x: 2 }}
                            exit={{ scale: 0, x: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Play size={24} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full h-10 w-10 hover:bg-primary/10"
                      onClick={() => next && next()}
                    >
                      <SkipForward size={20} />
                    </Button>
                    
                    <div className="relative ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-10 w-10 hover:bg-primary/10"
                        onClick={() => toggleMute && toggleMute()}
                        onMouseEnter={() => setShowVolume(true)}
                      >
                        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </Button>
                      
                      {showVolume && (
                        <motion.div 
                          className="absolute bottom-full mb-2 pb-2 left-1/2 transform -translate-x-1/2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          onMouseLeave={() => setShowVolume(false)}
                        >
                          <div className="bg-card shadow-lg rounded-lg p-3 w-12 h-32 flex flex-col items-center">
                            <Slider
                              orientation="vertical"
                              value={[muted ? 0 : (volume || 0) * 100]}
                              max={100}
                              step={1}
                              onValueChange={handleVolumeChange}
                              className="h-24"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedMusicPlayer;
