
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { VRSessionWithMusicProps } from '@/types/vr';
import { X, PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

const VRSessionWithMusic: React.FC<VRSessionWithMusicProps> = ({
  sessionTemplate,
  onComplete,
  session,
  template,
  onExit,
  sessionId,
  title,
  description,
  duration,
  environment,
  musicTrackId
}) => {
  const [remainingTime, setRemainingTime] = useState(sessionTemplate?.duration || duration || 600);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  // Utiliser sessionTemplate ou template, suivant ce qui est disponible
  const activeSession = sessionTemplate || template;
  const sessionTitle = activeSession?.title || title || "Session VR";
  const sessionDescription = activeSession?.description || description || "Expérience de réalité virtuelle";

  // Timer pour faire écouler le temps
  useEffect(() => {
    let timer: number;
    
    if (isPlaying && remainingTime > 0) {
      timer = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, remainingTime, onComplete]);
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const progressPercent = activeSession 
    ? ((activeSession.duration - remainingTime) / activeSession.duration) * 100
    : duration 
      ? ((duration - remainingTime) / duration) * 100
      : 0;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      >
        <Card className="w-full max-w-lg">
          <CardHeader className="relative">
            <div className="absolute top-3 right-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={onExit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-xl font-semibold">{sessionTitle}</h3>
            <p className="text-muted-foreground">{sessionDescription}</p>
            <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl font-light">{formatTime(remainingTime)}</div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-primary/10" 
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <PauseCircle className="h-10 w-10" />
                  ) : (
                    <PlayCircle className="h-10 w-10" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 w-full max-w-xs mt-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full" 
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onExit}>
              Terminer
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => {
                if (onComplete) {
                  onComplete();
                }
              }}
            >
              {isPlaying ? 'Pause' : 'Reprendre'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default VRSessionWithMusic;
